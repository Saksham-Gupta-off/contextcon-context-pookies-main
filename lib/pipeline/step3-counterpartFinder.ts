import { crustdataClient } from "@/lib/crustdata/client";
import {
  type CompanySearchResponse,
  companySearchResponseSchema,
} from "@/lib/crustdata/schemas";
import { getFundById } from "@/lib/funds/registry";
import { rerankCounterparts } from "@/lib/openai/counterpartRanker";
import { createLlmLimiter } from "@/lib/pipeline/concurrency";
import { LIMITS } from "@/lib/pipeline/limits";
import type { PipelineContext } from "@/lib/pipeline/orchestrator";
import type {
  CounterpartCompany,
  DealThesis,
  MirroredDeal,
  MirrorVcStage,
  RunConfig,
} from "@/lib/pipeline/types";
import { computeValuationProxy } from "@/lib/scoring/valuationProxy";

const STAGE_ORDER: MirrorVcStage[] = ["pre_seed", "seed", "series_a"];

function earlierStagesThan(stage: string | null | undefined): MirrorVcStage[] {
  const lower = (stage ?? "").toLowerCase();
  if (lower.includes("series_a") || lower.includes("series a")) {
    return ["pre_seed", "seed"];
  }
  if (lower.includes("seed")) {
    return ["pre_seed", "seed"];
  }
  return STAGE_ORDER;
}

const SEARCH_FIELDS = [
  "crustdata_company_id",
  "basic_info.name",
  "basic_info.primary_domain",
  "basic_info.description",
  "basic_info.industries",
  "basic_info.year_founded",
  "funding.last_fundraise_date",
  "funding.last_round_type",
  "funding.last_round_amount_usd",
  "funding.total_investment_usd",
  "funding.investors",
  "headcount.total",
  "locations.hq_country",
  "locations.hq_city",
  "taxonomy.professional_network_industry",
];

async function searchCounterpartsForDeal(
  deal: MirroredDeal,
  thesis: DealThesis,
  config: RunConfig,
  ctx: PipelineContext,
): Promise<CompanySearchResponse["companies"]> {
  if (thesis.resolvedIndustries.length === 0) {
    return [];
  }

  const earlier = earlierStagesThan(deal.roundType);
  const headcountCap =
    deal.headcountTotal && deal.headcountTotal > 5
      ? Math.max(deal.headcountTotal, 25)
      : 50;

  const call = crustdataClient.companySearch<CompanySearchResponse>(
    {
      filters: {
        op: "and",
        conditions: [
          {
            op: "or",
            conditions: [
              {
                field: "basic_info.industries",
                type: "in",
                value: thesis.resolvedIndustries,
              },
              {
                field: "taxonomy.professional_network_industry",
                type: "in",
                value: thesis.resolvedIndustries,
              },
            ],
          },
          {
            field: "funding.last_round_type",
            type: "in",
            value: earlier,
          },
          {
            field: "crustdata_company_id",
            type: "not_in",
            value: [deal.crustdataCompanyId],
          },
          {
            field: "headcount.total",
            type: "<",
            value: headcountCap,
          },
          ...(config.blockedGeos.length
            ? [
                {
                  field: "locations.hq_country",
                  type: "not_in",
                  value: config.blockedGeos,
                },
              ]
            : []),
        ],
      },
      sorts: [{ column: "funding.last_fundraise_date", order: "desc" }],
      limit: LIMITS.counterpartsSearchedPerDeal,
      fields: SEARCH_FIELDS,
    },
    (payload) => companySearchResponseSchema.parse(payload),
  );

  const response = await ctx.track(
    `Search counterparts for ${deal.name} (industries: ${thesis.resolvedIndustries.slice(0, 2).join(", ")})`,
    call,
  );

  return response.companies;
}

function isOnThesisAfterRerank(
  thesisAlignment: number,
  timingMatch: boolean,
  redFlag: string | null,
) {
  if (redFlag) return false;
  if (!timingMatch) return false;
  return thesisAlignment >= 60;
}

type DealCounterpartResult = {
  deal: MirroredDeal;
  ranked: Array<{
    counterpart: CounterpartCompany;
    rationale: string;
  }>;
};

export async function runCounterpartFinder(
  deals: MirroredDeal[],
  theses: DealThesis[],
  config: RunConfig,
  ctx: PipelineContext,
): Promise<CounterpartCompany[]> {
  const thesesById = new Map(theses.map((thesis) => [thesis.crustdataCompanyId, thesis]));
  const limit = createLlmLimiter();

  const perDeal = await Promise.all(
    deals.map((deal) =>
      limit(async (): Promise<DealCounterpartResult | null> => {
        const thesis = thesesById.get(deal.crustdataCompanyId);
        if (!thesis) return null;

        let candidates: CompanySearchResponse["companies"] = [];
        try {
          candidates = await searchCounterpartsForDeal(deal, thesis, config, ctx);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "search failure";
          ctx.emit({
            type: "step.warning",
            payload: {
              step: "step3",
              message: `Counterpart search failed for ${deal.name}: ${message}`,
            },
          });
          return null;
        }

        if (candidates.length === 0) {
          ctx.emit({
            type: "step.warning",
            payload: {
              step: "step3",
              message: `No early-stage candidates returned for ${deal.name}'s thesis (${thesis.thesisOneLiner}).`,
            },
          });
          return null;
        }

        const fund = getFundById(deal.fundId);
        const fundName = fund?.displayName ?? deal.fundId;

        let ranked;
        try {
          ranked = await rerankCounterparts(
            {
              mirroredCompanyName: deal.name,
              fundName,
              thesisOneLiner: thesis.thesisOneLiner,
              beliefStatement: thesis.beliefStatement,
              marketKeywords: thesis.marketKeywords,
              marketTiming: thesis.marketTiming,
              wedge: thesis.wedge,
              redFlagsForCounterparts: thesis.redFlagsForCounterparts,
            },
            candidates.map((c) => ({
              crustdataCompanyId: c.crustdata_company_id,
              name: c.basic_info?.name ?? `Company ${c.crustdata_company_id}`,
              primaryDomain: c.basic_info?.primary_domain ?? undefined,
              description: c.basic_info?.description ?? null,
              industries: c.basic_info?.industries ?? null,
              headcountTotal: c.headcount?.total ?? null,
              yearFounded: c.basic_info?.year_founded ?? null,
              roundType: c.funding?.last_round_type ?? null,
              totalInvestmentUsd: c.funding?.total_investment_usd ?? null,
              hqCountry: c.locations?.hq_country ?? null,
            })),
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "rerank failure";
          ctx.emit({
            type: "step.warning",
            payload: {
              step: "step3",
              message: `LLM rerank failed for ${deal.name}: ${message}`,
            },
          });
          return null;
        }

        const candidatesById = new Map(
          candidates.map((c) => [c.crustdata_company_id, c]),
        );

        const sorted = ranked
          .filter((r) =>
            isOnThesisAfterRerank(r.thesisAlignment, r.timingMatch, r.redFlag),
          )
          .sort((a, b) => b.thesisAlignment - a.thesisAlignment)
          .slice(0, LIMITS.counterpartsKeptPerDeal);

        const built: DealCounterpartResult["ranked"] = [];
        for (const rankItem of sorted) {
          const candidate = candidatesById.get(rankItem.crustdataCompanyId);
          if (!candidate) continue;

          const valuation = computeValuationProxy({
            roundType: candidate.funding?.last_round_type ?? null,
            headcountTotal: candidate.headcount?.total ?? null,
            yearFounded: candidate.basic_info?.year_founded ?? null,
            totalInvestmentUsd: candidate.funding?.total_investment_usd ?? null,
            roundAmountUsd: candidate.funding?.last_round_amount_usd ?? null,
            investors: candidate.funding?.investors ?? [],
          });

          const counterpart: CounterpartCompany = {
            crustdataCompanyId: candidate.crustdata_company_id,
            mirroredFromCompanyId: deal.crustdataCompanyId,
            mirroredFromName: deal.name,
            fundId: deal.fundId,
            name:
              candidate.basic_info?.name ??
              `Company ${candidate.crustdata_company_id}`,
            primaryDomain: candidate.basic_info?.primary_domain ?? undefined,
            description: candidate.basic_info?.description ?? null,
            fundingDate: candidate.funding?.last_fundraise_date ?? null,
            roundType: candidate.funding?.last_round_type ?? null,
            roundAmountUsd: candidate.funding?.last_round_amount_usd ?? null,
            totalInvestmentUsd: candidate.funding?.total_investment_usd ?? null,
            investors: candidate.funding?.investors ?? [],
            headcountTotal: candidate.headcount?.total ?? null,
            hqCountry: candidate.locations?.hq_country ?? null,
            hqCity: candidate.locations?.hq_city ?? null,
            professionalNetworkIndustry:
              candidate.taxonomy?.professional_network_industry ?? null,
            yearFounded: candidate.basic_info?.year_founded ?? null,
            thesisAlignment: rankItem.thesisAlignment,
            thesisRationale: rankItem.rationale,
            timingMatch: rankItem.timingMatch,
            llmRedFlag: rankItem.redFlag,
            valuationProxy: valuation,
          };

          built.push({ counterpart, rationale: rankItem.rationale });
        }

        return { deal, ranked: built };
      }),
    ),
  );

  // Merge in deterministic deal order, dedupe by counterpart id, and respect
  // the global cap. Emission stays serial so the live UI receives a stable
  // ordered stream even though the LLM work happened in parallel.
  const results: CounterpartCompany[] = [];
  const seenCounterpartIds = new Set<number>();

  outer: for (const dealResult of perDeal) {
    if (!dealResult) continue;
    for (const { counterpart, rationale } of dealResult.ranked) {
      if (seenCounterpartIds.has(counterpart.crustdataCompanyId)) continue;
      seenCounterpartIds.add(counterpart.crustdataCompanyId);
      results.push(counterpart);
      ctx.emit({ type: "step3.counterpart", payload: counterpart });
      ctx.pushReasoning({
        step: "step3",
        companyName: counterpart.name,
        rationale,
      });
      if (results.length >= LIMITS.totalCounterparts) break outer;
    }
  }

  return results;
}
