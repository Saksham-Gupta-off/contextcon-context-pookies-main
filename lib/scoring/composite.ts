import type {
  CounterpartCompany,
  CompanyFounderScore,
  PortfolioStatus,
  RiskFlag,
  TractionScore,
} from "@/lib/pipeline/types";

const WEIGHTS = {
  thesis: 0.3,
  founder: 0.25,
  traction: 0.2,
  valuation: 0.15,
  dataConfidence: 0.1,
} as const;

const STATUS_THRESHOLDS = {
  invest: 65,
  watch: 50,
} as const;

export function dataConfidenceFor(
  counterpart: CounterpartCompany,
  traction: TractionScore | undefined,
  founder: CompanyFounderScore | undefined,
) {
  const checks: boolean[] = [
    Boolean(counterpart.headcountTotal),
    Boolean(counterpart.fundingDate),
    Boolean(counterpart.totalInvestmentUsd),
    Boolean(counterpart.investors?.length),
    Boolean(counterpart.yearFounded),
    Boolean(counterpart.hqCountry),
    Boolean(traction && (traction.headcountMomentum > 0 || traction.hiringVelocity > 0)),
    Boolean(founder && founder.founders.length > 0),
  ];
  const present = checks.filter(Boolean).length;
  return Math.round((present / checks.length) * 100);
}

export function computeComposite(input: {
  thesisAlignment: number;
  founderScore: number;
  tractionScore: number;
  valuationScore: number;
  dataConfidence: number;
  riskPenalty: number;
}) {
  const weighted =
    input.thesisAlignment * WEIGHTS.thesis +
    input.founderScore * WEIGHTS.founder +
    input.tractionScore * WEIGHTS.traction +
    input.valuationScore * WEIGHTS.valuation +
    input.dataConfidence * WEIGHTS.dataConfidence;
  const composite = Math.max(0, Math.round(weighted - input.riskPenalty));
  return composite;
}

export function classifyStatus(composite: number): PortfolioStatus {
  if (composite >= STATUS_THRESHOLDS.invest) return "invest";
  if (composite >= STATUS_THRESHOLDS.watch) return "watch";
  return "skip";
}

export type ScoredCounterpart = {
  counterpart: CounterpartCompany;
  traction: TractionScore | undefined;
  risk: RiskFlag | undefined;
  founder: CompanyFounderScore | undefined;
  scores: {
    thesisAlignment: number;
    founderScore: number;
    tractionScore: number;
    valuationProxy: number;
    dataConfidence: number;
    riskFlagCount: number;
    composite: number;
  };
  status: PortfolioStatus;
};

export function scoreCounterparts(
  counterparts: CounterpartCompany[],
  traction: TractionScore[],
  risk: RiskFlag[],
  founders: CompanyFounderScore[],
): ScoredCounterpart[] {
  const tractionById = new Map(traction.map((t) => [t.crustdataCompanyId, t]));
  const riskById = new Map(risk.map((r) => [r.crustdataCompanyId, r]));
  const founderById = new Map(founders.map((f) => [f.crustdataCompanyId, f]));

  return counterparts.map((counterpart) => {
    const t = tractionById.get(counterpart.crustdataCompanyId);
    const r = riskById.get(counterpart.crustdataCompanyId);
    const f = founderById.get(counterpart.crustdataCompanyId);
    const dataConfidence = dataConfidenceFor(counterpart, t, f);
    const composite = computeComposite({
      thesisAlignment: counterpart.thesisAlignment,
      founderScore: f?.composite ?? 30,
      tractionScore: t?.composite ?? 30,
      valuationScore: counterpart.valuationProxy.score,
      dataConfidence,
      riskPenalty: r?.totalPenalty ?? 0,
    });

    return {
      counterpart,
      traction: t,
      risk: r,
      founder: f,
      scores: {
        thesisAlignment: counterpart.thesisAlignment,
        founderScore: f?.composite ?? 30,
        tractionScore: t?.composite ?? 30,
        valuationProxy: counterpart.valuationProxy.score,
        dataConfidence,
        riskFlagCount: r?.flags.length ?? 0,
        composite,
      },
      status: classifyStatus(composite),
    };
  });
}
