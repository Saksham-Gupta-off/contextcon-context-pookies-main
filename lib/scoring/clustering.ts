import type { DealThesis } from "@/lib/pipeline/types";

const JACCARD_THRESHOLD = 0.4;

function jaccard(a: Set<string>, b: Set<string>) {
  if (a.size === 0 && b.size === 0) return 0;
  const intersection = new Set<string>();
  for (const item of a) {
    if (b.has(item)) intersection.add(item);
  }
  const unionSize = a.size + b.size - intersection.size;
  if (unionSize === 0) return 0;
  return intersection.size / unionSize;
}

function thesisTagSet(thesis: DealThesis | undefined) {
  const set = new Set<string>();
  if (!thesis) return set;
  for (const k of thesis.marketKeywords) set.add(k.trim().toLowerCase());
  for (const a of thesis.adjacentIndustries) set.add(a.trim().toLowerCase());
  return set;
}

export type ClusterAssignment = {
  clusterId: number;
  thesisLabel: string;
};

export function clusterByThesis(
  companies: Array<{ crustdataCompanyId: number; mirroredFromCompanyId: number }>,
  theses: DealThesis[],
): Map<number, ClusterAssignment> {
  const thesesById = new Map(theses.map((t) => [t.crustdataCompanyId, t]));
  const tagSetById = new Map<number, Set<string>>();
  const timingById = new Map<number, string>();
  for (const company of companies) {
    const thesis = thesesById.get(company.mirroredFromCompanyId);
    tagSetById.set(company.crustdataCompanyId, thesisTagSet(thesis));
    timingById.set(company.crustdataCompanyId, thesis?.marketTiming ?? "unknown");
  }

  const clusters: Array<{ memberIds: number[]; tagSet: Set<string>; timing: string; label: string }> = [];

  for (const company of companies) {
    const tagSet = tagSetById.get(company.crustdataCompanyId) ?? new Set();
    const timing = timingById.get(company.crustdataCompanyId) ?? "unknown";

    let assigned = false;
    for (const cluster of clusters) {
      if (cluster.timing !== timing) continue;
      const sim = jaccard(cluster.tagSet, tagSet);
      if (sim >= JACCARD_THRESHOLD) {
        cluster.memberIds.push(company.crustdataCompanyId);
        for (const t of tagSet) cluster.tagSet.add(t);
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      const thesis = thesesById.get(company.mirroredFromCompanyId);
      clusters.push({
        memberIds: [company.crustdataCompanyId],
        tagSet: new Set(tagSet),
        timing,
        label: thesis?.thesisOneLiner ?? `Cluster ${clusters.length + 1}`,
      });
    }
  }

  const out = new Map<number, ClusterAssignment>();
  clusters.forEach((cluster, idx) => {
    for (const memberId of cluster.memberIds) {
      out.set(memberId, { clusterId: idx, thesisLabel: cluster.label });
    }
  });
  return out;
}
