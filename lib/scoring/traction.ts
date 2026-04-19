import type { TractionScore } from "@/lib/pipeline/types";

const SENIOR_TITLE_TOKENS = [
  "vp ",
  " vp ",
  "vice president",
  "head of",
  "chief",
  "director of",
  "principal",
  "staff",
  "lead",
  "founding",
];

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function headcountMomentumFromGrowth(growthPercent: number | null | undefined) {
  if (growthPercent == null) return null;
  if (growthPercent >= 50) return 100;
  if (growthPercent >= 25) return 80;
  if (growthPercent >= 10) return 60;
  if (growthPercent >= 0) return 40;
  return 20;
}

function hiringVelocityScore(
  openings: number | null | undefined,
  growth: number | null | undefined,
  headcount: number | null | undefined,
) {
  if (openings == null && growth == null) return null;
  let score = 30;

  if (openings != null) {
    const ratio = headcount && headcount > 0 ? openings / headcount : openings / 10;
    if (ratio >= 0.3) score += 35;
    else if (ratio >= 0.15) score += 25;
    else if (ratio >= 0.05) score += 15;
    else if (ratio > 0) score += 5;
  }

  if (growth != null) {
    if (growth >= 100) score += 35;
    else if (growth >= 50) score += 25;
    else if (growth >= 20) score += 15;
    else if (growth > 0) score += 5;
  }

  return clamp(score);
}

function webTrafficMomentum(monthly: number | null | undefined) {
  if (monthly == null) return null;
  if (monthly >= 1_000_000) return 100;
  if (monthly >= 250_000) return 80;
  if (monthly >= 50_000) return 60;
  if (monthly >= 10_000) return 40;
  if (monthly >= 1_000) return 25;
  return 10;
}

function seniorHireScoreFromCsv(csv: string | null | undefined) {
  if (!csv) return null;
  const parts = csv
    .toLowerCase()
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  const seniorCount = parts.filter((title) =>
    SENIOR_TITLE_TOKENS.some((token) => title.includes(token)),
  ).length;
  if (seniorCount === 0) return 20;
  if (seniorCount >= 4) return 100;
  if (seniorCount >= 2) return 80;
  return 60;
}

export type TractionInput = {
  crustdataCompanyId: number;
  headcountTotal: number | null | undefined;
  headcountGrowth?: number | null;
  hiringOpenings?: number | null;
  hiringGrowth?: number | null;
  hiringRecentTitlesCsv?: string | null;
  webTrafficMonthlyVisitors?: number | null;
};

export function computeTractionScore(input: TractionInput): TractionScore {
  const headcountMomentum = headcountMomentumFromGrowth(input.headcountGrowth);
  const hiringVelocity = hiringVelocityScore(
    input.hiringOpenings,
    input.hiringGrowth,
    input.headcountTotal,
  );
  const webTrafficScore = webTrafficMomentum(input.webTrafficMonthlyVisitors);
  const seniorHireSignal = seniorHireScoreFromCsv(input.hiringRecentTitlesCsv);

  const components = [headcountMomentum, hiringVelocity, webTrafficScore, seniorHireSignal];
  const present = components.filter((c): c is number => c != null);
  const composite = present.length
    ? Math.round(present.reduce((a, b) => a + b, 0) / present.length)
    : 30;

  const signals: TractionScore["signals"] = [];

  if (input.headcountGrowth != null) {
    signals.push({
      label: "Headcount growth",
      value: `${input.headcountGrowth.toFixed(1)}%`,
      confidence: "medium",
    });
  } else {
    signals.push({ label: "Headcount growth", value: "unknown", confidence: "low" });
  }

  if (input.hiringOpenings != null) {
    signals.push({
      label: "Open roles",
      value: `${input.hiringOpenings} open${
        input.hiringGrowth != null ? ` (${input.hiringGrowth.toFixed(0)}% growth)` : ""
      }`,
      confidence: "medium",
    });
  } else {
    signals.push({ label: "Open roles", value: "no data", confidence: "low" });
  }

  if (input.webTrafficMonthlyVisitors != null) {
    signals.push({
      label: "Monthly visitors",
      value: input.webTrafficMonthlyVisitors.toLocaleString(),
      confidence: "high",
    });
  } else {
    signals.push({ label: "Monthly visitors", value: "no data", confidence: "low" });
  }

  if (input.hiringRecentTitlesCsv) {
    const seniorTitles = input.hiringRecentTitlesCsv
      .toLowerCase()
      .split(/[,;|]/)
      .filter((title) =>
        SENIOR_TITLE_TOKENS.some((token) => title.includes(token)),
      ).length;
    signals.push({
      label: "Senior hires in pipeline",
      value: `${seniorTitles}`,
      confidence: "medium",
    });
  }

  return {
    crustdataCompanyId: input.crustdataCompanyId,
    headcountMomentum: headcountMomentum ?? 0,
    hiringVelocity: hiringVelocity ?? 0,
    webTrafficScore: webTrafficScore ?? 0,
    seniorHireSignal: seniorHireSignal ?? 0,
    composite,
    signals,
  };
}
