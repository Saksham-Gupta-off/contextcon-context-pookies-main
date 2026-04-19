import type { PipelineContext } from "@/lib/pipeline/orchestrator";
import { buildPortfolio } from "@/lib/scoring/allocator";
import { clusterByThesis } from "@/lib/scoring/clustering";
import { scoreCounterparts } from "@/lib/scoring/composite";
import type {
  CompanyFounderScore,
  CounterpartCompany,
  DealThesis,
  PortfolioSummary,
  RiskFlag,
  RunConfig,
  TractionScore,
} from "@/lib/pipeline/types";

export function runPortfolioBuilder(
  counterparts: CounterpartCompany[],
  traction: TractionScore[],
  risk: RiskFlag[],
  founders: CompanyFounderScore[],
  theses: DealThesis[],
  config: RunConfig,
  ctx: PipelineContext,
): PortfolioSummary {
  if (counterparts.length === 0) {
    const empty: PortfolioSummary = {
      entries: [],
      totalDeployed: 0,
      reservesHeld: config.fundSize * 0.2,
      byStatus: { invest: 0, watch: 0, skip: 0 },
      byThesisCluster: [],
      byGeo: {},
      byStage: {},
      warnings: ["No counterparts produced upstream; portfolio is empty."],
    };
    ctx.emit({ type: "step6.summary", payload: empty });
    return empty;
  }

  const scored = scoreCounterparts(counterparts, traction, risk, founders);
  const clusters = clusterByThesis(counterparts, theses);

  const thesesById = new Map(theses.map((t) => [t.crustdataCompanyId, t]));
  const thesisLabelsByCompany = new Map<number, string>();
  const mirroredFromNameByCompany = new Map<number, string>();
  const fundLabelByCompany = new Map<number, string>();
  for (const c of counterparts) {
    const t = thesesById.get(c.mirroredFromCompanyId);
    if (t) thesisLabelsByCompany.set(c.crustdataCompanyId, t.thesisOneLiner);
    mirroredFromNameByCompany.set(c.crustdataCompanyId, c.mirroredFromName);
    fundLabelByCompany.set(c.crustdataCompanyId, c.fundId);
  }

  const portfolio = buildPortfolio(
    scored,
    clusters,
    config,
    thesisLabelsByCompany,
    fundLabelByCompany,
    mirroredFromNameByCompany,
  );

  for (const entry of portfolio.entries) {
    ctx.emit({ type: "step6.entry", payload: entry });
  }

  ctx.emit({ type: "step6.summary", payload: portfolio });

  return portfolio;
}
