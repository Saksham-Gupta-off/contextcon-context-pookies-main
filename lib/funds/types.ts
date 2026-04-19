export type FundId =
  | "yc"
  | "a16z"
  | "spc"
  | "founders-fund"
  | "khosla";

export type FundConfig = {
  id: FundId;
  displayName: string;
  aliases: string[];
  siteDomain: string;
};
