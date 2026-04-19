import { crustdataClient } from "@/lib/crustdata/client";
import { companyArrayEnvelopeSchema, type CompanyArrayEnvelope } from "@/lib/crustdata/schemas";
import type { PipelineContext } from "@/lib/pipeline/orchestrator";
import { computeRiskFlag } from "@/lib/scoring/risk";
import { computeTractionScore } from "@/lib/scoring/traction";
import type { CounterpartCompany, RiskFlag, TractionScore } from "@/lib/pipeline/types";

const ENRICH_FIELDS = [
  "basic_info",
  "headcount",
  "hiring",
  "web_traffic",
  "funding",
  "people",
];

type EnrichRecord = CompanyArrayEnvelope[number];
type EnrichedCompanyData = EnrichRecord["matches"][number]["company_data"];

type GrowthMetrics =
  | number
  | {
      mom?: number | null;
      qoq?: number | null;
      six_months?: number | null;
      yoy?: number | null;
      two_years?: number | null;
    }
  | null
  | undefined;

type TrafficSnapshot =
  | {
      monthly_visitors?: number | null;
    }
  | Record<string, { monthly_visitors?: number | null }>
  | null
  | undefined;

function normalizeDomain(domainOrUrl: string | null | undefined) {
  if (!domainOrUrl) {
    return null;
  }

  const trimmed = domainOrUrl.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return trimmed
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase();
  }
}

function selectGrowthMetric(
  growth: GrowthMetrics,
  preference: Array<"six_months" | "yoy" | "qoq" | "mom" | "two_years">,
) {
  if (typeof growth === "number") {
    return growth;
  }

  if (!growth || typeof growth !== "object") {
    return null;
  }

  for (const key of preference) {
    const value = growth[key];
    if (typeof value === "number") {
      return value;
    }
  }

  return null;
}

function extractMonthlyVisitors(
  domainTraffic: TrafficSnapshot,
  preferredDomain: string | null | undefined,
) {
  if (!domainTraffic || typeof domainTraffic !== "object") {
    return null;
  }

  if ("monthly_visitors" in domainTraffic) {
    return domainTraffic.monthly_visitors ?? null;
  }

  const normalizedPreferred = normalizeDomain(preferredDomain);

  if (normalizedPreferred) {
    for (const [domain, snapshot] of Object.entries(domainTraffic)) {
      const normalizedDomain = normalizeDomain(domain);
      if (
        normalizedDomain &&
        (normalizedDomain === normalizedPreferred ||
          normalizedDomain.endsWith(`.${normalizedPreferred}`) ||
          normalizedPreferred.endsWith(`.${normalizedDomain}`))
      ) {
        return snapshot?.monthly_visitors ?? null;
      }
    }
  }

  const firstSnapshot = Object.values(domainTraffic)[0];
  return firstSnapshot?.monthly_visitors ?? null;
}

export type Step4Output = {
  traction: TractionScore[];
  risk: RiskFlag[];
  enriched: Map<number, EnrichedCompanyData>;
};

export async function runTractionScorer(
  counterparts: CounterpartCompany[],
  ctx: PipelineContext,
): Promise<Step4Output> {
  if (counterparts.length === 0) {
    return { traction: [], risk: [], enriched: new Map() };
  }

  const ids = Array.from(
    new Set(counterparts.map((c) => c.crustdataCompanyId)),
  );

  const call = crustdataClient.companyEnrich<CompanyArrayEnvelope>(
    {
      crustdata_company_ids: ids,
      fields: ENRICH_FIELDS,
    },
    (payload) => companyArrayEnvelopeSchema.parse(payload),
  );

  const records = await ctx.track(
    `Enrich ${ids.length} counterparts (hiring + web_traffic + headcount)`,
    call,
  );

  const enriched = new Map<number, EnrichedCompanyData>();
  for (const record of records) {
    const top = record.matches[0]?.company_data;
    if (top) enriched.set(top.crustdata_company_id, top);
  }

  const traction: TractionScore[] = [];
  const risk: RiskFlag[] = [];

  for (const counterpart of counterparts) {
    const data = enriched.get(counterpart.crustdataCompanyId);
    const hiringGrowth = selectGrowthMetric(
      data?.hiring?.openings_growth_percent,
      ["qoq", "mom", "yoy", "six_months", "two_years"],
    );
    const headcountGrowth = selectGrowthMetric(
      data?.headcount?.growth_percent,
      ["six_months", "yoy", "qoq", "mom", "two_years"],
    );
    const monthlyVisitors = extractMonthlyVisitors(
      data?.web_traffic?.domain_traffic,
      counterpart.primaryDomain,
    );

    const t = computeTractionScore({
      crustdataCompanyId: counterpart.crustdataCompanyId,
      headcountTotal: counterpart.headcountTotal,
      headcountGrowth,
      hiringOpenings: data?.hiring?.openings_count ?? null,
      hiringGrowth,
      hiringRecentTitlesCsv: data?.hiring?.recent_titles_csv ?? null,
      webTrafficMonthlyVisitors: monthlyVisitors,
    });

    const r = computeRiskFlag({
      crustdataCompanyId: counterpart.crustdataCompanyId,
      totalInvestmentUsd: counterpart.totalInvestmentUsd,
      roundType: counterpart.roundType,
      fundingDate: counterpart.fundingDate,
      headcountTotal: counterpart.headcountTotal,
      headcountGrowth,
      investorsCount: counterpart.investors?.length ?? 0,
    });

    traction.push(t);
    risk.push(r);

    ctx.emit({
      type: "step4.traction",
      payload: { traction: t, risk: r },
    });
  }

  return { traction, risk, enriched };
}
