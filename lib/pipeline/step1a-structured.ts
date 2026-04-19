import { crustdataClient } from "@/lib/crustdata/client";
import {
  type CompanyAutocompleteResponse,
  type CompanySearchResponse,
  companyAutocompleteResponseSchema,
  companySearchResponseSchema,
} from "@/lib/crustdata/schemas";
import { LIMITS } from "@/lib/pipeline/limits";
import type { PipelineContext } from "@/lib/pipeline/orchestrator";
import type { MirroredDeal, MirrorVcStage, RunConfig } from "@/lib/pipeline/types";
import { FUNDS, getFundById } from "@/lib/funds/registry";
import type { FundConfig, FundId } from "@/lib/funds/types";
import {
  readFundRuntimeCache,
  writeFundRuntimeCache,
} from "@/lib/funds/cache";

const STAGE_ORDER: MirrorVcStage[] = ["pre_seed", "seed", "series_a"];

type Step1aResult = {
  deals: MirroredDeal[];
  resolvedInvestorNames: Record<FundId, string[]>;
};

function toIsoDate(daysAgo: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function resolveStageRange(minStage: MirrorVcStage, maxStage: MirrorVcStage) {
  const start = STAGE_ORDER.indexOf(minStage);
  const end = STAGE_ORDER.indexOf(maxStage);

  if (start === -1 || end === -1 || start > end) {
    return ["pre_seed", "seed", "series_a"] satisfies MirrorVcStage[];
  }

  return STAGE_ORDER.slice(start, end + 1);
}

function normalizeSuggestionMatch(alias: string, suggestions: string[]) {
  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const aliasNormalized = normalize(alias);

  return suggestions.filter(
    (suggestion) => normalize(suggestion) === aliasNormalized,
  );
}

async function resolveInvestorNames(fund: FundConfig, ctx?: PipelineContext) {
  const cached = await readFundRuntimeCache(fund.id);

  if (cached?.resolvedInvestorNames?.length) {
    return cached.resolvedInvestorNames;
  }

  const resolved = new Set<string>();

  for (const alias of fund.aliases) {
    const call = crustdataClient.companyAutocomplete<CompanyAutocompleteResponse>(
      {
        field: "funding.investors",
        query: alias,
        limit: 10,
      },
      (payload) => companyAutocompleteResponseSchema.parse(payload),
    );

    const response = ctx
      ? await ctx.track(`Resolve investor alias "${alias}" for ${fund.displayName}`, call)
      : (await call).payload;

    const suggestions = response.suggestions.map(
      (suggestion) => suggestion.value,
    );

    for (const match of normalizeSuggestionMatch(alias, suggestions)) {
      resolved.add(match);
    }
  }

  for (const match of normalizeSuggestionMatch(fund.displayName, [fund.displayName])) {
    resolved.add(match);
  }

  const resolvedNames =
    resolved.size > 0 ? [...resolved] : [fund.displayName];

  await writeFundRuntimeCache(fund.id, {
    resolvedInvestorNames: resolvedNames,
  });

  return resolvedNames;
}

function companyToDeal(
  fundId: FundId,
  company: CompanySearchResponse["companies"][number],
): MirroredDeal {
  return {
    crustdataCompanyId: company.crustdata_company_id,
    name: company.basic_info?.name ?? `Company ${company.crustdata_company_id}`,
    primaryDomain: company.basic_info?.primary_domain ?? undefined,
    fundingDate: company.funding?.last_fundraise_date ?? null,
    roundType: company.funding?.last_round_type ?? null,
    roundAmountUsd: company.funding?.last_round_amount_usd ?? null,
    totalInvestmentUsd: company.funding?.total_investment_usd ?? null,
    investors: company.funding?.investors ?? [],
    headcountTotal: company.headcount?.total ?? null,
    hqCountry: company.locations?.hq_country ?? null,
    hqCity: company.locations?.hq_city ?? null,
    professionalNetworkIndustry:
      company.taxonomy?.professional_network_industry ?? null,
    industries: company.basic_info?.industries ?? null,
    description: company.basic_info?.description ?? null,
    yearFounded: company.basic_info?.year_founded ?? null,
    source: "structured",
    fundId,
  };
}

async function fetchRecentDealsForFund(
  fund: FundConfig,
  config: RunConfig,
  resolvedInvestorNames: string[],
  ctx?: PipelineContext,
) {
  const allowedStages = resolveStageRange(config.minStage, config.maxStage);
  const investorFilter =
    resolvedInvestorNames.length === 1
      ? {
          field: "funding.investors",
          type: "(.)",
          value: resolvedInvestorNames[0],
        }
      : {
          op: "or",
          conditions: resolvedInvestorNames.map((investorName) => ({
            field: "funding.investors",
            type: "(.)",
            value: investorName,
          })),
        };

  const call = crustdataClient.companySearch<CompanySearchResponse>(
    {
      // Crustdata's screener does not accept `locations.hq_country` as a
      // filter condition (only as a returned field), so geo blocking is done
      // client-side below.
      filters: {
        op: "and",
        conditions: [
          investorFilter,
          {
            field: "funding.last_fundraise_date",
            type: ">",
            value: toIsoDate(180),
          },
          {
            field: "funding.last_round_type",
            type: "in",
            value: allowedStages,
          },
        ],
      },
      sorts: [{ column: "funding.last_fundraise_date", order: "desc" }],
      // Pull a wider window so the post-filter still gives us enough deals
      // after geo blocking is applied client-side.
      limit: LIMITS.dealsPerFund * 4,
      fields: [
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
      ],
    },
    (payload) => companySearchResponseSchema.parse(payload),
  );

  const response = ctx
    ? await ctx.track(`Search recent ${fund.displayName} deals`, call)
    : (await call).payload;

  const blockedGeos = new Set(
    config.blockedGeos.map((country) => country.trim().toLowerCase()),
  );

  return response.companies
    .map((company) => companyToDeal(fund.id, company))
    .filter((deal) => {
      if (!blockedGeos.size) return true;
      const country = (deal.hqCountry ?? "").trim().toLowerCase();
      return country === "" || !blockedGeos.has(country);
    })
    .sort((left, right) =>
      (right.fundingDate ?? "").localeCompare(left.fundingDate ?? ""),
    )
    .slice(0, LIMITS.dealsPerFund);
}

export async function runStructuredFundWatcher(
  config: RunConfig,
  ctx?: PipelineContext,
): Promise<Step1aResult> {
  const selectedFunds = config.fundsToMirror
    .map((fundId) => getFundById(fundId))
    .filter((fund): fund is FundConfig => Boolean(fund))
    .slice(0, LIMITS.fundsToMirror);

  const resolvedInvestorNames = {} as Record<FundId, string[]>;
  const deals: MirroredDeal[] = [];

  for (const fund of selectedFunds.length ? selectedFunds : FUNDS.slice(0, LIMITS.fundsToMirror)) {
    try {
      const investorNames = await resolveInvestorNames(fund, ctx);
      resolvedInvestorNames[fund.id] = investorNames;

      const fundDeals = await fetchRecentDealsForFund(fund, config, investorNames, ctx);
      deals.push(...fundDeals);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "unknown failure";
      ctx?.emit({
        type: "step.warning",
        payload: {
          step: "step1a",
          message: `${fund.displayName} skipped: ${message}`,
        },
      });
      ctx?.note(`step1a/${fund.id}: ${message}`);
    }
  }

  return {
    deals,
    resolvedInvestorNames,
  };
}
