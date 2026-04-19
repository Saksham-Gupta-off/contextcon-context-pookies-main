import type { ValuationProxy } from "@/lib/pipeline/types";

const TIER_1_INVESTORS = new Set(
  [
    "sequoia capital",
    "andreessen horowitz",
    "a16z",
    "benchmark",
    "accel",
    "founders fund",
    "khosla ventures",
    "kleiner perkins",
    "greylock",
    "lightspeed venture partners",
    "y combinator",
    "general catalyst",
    "thrive capital",
    "tiger global",
    "coatue",
    "insight partners",
    "index ventures",
    "spark capital",
    "first round capital",
    "founder collective",
  ].map((name) => name.toLowerCase()),
);

function stageScore(roundType: string | null | undefined) {
  const r = roundType?.toLowerCase() ?? "";
  if (r.includes("pre_seed") || r.includes("pre-seed") || r.includes("preseed")) return { score: 100, label: "Pre-seed cheque" };
  if (r === "seed" || r.includes("seed")) return { score: 70, label: "Seed cheque" };
  if (r.includes("series_a") || r.includes("series a") || r.includes("a")) return { score: 20, label: "Series A — pricier" };
  if (r.includes("series_b") || r.includes("series b")) return { score: 5, label: "Series B+ — too late" };
  return { score: 50, label: "Stage unknown" };
}

function headcountScore(headcount: number | null | undefined) {
  if (headcount == null) return { score: 50, label: "Headcount unknown" };
  if (headcount < 10) return { score: 100, label: `${headcount}-person team` };
  if (headcount < 25) return { score: 70, label: `${headcount}-person team` };
  if (headcount < 50) return { score: 40, label: `${headcount}-person team` };
  return { score: 10, label: `${headcount}-person team — late` };
}

function foundedScore(yearFounded: string | null | undefined) {
  const year = yearFounded ? Number(yearFounded.slice(0, 4)) : null;
  if (!year || Number.isNaN(year)) return { score: 50, label: "Founding year unknown" };
  const now = new Date().getUTCFullYear();
  const age = now - year;
  if (age <= 1) return { score: 100, label: `Founded ${year} — fresh` };
  if (age <= 3) return { score: 70, label: `Founded ${year}` };
  if (age <= 5) return { score: 40, label: `Founded ${year}` };
  return { score: 15, label: `Founded ${year} — mature` };
}

function totalRaisedScore(total: number | null | undefined) {
  if (total == null) return { score: 50, label: "Total raised unknown" };
  if (total < 2_000_000) return { score: 100, label: `Raised <$2M total` };
  if (total < 10_000_000) return { score: 70, label: `Raised ~$${(total / 1_000_000).toFixed(1)}M total` };
  if (total < 25_000_000) return { score: 40, label: `Raised ~$${(total / 1_000_000).toFixed(0)}M total` };
  return { score: 10, label: `Raised $${(total / 1_000_000).toFixed(0)}M+ — pricey` };
}

function roundAmountScore(amount: number | null | undefined) {
  if (amount == null) return { score: 50, label: "Round size unknown" };
  if (amount < 1_000_000) return { score: 100, label: `Last round <$1M` };
  if (amount < 5_000_000) return { score: 70, label: `Last round $${(amount / 1_000_000).toFixed(1)}M` };
  if (amount < 15_000_000) return { score: 40, label: `Last round $${(amount / 1_000_000).toFixed(1)}M` };
  return { score: 10, label: `Last round $${(amount / 1_000_000).toFixed(0)}M+` };
}

function syndicateScore(investors: string[] | undefined) {
  if (!investors || investors.length === 0) {
    return { score: 70, label: "No tier-1 lead in cap table yet" };
  }
  const lower = investors.map((i) => i.toLowerCase());
  const hasTier1 = lower.some((i) => {
    for (const tier1 of TIER_1_INVESTORS) {
      if (i.includes(tier1)) return true;
    }
    return false;
  });
  if (hasTier1) {
    return { score: 20, label: "Tier-1 already on cap table" };
  }
  return { score: 80, label: "Cap table still open" };
}

export function computeValuationProxy(input: {
  roundType?: string | null;
  headcountTotal?: number | null;
  yearFounded?: string | null;
  totalInvestmentUsd?: number | null;
  roundAmountUsd?: number | null;
  investors?: string[];
}): ValuationProxy {
  const components = [
    stageScore(input.roundType),
    headcountScore(input.headcountTotal),
    foundedScore(input.yearFounded),
    totalRaisedScore(input.totalInvestmentUsd),
    roundAmountScore(input.roundAmountUsd),
    syndicateScore(input.investors),
  ];

  const score = Math.round(
    components.reduce((sum, c) => sum + c.score, 0) / components.length,
  );

  return {
    score,
    signals: components.map((c) => c.label),
  };
}
