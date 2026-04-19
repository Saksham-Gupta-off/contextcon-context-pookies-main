import type { RiskFlag } from "@/lib/pipeline/types";

const PENALTY_PER_FLAG = 5;

export type RiskInput = {
  crustdataCompanyId: number;
  totalInvestmentUsd: number | null | undefined;
  roundType: string | null | undefined;
  fundingDate: string | null | undefined;
  headcountTotal: number | null | undefined;
  headcountGrowth?: number | null;
  investorsCount: number;
  founderChurnSignal?: boolean;
};

function isOverfundedForStage(
  stage: string | null | undefined,
  total: number | null | undefined,
) {
  if (!stage || total == null) return false;
  const lower = stage.toLowerCase();
  if (lower.includes("pre_seed") || lower.includes("pre-seed")) return total > 5_000_000;
  if (lower.includes("seed")) return total > 15_000_000;
  if (lower.includes("series_a") || lower.includes("series a")) return total > 60_000_000;
  return false;
}

function isStaleRound(fundingDate: string | null | undefined) {
  if (!fundingDate) return false;
  const date = new Date(fundingDate);
  if (Number.isNaN(date.getTime())) return false;
  const ageMonths =
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
  return ageMonths > 18;
}

function isStagnantHeadcount(growth: number | null | undefined) {
  if (growth == null) return false;
  return growth <= -5;
}

function isHeadcountStageMismatch(
  stage: string | null | undefined,
  headcount: number | null | undefined,
) {
  if (!stage || headcount == null) return false;
  const lower = stage.toLowerCase();
  if (lower.includes("pre_seed") && headcount > 30) return true;
  if (lower.includes("seed") && headcount > 75) return true;
  return false;
}

export function computeRiskFlag(input: RiskInput): RiskFlag {
  const flags: string[] = [];

  if (isOverfundedForStage(input.roundType, input.totalInvestmentUsd)) {
    flags.push("Overfunded for stage");
  }

  if (isStaleRound(input.fundingDate)) {
    flags.push("Last round >18 months old");
  }

  if (isStagnantHeadcount(input.headcountGrowth)) {
    flags.push("Headcount shrinking");
  }

  if (input.investorsCount === 0) {
    flags.push("No syndicate disclosed");
  } else if (input.investorsCount === 1) {
    flags.push("Solo investor on cap table");
  }

  if (isHeadcountStageMismatch(input.roundType, input.headcountTotal)) {
    flags.push("Headcount mismatched to stage");
  }

  if (input.founderChurnSignal) {
    flags.push("Founder churn signal");
  }

  return {
    crustdataCompanyId: input.crustdataCompanyId,
    flags,
    totalPenalty: flags.length * PENALTY_PER_FLAG,
  };
}
