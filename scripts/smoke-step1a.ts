import { loadEnvConfig } from "@next/env";
import { runStructuredFundWatcher } from "../lib/pipeline/step1a-structured";
import type { FundId } from "../lib/funds/types";

loadEnvConfig(process.cwd());

const requestedFunds = process.argv.slice(2) as FundId[];
const fundsToMirror: FundId[] = requestedFunds.length
  ? requestedFunds
  : ["a16z"];

async function main() {
  const result = await runStructuredFundWatcher({
    fundSize: 500_000,
    targetPortfolioSize: 25,
    blockedGeos: [],
    blockedSectors: [],
    maxChequeSize: 25_000,
    minStage: "pre_seed",
    maxStage: "series_a",
    fundsToMirror,
  });

  const summary = result.deals.map((deal) => ({
    fundId: deal.fundId,
    company: deal.name,
    roundType: deal.roundType,
    fundingDate: deal.fundingDate,
    hqCountry: deal.hqCountry,
    domain: deal.primaryDomain,
  }));

  console.log(
    JSON.stringify(
      {
        requestedFunds: fundsToMirror,
        resolvedInvestorNames: result.resolvedInvestorNames,
        dealCount: result.deals.length,
        deals: summary,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
