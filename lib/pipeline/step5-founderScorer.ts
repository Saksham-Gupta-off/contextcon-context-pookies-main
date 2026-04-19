import { crustdataClient } from "@/lib/crustdata/client";
import { type CompanyArrayEnvelope, personArrayEnvelopeSchema, type PersonArrayEnvelope } from "@/lib/crustdata/schemas";
import { synthesizeFounderDossier } from "@/lib/openai/founderSynth";
import { createLlmLimiter } from "@/lib/pipeline/concurrency";
import { LIMITS } from "@/lib/pipeline/limits";
import type { PipelineContext } from "@/lib/pipeline/orchestrator";
import {
  buildCofounderEmployerSet,
  deriveRawSignals,
  deterministicFounderScore,
  inferArchetype,
  type FounderRawInput,
} from "@/lib/scoring/founder";
import type {
  CompanyFounderScore,
  CounterpartCompany,
  DealThesis,
  FounderProfile,
} from "@/lib/pipeline/types";

type EnrichRecord = CompanyArrayEnvelope[number];
type EnrichedCompanyData = EnrichRecord["matches"][number]["company_data"];

function pickFoundersFromEnriched(
  data: EnrichedCompanyData | undefined,
  cap: number,
) {
  const founders = data?.people?.founders ?? [];
  return founders.slice(0, cap);
}

function profileUrlFromFounder(
  founder:
    | {
        professional_network_profile_url?: string | null | undefined;
      }
    | undefined,
) {
  return founder?.professional_network_profile_url ?? undefined;
}

function buildFounderRawInput(
  baseName: string,
  baseTitle: string | undefined,
  enrichedPerson: PersonArrayEnvelope[number]["matches"][number]["person_data"] | undefined,
): FounderRawInput {
  const headline = enrichedPerson?.basic_profile?.headline;
  const followers = enrichedPerson?.professional_network?.followers ?? null;
  const twitterSlug = enrichedPerson?.social_handles?.twitter_identifier?.slug;
  const recentlyChangedJob = enrichedPerson?.recently_changed_jobs ?? null;

  const past = (enrichedPerson?.experience?.employment_details?.past ?? []).map(
    (exp) => ({
      company: exp.company_name ?? "",
      title: exp.title,
      startDate: exp.start_date,
      endDate: exp.end_date,
    }),
  );
  const current = (enrichedPerson?.experience?.employment_details?.current ?? []).map(
    (exp) => ({
      company: exp.company_name ?? "",
      title: exp.title,
      startDate: exp.start_date,
    }),
  );
  const pastExperience = [...current, ...past].filter((exp) => exp.company);

  const schools = (enrichedPerson?.education?.schools ?? []).map((school) => ({
    name: school.school_name,
    degree: school.degree_name,
  }));

  return {
    name: enrichedPerson?.basic_profile?.name ?? baseName,
    title: enrichedPerson?.basic_profile?.current_title ?? baseTitle,
    headline,
    followers,
    twitterSlug,
    recentlyChangedJob,
    pastExperience,
    schools,
    crustdataPersonId: enrichedPerson?.crustdata_person_id,
  };
}

export async function runFounderScorer(
  counterparts: CounterpartCompany[],
  step4Enriched: Map<number, EnrichedCompanyData>,
  theses: DealThesis[],
  ctx: PipelineContext,
): Promise<CompanyFounderScore[]> {
  if (counterparts.length === 0) return [];

  // Collect all founder LinkedIn URLs across counterparts (capped per company)
  type FounderRow = {
    counterpartId: number;
    counterpartName: string;
    baseName: string;
    baseTitle?: string;
    profileUrl?: string;
    joinedDate?: string;
  };

  const founderRows: FounderRow[] = [];
  for (const counterpart of counterparts) {
    const enriched = step4Enriched.get(counterpart.crustdataCompanyId);
    const founders = pickFoundersFromEnriched(enriched, LIMITS.foundersPerCompany);
    for (const founder of founders) {
      founderRows.push({
        counterpartId: counterpart.crustdataCompanyId,
        counterpartName: counterpart.name,
        baseName: founder.name ?? "Unknown founder",
        baseTitle: founder.title ?? undefined,
        profileUrl: profileUrlFromFounder(founder) ?? undefined,
        joinedDate: founder.joined_date ?? undefined,
      });
    }
  }

  const allUrls = founderRows
    .map((row) => row.profileUrl)
    .filter((url): url is string => Boolean(url));
  const uniqueUrls = Array.from(new Set(allUrls));

  let enrichedByUrl = new Map<string, PersonArrayEnvelope[number]["matches"][number]["person_data"]>();

  if (uniqueUrls.length) {
    try {
      const call = crustdataClient.personEnrich<PersonArrayEnvelope>(
        { professional_network_profile_urls: uniqueUrls },
        (payload) => personArrayEnvelopeSchema.parse(payload),
      );
      const records = await ctx.track(
        `Enrich ${uniqueUrls.length} founder LinkedIn profiles`,
        call,
      );
      for (const record of records) {
        const top = record.matches[0]?.person_data;
        if (top) enrichedByUrl.set(record.matched_on, top);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "person enrich failure";
      ctx.emit({
        type: "step.warning",
        payload: {
          step: "step5",
          message: `Person enrich failed; founder scoring will degrade: ${message}`,
        },
      });
      enrichedByUrl = new Map();
    }
  }

  const thesesById = new Map(theses.map((thesis) => [thesis.crustdataCompanyId, thesis]));
  const limit = createLlmLimiter();

  type ScoredRow = {
    score: CompanyFounderScore;
    finalProfiles: FounderProfile[];
    counterpartName: string;
  };

  const scoredRows = await Promise.all(
    counterparts.map((counterpart) =>
      limit(async (): Promise<ScoredRow> => {
        const rows = founderRows.filter(
          (row) => row.counterpartId === counterpart.crustdataCompanyId,
        );

        const rawInputs: FounderRawInput[] = rows.map((row) => {
          const enriched = row.profileUrl
            ? enrichedByUrl.get(row.profileUrl)
            : undefined;
          return buildFounderRawInput(row.baseName, row.baseTitle, enriched);
        });

        const cofounderEmployerSets = buildCofounderEmployerSet(rawInputs);

        const profilesPreSynth: Array<
          FounderProfile & { synthSeedIndex: number }
        > = rawInputs.map((raw, idx) => {
          const signals = deriveRawSignals(raw, cofounderEmployerSets[idx]);
          const composite = deterministicFounderScore(signals);
          const archetype = inferArchetype(signals);
          const profile: FounderProfile = {
            crustdataPersonId: raw.crustdataPersonId,
            name: raw.name,
            title: raw.title,
            headline: raw.headline,
            linkedinUrl: rows[idx]?.profileUrl,
            twitterSlug: raw.twitterSlug,
            followers: raw.followers ?? undefined,
            joinedDate: rows[idx]?.joinedDate,
            rawSignals: signals,
            archetype,
            composite,
            highlights: [],
            dossierHeadline: `${raw.name} (${archetype})`,
            caveats: [],
          };
          return { ...profile, synthSeedIndex: idx };
        });

        if (profilesPreSynth.length === 0) {
          const empty: CompanyFounderScore = {
            crustdataCompanyId: counterpart.crustdataCompanyId,
            founders: [],
            averageScore: 30,
            hasRepeatOperator: false,
            composite: 30,
          };
          return {
            score: empty,
            finalProfiles: [],
            counterpartName: counterpart.name,
          };
        }

        const thesis = thesesById.get(counterpart.mirroredFromCompanyId);

        let synth: Awaited<ReturnType<typeof synthesizeFounderDossier>> = {
          founders: [],
        };
        try {
          synth = await synthesizeFounderDossier({
            companyName: counterpart.name,
            thesisOneLiner:
              thesis?.thesisOneLiner ?? "Earlier-stage counterpart",
            founders: rawInputs.map((raw, idx) => ({
              name: raw.name,
              title: raw.title,
              headline: raw.headline,
              pastExperience: raw.pastExperience.slice(0, 6),
              schools: raw.schools.slice(0, 3),
              rawSignals: profilesPreSynth[idx].rawSignals,
            })),
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "founder synth failure";
          ctx.emit({
            type: "step.warning",
            payload: {
              step: "step5",
              message: `LLM founder synth failed for ${counterpart.name}: ${message}`,
            },
          });
        }

        const finalProfiles: FounderProfile[] = profilesPreSynth.map(
          (profile, idx) => {
            const synthEntry = synth.founders[idx];
            return {
              ...profile,
              archetype: synthEntry?.archetype ?? profile.archetype,
              highlights: synthEntry?.highlights ?? [],
              caveats: synthEntry?.caveats ?? [],
              dossierHeadline:
                synthEntry?.dossierHeadline ?? profile.dossierHeadline,
            };
          },
        );

        const avg = Math.round(
          finalProfiles.reduce((s, p) => s + p.composite, 0) /
            finalProfiles.length,
        );
        const hasRepeatOperator = finalProfiles.some(
          (p) => p.archetype === "repeat-operator",
        );
        const composite = Math.min(100, avg + (hasRepeatOperator ? 8 : 0));

        return {
          score: {
            crustdataCompanyId: counterpart.crustdataCompanyId,
            founders: finalProfiles,
            averageScore: avg,
            hasRepeatOperator,
            composite,
          },
          finalProfiles,
          counterpartName: counterpart.name,
        };
      }),
    ),
  );

  const out: CompanyFounderScore[] = [];
  for (const row of scoredRows) {
    out.push(row.score);
    ctx.emit({ type: "step5.founders", payload: row.score });
    for (const profile of row.finalProfiles) {
      ctx.pushReasoning({
        step: "step5",
        companyName: `${row.counterpartName} – ${profile.name}`,
        rationale: profile.dossierHeadline,
      });
    }
  }

  return out;
}
