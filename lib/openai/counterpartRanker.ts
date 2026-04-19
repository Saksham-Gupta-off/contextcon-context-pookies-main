import { z } from "zod";
import { openAiClient } from "@/lib/openai/client";

const rerankResponseSchema = z.object({
  ranked: z
    .array(
      z.object({
        crustdataCompanyId: z.number(),
        thesisAlignment: z.number().min(0).max(100),
        timingMatch: z.boolean(),
        rationale: z.string().min(8).max(280),
        redFlag: z.string().max(160).nullable(),
      }),
    )
    .min(0),
});

export type CandidateForRanker = {
  crustdataCompanyId: number;
  name: string;
  primaryDomain?: string;
  description?: string | null;
  industries?: string[] | null;
  headcountTotal?: number | null;
  yearFounded?: string | null;
  roundType?: string | null;
  totalInvestmentUsd?: number | null;
  hqCountry?: string | null;
};

export type RankerThesisInput = {
  mirroredCompanyName: string;
  fundName: string;
  thesisOneLiner: string;
  beliefStatement: string;
  marketKeywords: string[];
  marketTiming: string;
  wedge: string;
  redFlagsForCounterparts: string[];
};

export type RankedCandidate = z.infer<typeof rerankResponseSchema>["ranked"][number];

export async function rerankCounterparts(
  thesis: RankerThesisInput,
  candidates: CandidateForRanker[],
): Promise<RankedCandidate[]> {
  if (candidates.length === 0) {
    return [];
  }

  const candidateBlock = candidates
    .map((c) => {
      return `- id=${c.crustdataCompanyId} name="${c.name}" domain="${c.primaryDomain ?? ""}" industries="${(c.industries ?? []).slice(0, 3).join(", ")}" headcount=${c.headcountTotal ?? "?"} founded=${c.yearFounded ?? "?"} stage=${c.roundType ?? "?"} totalRaisedUsd=${c.totalInvestmentUsd ?? "?"} country=${c.hqCountry ?? "?"} desc="${(c.description ?? "").slice(0, 220)}"`;
    })
    .join("\n");

  const result = await openAiClient.generateObject({
    system: `You are a venture analyst ranking earlier-stage companies that match
the implicit thesis of a smart-money investment. You must:
- score thesisAlignment (0-100). Higher = closer to the thesis.
- set timingMatch true only if this candidate fits the marketTiming bucket.
- write a 1-sentence rationale grounded in the candidate's description.
- if a candidate matches a redFlagForCounterparts pattern, fill redFlag with a short string. Otherwise null.
Do NOT invent facts. If a candidate is clearly a duplicate, off-thesis, or
a much later-stage company, score it low. Always return one ranked item per
input candidate.`,
    prompt: `Mirrored deal: ${thesis.mirroredCompanyName} (backed by ${thesis.fundName})
Thesis one-liner: ${thesis.thesisOneLiner}
Belief: ${thesis.beliefStatement}
Wedge: ${thesis.wedge}
Market timing bucket: ${thesis.marketTiming}
Discriminating market keywords: ${thesis.marketKeywords.join(", ")}
Red flags to avoid in counterparts: ${thesis.redFlagsForCounterparts.join(" | ") || "(none)"}

Candidates (one per line):
${candidateBlock}

Rank and score each candidate.`,
    schema: rerankResponseSchema,
    schemaName: "CounterpartRanking",
    schemaDescription: "Per-candidate thesis-fit ranking.",
  });

  return result.object.ranked;
}
