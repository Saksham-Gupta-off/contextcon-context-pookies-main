import type { FundConfig } from "@/lib/funds/types";

export const FUNDS: FundConfig[] = [
  {
    id: "yc",
    displayName: "Y Combinator",
    aliases: ["Y Combinator", "YC", "Y-Combinator"],
    siteDomain: "ycombinator.com",
  },
  {
    id: "a16z",
    displayName: "Andreessen Horowitz",
    aliases: ["Andreessen Horowitz", "a16z", "Andreessen Horowitz LLC"],
    siteDomain: "a16z.com",
  },
  {
    id: "spc",
    displayName: "South Park Commons",
    aliases: ["South Park Commons", "SPC"],
    siteDomain: "southparkcommons.com",
  },
  {
    id: "founders-fund",
    displayName: "Founders Fund",
    aliases: ["Founders Fund", "FoundersFund"],
    siteDomain: "foundersfund.com",
  },
  {
    id: "khosla",
    displayName: "Khosla Ventures",
    aliases: ["Khosla Ventures", "Khosla"],
    siteDomain: "khoslaventures.com",
  },
];

export function getFundById(id: string) {
  return FUNDS.find((fund) => fund.id === id);
}
