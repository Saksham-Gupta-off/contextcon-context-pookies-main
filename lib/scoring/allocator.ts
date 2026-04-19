import type {
  PortfolioEntry,
  PortfolioSummary,
  RunConfig,
} from "@/lib/pipeline/types";
import type { ClusterAssignment } from "@/lib/scoring/clustering";
import type { ScoredCounterpart } from "@/lib/scoring/composite";

const RESERVES_FRACTION = 0.2;
const CONVICTION_BIAS = 1.6; // conviction cheques get 1.6x the spray cheque size
const MAX_CLUSTER_SHARE = 0.35;
const MAX_GEO_SHARE = 0.5;

function sortInvestByConviction(
  scored: ScoredCounterpart[],
  clusters: Map<number, ClusterAssignment>,
) {
  return [...scored]
    .filter((s) => s.status === "invest")
    .sort((a, b) => {
      const ac = clusters.get(a.counterpart.crustdataCompanyId)?.clusterId ?? -1;
      const bc = clusters.get(b.counterpart.crustdataCompanyId)?.clusterId ?? -1;
      if (b.scores.composite !== a.scores.composite) {
        return b.scores.composite - a.scores.composite;
      }
      return ac - bc;
    });
}

export function buildPortfolio(
  scored: ScoredCounterpart[],
  clusters: Map<number, ClusterAssignment>,
  config: RunConfig,
  thesisLabelsByCompany: Map<number, string>,
  fundLabelByCompany: Map<number, string>,
  mirroredFromNameByCompany: Map<number, string>,
): PortfolioSummary {
  const investableCapital = config.fundSize * (1 - RESERVES_FRACTION);
  const reserves = config.fundSize - investableCapital;
  const targetSize = Math.max(1, config.targetPortfolioSize);
  const sqrtCap = Math.max(1, Math.round(2 * Math.sqrt(targetSize)));

  const investRanked = sortInvestByConviction(scored, clusters);
  const investSelected = investRanked.slice(0, targetSize);

  // Build base allocations: convictionTier gets bias×, sprayTier gets 1×
  const convictionCount = Math.min(sqrtCap, investSelected.length);
  const totalUnits = convictionCount * CONVICTION_BIAS + Math.max(0, investSelected.length - convictionCount);
  const baseUnitSize = totalUnits > 0 ? investableCapital / totalUnits : 0;

  type AllocatedSlot = ScoredCounterpart & {
    chequeUsd: number;
    isConviction: boolean;
    cluster: ClusterAssignment;
  };

  const allocated: AllocatedSlot[] = investSelected.map((slot, idx) => {
    const isConviction = idx < convictionCount;
    const cluster = clusters.get(slot.counterpart.crustdataCompanyId) ?? {
      clusterId: -1,
      thesisLabel: "Unknown",
    };
    const cheque = Math.min(
      config.maxChequeSize,
      Math.round((isConviction ? CONVICTION_BIAS : 1) * baseUnitSize),
    );
    return {
      ...slot,
      chequeUsd: cheque,
      isConviction,
      cluster,
    };
  });

  // Diversification rebalance: reduce overweight clusters/geos to caps
  const warnings: string[] = [];
  const totalDeployed = () => allocated.reduce((s, a) => s + a.chequeUsd, 0);

  function shareByKey(getKey: (slot: AllocatedSlot) => string) {
    const total = totalDeployed();
    const out = new Map<string, number>();
    for (const slot of allocated) {
      const key = getKey(slot);
      out.set(key, (out.get(key) ?? 0) + slot.chequeUsd);
    }
    const shares = new Map<string, number>();
    for (const [k, v] of out) {
      shares.set(k, total ? v / total : 0);
    }
    return shares;
  }

  function enforceCap(
    getKey: (slot: AllocatedSlot) => string,
    capShare: number,
    label: string,
  ) {
    let iterations = 0;
    while (iterations < 10) {
      const shares = shareByKey(getKey);
      const overflowKey = [...shares.entries()].find(([_, share]) => share > capShare);
      if (!overflowKey) break;
      const [key] = overflowKey;
      // Trim 15% from each over-cap slot in this key
      let trimmed = false;
      for (const slot of allocated) {
        if (getKey(slot) !== key) continue;
        const reduction = Math.round(slot.chequeUsd * 0.15);
        if (reduction > 100) {
          slot.chequeUsd = Math.max(1000, slot.chequeUsd - reduction);
          trimmed = true;
        }
      }
      if (!trimmed) break;
      iterations += 1;
      warnings.push(`Diversification: trimmed ${label} "${key}" toward ${(capShare * 100).toFixed(0)}% cap.`);
    }
  }

  enforceCap((slot) => `cluster:${slot.cluster.clusterId}`, MAX_CLUSTER_SHARE, "thesis cluster");
  enforceCap((slot) => `geo:${slot.counterpart.hqCountry ?? "unknown"}`, MAX_GEO_SHARE, "geography");

  const entries: PortfolioEntry[] = allocated.map((slot) => ({
    crustdataCompanyId: slot.counterpart.crustdataCompanyId,
    name: slot.counterpart.name,
    primaryDomain: slot.counterpart.primaryDomain,
    fundId: slot.counterpart.fundId,
    mirroredFromName:
      mirroredFromNameByCompany.get(slot.counterpart.crustdataCompanyId) ??
      slot.counterpart.mirroredFromName,
    thesisOneLiner:
      thesisLabelsByCompany.get(slot.counterpart.crustdataCompanyId) ?? slot.cluster.thesisLabel,
    thesisCluster: slot.cluster.clusterId,
    stage: slot.counterpart.roundType,
    hqCountry: slot.counterpart.hqCountry,
    scores: slot.scores,
    status: slot.status,
    chequeUsd: slot.chequeUsd,
    allocationRationale: slot.isConviction
      ? `Conviction cheque (top ${convictionCount} by composite ${slot.scores.composite}/100)`
      : `Spray cheque (composite ${slot.scores.composite}/100, hedged exposure)`,
  }));

  // Add Watch + Skip slots so they show up in the table
  const nonInvest = scored
    .filter((s) => s.status !== "invest")
    .sort((a, b) => b.scores.composite - a.scores.composite);

  for (const slot of nonInvest) {
    const cluster = clusters.get(slot.counterpart.crustdataCompanyId) ?? {
      clusterId: -1,
      thesisLabel: "Unknown",
    };
    entries.push({
      crustdataCompanyId: slot.counterpart.crustdataCompanyId,
      name: slot.counterpart.name,
      primaryDomain: slot.counterpart.primaryDomain,
      fundId: slot.counterpart.fundId,
      mirroredFromName:
        mirroredFromNameByCompany.get(slot.counterpart.crustdataCompanyId) ??
        slot.counterpart.mirroredFromName,
      thesisOneLiner:
        thesisLabelsByCompany.get(slot.counterpart.crustdataCompanyId) ?? cluster.thesisLabel,
      thesisCluster: cluster.clusterId,
      stage: slot.counterpart.roundType,
      hqCountry: slot.counterpart.hqCountry,
      scores: slot.scores,
      status: slot.status,
      chequeUsd: 0,
      allocationRationale:
        slot.status === "watch"
          ? `Watchlist (composite ${slot.scores.composite}/100, monitoring)`
          : `Skip (composite ${slot.scores.composite}/100 below threshold)`,
    });
  }

  // Final summary numbers
  const totalCapitalDeployed = allocated.reduce((s, a) => s + a.chequeUsd, 0);

  const byStatus = entries.reduce(
    (acc, entry) => {
      acc[entry.status] += 1;
      return acc;
    },
    { invest: 0, watch: 0, skip: 0 },
  );

  const clusterTotals = new Map<number, { count: number; capital: number; label: string }>();
  for (const entry of entries) {
    if (entry.status !== "invest") continue;
    const existing = clusterTotals.get(entry.thesisCluster) ?? {
      count: 0,
      capital: 0,
      label: entry.thesisOneLiner,
    };
    existing.count += 1;
    existing.capital += entry.chequeUsd;
    clusterTotals.set(entry.thesisCluster, existing);
  }

  const byThesisCluster = Array.from(clusterTotals.entries())
    .map(([clusterId, info]) => ({
      clusterId,
      count: info.count,
      capitalShare: totalCapitalDeployed ? info.capital / totalCapitalDeployed : 0,
      thesisLabel: info.label,
    }))
    .sort((a, b) => b.capitalShare - a.capitalShare);

  const byGeo: Record<string, number> = {};
  for (const entry of entries) {
    if (entry.status !== "invest") continue;
    const geo = entry.hqCountry ?? "Unknown";
    byGeo[geo] = (byGeo[geo] ?? 0) + (entry.chequeUsd / Math.max(1, totalCapitalDeployed));
  }

  const byStage: Record<string, number> = {};
  for (const entry of entries) {
    if (entry.status !== "invest") continue;
    const stage = entry.stage ?? "unknown";
    byStage[stage] = (byStage[stage] ?? 0) + (entry.chequeUsd / Math.max(1, totalCapitalDeployed));
  }

  if (byStatus.invest < Math.max(8, Math.round(targetSize * 0.5))) {
    warnings.push(
      `Only ${byStatus.invest} invest-grade companies vs ${targetSize} target. Power-law math is weaker; consider widening counterparts or relaxing the data-confidence floor.`,
    );
  }

  return {
    entries,
    totalDeployed: totalCapitalDeployed,
    reservesHeld: reserves,
    byStatus,
    byThesisCluster,
    byGeo,
    byStage,
    warnings,
  };
}
