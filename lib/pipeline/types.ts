import type { FundId } from "@/lib/funds/types";

export type MirrorVcStage = "pre_seed" | "seed" | "series_a";

export type RunConfig = {
  fundSize: number;
  targetPortfolioSize: number;
  blockedGeos: string[];
  blockedSectors: string[];
  maxChequeSize: number;
  minStage: MirrorVcStage;
  maxStage: MirrorVcStage;
  fundsToMirror: FundId[];
};

export type DealSource = "structured";

export type MirroredDeal = {
  crustdataCompanyId: number;
  name: string;
  primaryDomain?: string;
  fundingDate?: string | null;
  roundType?: string | null;
  roundAmountUsd?: number | null;
  totalInvestmentUsd?: number | null;
  investors: string[];
  headcountTotal?: number | null;
  hqCountry?: string | null;
  hqCity?: string | null;
  professionalNetworkIndustry?: string | null;
  industries?: string[] | null;
  description?: string | null;
  yearFounded?: string | null;
  source: DealSource;
  fundId: FundId;
};

export type ThesisMarketTiming =
  | "picks-and-shovels"
  | "early-application"
  | "platform-shift"
  | "vertical-incumbent-play";

export type DealThesis = {
  crustdataCompanyId: number;
  thesisOneLiner: string;
  beliefStatement: string;
  marketKeywords: string[];
  adjacentIndustries: string[];
  marketTiming: ThesisMarketTiming;
  wedge: string;
  whyNow: string;
  redFlagsForCounterparts: string[];
  resolvedIndustries: string[];
  newsItems: Array<{
    title: string;
    url: string;
    publishDate?: string;
  }>;
};

export type ValuationProxy = {
  score: number; // 0-100
  signals: string[]; // human-readable signal labels for the dossier
};

export type CounterpartCompany = {
  crustdataCompanyId: number;
  mirroredFromCompanyId: number;
  mirroredFromName: string;
  fundId: FundId;
  name: string;
  primaryDomain?: string;
  description?: string | null;
  fundingDate?: string | null;
  roundType?: string | null;
  roundAmountUsd?: number | null;
  totalInvestmentUsd?: number | null;
  investors: string[];
  headcountTotal?: number | null;
  hqCountry?: string | null;
  hqCity?: string | null;
  professionalNetworkIndustry?: string | null;
  yearFounded?: string | null;
  thesisAlignment: number; // 0-100 from LLM
  thesisRationale: string;
  timingMatch: boolean;
  llmRedFlag: string | null;
  valuationProxy: ValuationProxy;
};

export type TractionScore = {
  crustdataCompanyId: number;
  headcountMomentum: number; // 0-100
  hiringVelocity: number; // 0-100
  webTrafficScore: number; // 0-100
  seniorHireSignal: number; // 0-100
  composite: number; // 0-100
  signals: Array<{
    label: string;
    value: string;
    confidence: "high" | "medium" | "low";
  }>;
};

export type RiskFlag = {
  crustdataCompanyId: number;
  flags: string[]; // labels, e.g. "Overfunded for stage"
  totalPenalty: number; // 0+ — subtracted from composite later (5 per flag)
};

export type FounderProfile = {
  crustdataPersonId?: number;
  name: string;
  title?: string;
  headline?: string;
  linkedinUrl?: string;
  twitterSlug?: string;
  followers?: number;
  joinedDate?: string;
  // raw signals for the dossier
  rawSignals: {
    priorFounder: boolean;
    bigTechAlum: boolean;
    domainExperienceYears: number;
    repeatCofounderPair: boolean;
    topUniversity: boolean;
    socialPresence: boolean;
    recentlyChangedJob: boolean;
  };
  // synthesized
  archetype:
    | "repeat-operator"
    | "domain-expert"
    | "technical-builder"
    | "first-time-founder"
    | "unknown";
  composite: number; // 0-100
  highlights: string[];
  dossierHeadline: string;
  caveats: string[];
};

export type CompanyFounderScore = {
  crustdataCompanyId: number;
  founders: FounderProfile[];
  averageScore: number;
  hasRepeatOperator: boolean;
  composite: number; // 0-100 (avg + repeat operator bonus)
};

export type PortfolioStatus = "invest" | "watch" | "skip";

export type PortfolioEntry = {
  crustdataCompanyId: number;
  name: string;
  primaryDomain?: string;
  fundId: FundId;
  mirroredFromName: string;
  thesisOneLiner: string;
  thesisCluster: number; // index of cluster
  stage?: string | null;
  hqCountry?: string | null;
  scores: {
    thesisAlignment: number;
    founderScore: number;
    tractionScore: number;
    valuationProxy: number;
    dataConfidence: number; // 0-100, % of signals available
    riskFlagCount: number;
    composite: number; // final
  };
  status: PortfolioStatus;
  chequeUsd: number; // 0 if not invest
  allocationRationale: string;
};

export type PortfolioSummary = {
  entries: PortfolioEntry[];
  totalDeployed: number;
  reservesHeld: number;
  byStatus: { invest: number; watch: number; skip: number };
  byThesisCluster: Array<{ clusterId: number; count: number; capitalShare: number; thesisLabel: string }>;
  byGeo: Record<string, number>; // country -> capital share (0-1)
  byStage: Record<string, number>; // stage -> capital share (0-1)
  warnings: string[];
};

export type ApiCallSnapshot = {
  endpoint: string;
  durationMs: number;
  cached: boolean;
  estimatedCredits: number;
  resultCount?: number;
  description: string;
};

export type ReasoningEntry = {
  step: "step2" | "step3" | "step5";
  companyName: string;
  rationale: string;
};

export type RunRecord = {
  runId: string;
  startedAt: string;
  completedAt: string;
  config: RunConfig;
  deals: MirroredDeal[];
  theses: DealThesis[];
  counterparts: CounterpartCompany[];
  traction: TractionScore[];
  riskFlags: RiskFlag[];
  founders: CompanyFounderScore[];
  portfolio: PortfolioSummary;
  apiCalls: ApiCallSnapshot[];
  reasoning: ReasoningEntry[];
  totalCredits: number;
  notes: string[];
};
