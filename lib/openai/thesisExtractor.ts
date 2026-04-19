import { z } from "zod";
import { openAiClient } from "@/lib/openai/client";
import { LIMITS } from "@/lib/pipeline/limits";
import type { DealThesis, ThesisMarketTiming } from "@/lib/pipeline/types";

const thesisResponseSchema = z.object({
  thesisOneLiner: z.string().min(8).max(140),
  beliefStatement: z.string().min(20).max(360),
  marketKeywords: z.array(z.string().min(2).max(40)).min(1).max(LIMITS.marketKeywordsPerThesis),
  adjacentIndustries: z
    .array(z.string().min(2).max(40))
    .min(1)
    .max(LIMITS.adjacentIndustriesPerThesis),
  marketTiming: z.enum([
    "picks-and-shovels",
    "early-application",
    "platform-shift",
    "vertical-incumbent-play",
  ]),
  wedge: z.string().min(8).max(160),
  whyNow: z.string().min(8).max(200),
  redFlagsForCounterparts: z.array(z.string().min(4).max(120)).min(0).max(4),
});

export type ThesisExtractionInput = {
  companyName: string;
  primaryDomain?: string;
  description?: string | null;
  industry?: string | null;
  industries?: string[] | null;
  fundName: string;
  roundType?: string | null;
  fundingDate?: string | null;
  competitorWebsites?: string[];
  newsHeadlines: Array<{ title: string; url: string; publishDate?: string }>;
};

const SYSTEM_PROMPT = `You are an investment analyst helping a venture firm distill the
implicit thesis behind a smart-money investment. Your goal is to write a
compact thesis that another analyst could use to find earlier-stage
counterparts in the same market.

Hard constraints:
- "marketKeywords" must be at most ${LIMITS.marketKeywordsPerThesis} short, discriminating noun phrases. Avoid generic words like "AI" alone, "software", "platform", "tools". Use domain-specific phrases like "ai observability", "fintech infrastructure", "vertical sales agents".
- "adjacentIndustries" must be at most ${LIMITS.adjacentIndustriesPerThesis} concrete industry phrases that could be searched in a database (e.g. "Software Development", "Financial Services", "Hospitals and Health Care", "Computer and Network Security", "Robotics Engineering").
- "marketTiming" must be one of: picks-and-shovels (infra layer for a new wave), early-application (first apps on a new tech), platform-shift (incumbent tech being replaced), vertical-incumbent-play (vertical SaaS displacing legacy).
- Always return concise prose. No bullet points. No markdown.`;

export async function extractThesisForCompany(input: ThesisExtractionInput): Promise<{
  thesis: Omit<DealThesis, "crustdataCompanyId" | "resolvedIndustries" | "newsItems">;
  rationale: string;
}> {
  const newsBlock = input.newsHeadlines
    .slice(0, 6)
    .map(
      (item) =>
        `- ${item.publishDate ?? "(no date)"} ${item.title}`,
    )
    .join("\n");

  const competitorsBlock = (input.competitorWebsites ?? []).slice(0, 6).join(", ");

  const prompt = `Mirrored fund: ${input.fundName}
Company: ${input.companyName}${input.primaryDomain ? ` (${input.primaryDomain})` : ""}
Round: ${input.roundType ?? "unknown"}${input.fundingDate ? ` on ${input.fundingDate}` : ""}
Description: ${input.description ?? "(none)"}
Primary industry: ${input.industry ?? "(unknown)"}
All industries: ${(input.industries ?? []).slice(0, 8).join(", ") || "(none)"}
Recent news headlines:\n${newsBlock || "(no news available)"}
Known competitors (websites): ${competitorsBlock || "(none)"}

Distill the implicit thesis behind ${input.fundName}'s investment in ${input.companyName}. Write the thesis like an analyst's internal memo. Then list discriminating market keywords and adjacent industries that an analyst would use to search Crustdata for similar earlier-stage companies.`;

  const result = await openAiClient.generateObject({
    system: SYSTEM_PROMPT,
    prompt,
    schema: thesisResponseSchema,
    schemaName: "DealThesis",
    schemaDescription: "Implicit thesis distilled from a smart-money investment.",
  });

  const obj = result.object;

  return {
    thesis: {
      thesisOneLiner: obj.thesisOneLiner,
      beliefStatement: obj.beliefStatement,
      marketKeywords: obj.marketKeywords.slice(0, LIMITS.marketKeywordsPerThesis),
      adjacentIndustries: obj.adjacentIndustries.slice(0, LIMITS.adjacentIndustriesPerThesis),
      marketTiming: obj.marketTiming as ThesisMarketTiming,
      wedge: obj.wedge,
      whyNow: obj.whyNow,
      redFlagsForCounterparts: obj.redFlagsForCounterparts,
    },
    rationale: `${obj.beliefStatement} — wedge: ${obj.wedge}. Why now: ${obj.whyNow}`,
  };
}
