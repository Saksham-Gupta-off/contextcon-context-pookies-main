import { crustdataClient } from "@/lib/crustdata/client";
import { companyArrayEnvelopeSchema, type CompanyArrayEnvelope } from "@/lib/crustdata/schemas";
import { getFundById } from "@/lib/funds/registry";
import { resolveIndustryKeyword } from "@/lib/fixtures/keywordIndustryMap";
import {
  readKeywordResolutionCache,
  writeKeywordResolution,
} from "@/lib/funds/cache";
import { extractThesisForCompany } from "@/lib/openai/thesisExtractor";
import { createLlmLimiter } from "@/lib/pipeline/concurrency";
import type { PipelineContext } from "@/lib/pipeline/orchestrator";
import type { DealThesis, MirroredDeal } from "@/lib/pipeline/types";

type EnrichRecord = CompanyArrayEnvelope[number];
type EnrichedCompanyData = EnrichRecord["matches"][number]["company_data"];

const ENRICH_FIELDS = [
  "basic_info",
  "funding",
  "headcount",
  "locations",
  "taxonomy",
  "competitors",
  "news",
  "people",
];

async function batchEnrichDeals(
  deals: MirroredDeal[],
  ctx: PipelineContext,
): Promise<Map<number, EnrichedCompanyData>> {
  const ids = Array.from(new Set(deals.map((deal) => deal.crustdataCompanyId)));

  if (ids.length === 0) {
    return new Map();
  }

  const call = crustdataClient.companyEnrich<CompanyArrayEnvelope>(
    {
      crustdata_company_ids: ids,
      fields: ENRICH_FIELDS,
    },
    (payload) => companyArrayEnvelopeSchema.parse(payload),
  );

  const records = await ctx.track(
    `Enrich ${ids.length} mirrored deals (basic_info + news + taxonomy + competitors)`,
    call,
  );

  const out = new Map<number, EnrichedCompanyData>();
  for (const record of records) {
    const top = record.matches[0]?.company_data;
    if (top) {
      out.set(top.crustdata_company_id, top);
    }
  }
  return out;
}

export async function runThesisExtractor(
  deals: MirroredDeal[],
  ctx: PipelineContext,
): Promise<DealThesis[]> {
  if (deals.length === 0) {
    return [];
  }

  const enriched = await batchEnrichDeals(deals, ctx);

  // Apply enriched data back into the deal records on the collector
  for (const deal of deals) {
    const data = enriched.get(deal.crustdataCompanyId);
    if (!data) continue;

    deal.description = deal.description ?? data.basic_info?.description ?? null;
    deal.industries = deal.industries ?? data.basic_info?.industries ?? null;
    deal.yearFounded = deal.yearFounded ?? data.basic_info?.year_founded ?? null;
    deal.headcountTotal = deal.headcountTotal ?? data.headcount?.total ?? null;
    deal.hqCountry = deal.hqCountry ?? data.locations?.hq_country ?? null;
    deal.hqCity = deal.hqCity ?? data.locations?.hq_city ?? null;
    deal.professionalNetworkIndustry =
      deal.professionalNetworkIndustry ??
      data.taxonomy?.professional_network_industry ??
      null;
    deal.fundingDate = deal.fundingDate ?? data.funding?.last_fundraise_date ?? null;
    deal.roundType = deal.roundType ?? data.funding?.last_round_type ?? null;
    deal.roundAmountUsd = deal.roundAmountUsd ?? data.funding?.last_round_amount_usd ?? null;
    deal.totalInvestmentUsd =
      deal.totalInvestmentUsd ?? data.funding?.total_investment_usd ?? null;
    if ((!deal.investors || deal.investors.length === 0) && data.funding?.investors?.length) {
      deal.investors = data.funding.investors;
    }
  }

  const keywordCache = await readKeywordResolutionCache();
  const limit = createLlmLimiter();

  type ExtractedRow = {
    deal: MirroredDeal;
    thesis: DealThesis;
    rationale: string;
    newAdjacentIndustries: string[];
  };

  const results = await Promise.all(
    deals.map((deal) =>
      limit(async (): Promise<ExtractedRow | null> => {
        const data = enriched.get(deal.crustdataCompanyId);
        const fund = getFundById(deal.fundId);
        const fundName = fund?.displayName ?? deal.fundId;

        const newsHeadlines =
          data?.news
            ?.filter((item) => item.article_title)
            .slice(0, 6)
            .map((item) => ({
              title: item.article_title ?? "",
              url: item.article_url ?? "",
              publishDate: item.article_publish_date ?? undefined,
            })) ?? [];

        let extracted;
        try {
          extracted = await extractThesisForCompany({
            companyName: deal.name,
            primaryDomain: deal.primaryDomain,
            description: deal.description ?? null,
            industry: deal.professionalNetworkIndustry ?? null,
            industries: deal.industries ?? null,
            fundName,
            roundType: deal.roundType ?? null,
            fundingDate: deal.fundingDate ?? null,
            competitorWebsites: data?.competitors?.websites ?? undefined,
            newsHeadlines,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "thesis llm failure";
          ctx.emit({
            type: "step.warning",
            payload: {
              step: "step2",
              message: `Thesis extraction failed for ${deal.name}: ${message}`,
            },
          });
          ctx.note(`step2/${deal.name}: ${message}`);
          return null;
        }

        const resolvedIndustries = new Set<string>();
        for (const keyword of extracted.thesis.marketKeywords) {
          const fromMap = resolveIndustryKeyword(keyword);
          if (fromMap) {
            resolvedIndustries.add(fromMap);
            continue;
          }
          const cached = keywordCache[keyword.trim().toLowerCase()];
          if (cached) {
            resolvedIndustries.add(cached);
          }
        }
        for (const adj of extracted.thesis.adjacentIndustries) {
          resolvedIndustries.add(adj);
        }
        if (deal.professionalNetworkIndustry) {
          resolvedIndustries.add(deal.professionalNetworkIndustry);
        }

        const thesis: DealThesis = {
          crustdataCompanyId: deal.crustdataCompanyId,
          ...extracted.thesis,
          resolvedIndustries: Array.from(resolvedIndustries).slice(0, 4),
          newsItems: newsHeadlines,
        };

        return {
          deal,
          thesis,
          rationale: extracted.rationale,
          newAdjacentIndustries: extracted.thesis.adjacentIndustries,
        };
      }),
    ),
  );

  const theses: DealThesis[] = [];
  // Emit + reasoning + persist new keyword resolutions in deal order so the UI
  // sees a deterministic, stable stream. File writes are serialized here so
  // the on-disk keyword map can never be corrupted by parallel writers.
  for (const row of results) {
    if (!row) continue;
    theses.push(row.thesis);
    ctx.emit({ type: "step2.thesis", payload: row.thesis });
    ctx.pushReasoning({
      step: "step2",
      companyName: row.deal.name,
      rationale: row.rationale,
    });

    for (const adj of row.newAdjacentIndustries) {
      const lower = adj.trim().toLowerCase();
      if (!keywordCache[lower] && !resolveIndustryKeyword(lower)) {
        await writeKeywordResolution(lower, adj);
        keywordCache[lower] = adj;
      }
    }
  }

  return theses;
}
