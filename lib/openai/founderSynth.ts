import { z } from "zod";
import { openAiClient } from "@/lib/openai/client";

const founderSynthSchema = z.object({
  founders: z
    .array(
      z.object({
        name: z.string(),
        archetype: z.enum([
          "repeat-operator",
          "domain-expert",
          "technical-builder",
          "first-time-founder",
          "unknown",
        ]),
        highlights: z.array(z.string().min(4).max(140)).min(0).max(4),
        caveats: z.array(z.string().min(4).max(140)).min(0).max(2),
        dossierHeadline: z.string().min(8).max(180),
      }),
    )
    .min(0),
});

export type FounderSynthInput = {
  companyName: string;
  thesisOneLiner: string;
  founders: Array<{
    name: string;
    title?: string;
    headline?: string;
    pastExperience: Array<{ company: string; title?: string }>;
    schools: Array<{ name?: string; degree?: string }>;
    rawSignals: {
      priorFounder: boolean;
      bigTechAlum: boolean;
      domainExperienceYears: number;
      repeatCofounderPair: boolean;
      topUniversity: boolean;
      socialPresence: boolean;
      recentlyChangedJob: boolean;
    };
  }>;
};

export async function synthesizeFounderDossier(input: FounderSynthInput) {
  if (input.founders.length === 0) {
    return { founders: [] };
  }

  const block = input.founders
    .map((f) => {
      const past = f.pastExperience
        .slice(0, 6)
        .map((p) => `${p.title ?? "?"} @ ${p.company}`)
        .join("; ");
      const schools = f.schools
        .slice(0, 3)
        .map((s) => `${s.degree ?? "?"} from ${s.name ?? "?"}`)
        .join("; ");
      return `Founder: ${f.name}
Title: ${f.title ?? "?"}
Headline: ${f.headline ?? "?"}
Past: ${past || "(unknown)"}
Schools: ${schools || "(unknown)"}
Signals: priorFounder=${f.rawSignals.priorFounder} bigTechAlum=${f.rawSignals.bigTechAlum} topUniversity=${f.rawSignals.topUniversity} repeatCofounderPair=${f.rawSignals.repeatCofounderPair} socialPresence=${f.rawSignals.socialPresence} domainYears=${f.rawSignals.domainExperienceYears} recentlyChangedJob=${f.rawSignals.recentlyChangedJob}`;
    })
    .join("\n\n");

  const result = await openAiClient.generateObject({
    system: `You are a venture analyst writing crisp founder dossier blurbs. Use only
the supplied facts and the boolean signals. Do not invent companies, dates,
or accolades. For each founder, set the most accurate archetype, write up to 4
short factual highlights (e.g. "Ex-Stripe payments lead", "Co-founded YC W22 startup"),
up to 2 caveats (e.g. "First-time founder", "Recent job change suggests pivot"),
and a one-sentence dossierHeadline that captures their edge for this company.
Always return one entry per input founder, in the same order.`,
    prompt: `Company: ${input.companyName}
Thesis: ${input.thesisOneLiner}

${block}`,
    schema: founderSynthSchema,
    schemaName: "FounderDossier",
    schemaDescription: "Founder dossier blurbs grounded in raw signals.",
  });

  return result.object;
}
