import { z } from "zod";
import { FUNDS } from "@/lib/funds/registry";
import type { FundId } from "@/lib/funds/types";

const fundIds = FUNDS.map((fund) => fund.id) as [FundId, ...FundId[]];

export const runRequestSchema = z.object({
  fundSize: z.number().positive().default(500_000),
  targetPortfolioSize: z.number().int().positive().default(25),
  blockedGeos: z.array(z.string()).default([]),
  blockedSectors: z.array(z.string()).default([]),
  maxChequeSize: z.number().positive().default(25_000),
  minStage: z.enum(["pre_seed", "seed", "series_a"]).default("pre_seed"),
  maxStage: z.enum(["pre_seed", "seed", "series_a"]).default("series_a"),
  fundsToMirror: z.array(z.enum(fundIds)).default(FUNDS.slice(0, 4).map((fund) => fund.id)),
  demo: z.boolean().default(false),
});

export type ParsedRunRequest = z.infer<typeof runRequestSchema>;

