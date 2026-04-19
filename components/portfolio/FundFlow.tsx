import type { CounterpartCompany, MirroredDeal, PortfolioEntry } from "@/lib/pipeline/types";
import { getFundById } from "@/lib/funds/registry";
import type { FundId } from "@/lib/funds/types";

type Props = {
  deals: MirroredDeal[];
  counterparts: CounterpartCompany[];
  entries: PortfolioEntry[];
};

export default function FundFlow({ deals, counterparts, entries }: Props) {
  const investEntries = entries.filter((e) => e.status === "invest");
  if (investEntries.length === 0) {
    return (
      <div className="empty-state">No invest cheques to draw a flow for.</div>
    );
  }

  const fundIds = Array.from(new Set(investEntries.map((e) => e.fundId))) as FundId[];
  const dealMap = new Map(deals.map((d) => [d.crustdataCompanyId, d]));
  const cpMap = new Map(counterparts.map((c) => [c.crustdataCompanyId, c]));

  // Build fund -> mirroredDeal -> counterpart edges only for invest entries
  type Triple = { fundId: FundId; dealId: number; cpId: number; entry: PortfolioEntry };
  const triples: Triple[] = [];
  for (const entry of investEntries) {
    const cp = cpMap.get(entry.crustdataCompanyId);
    if (!cp) continue;
    triples.push({ fundId: entry.fundId, dealId: cp.mirroredFromCompanyId, cpId: cp.crustdataCompanyId, entry });
  }

  const dealIds = Array.from(new Set(triples.map((t) => t.dealId)));
  const cpIds = Array.from(new Set(triples.map((t) => t.cpId)));

  const W = 760;
  const H = Math.max(280, Math.max(fundIds.length, dealIds.length, cpIds.length) * 36 + 40);
  const colX = [40, W / 2, W - 40];

  const fundY = Object.fromEntries(
    fundIds.map((id, idx) => [id, ((idx + 1) * H) / (fundIds.length + 1)]),
  ) as Record<FundId, number>;
  const dealY = Object.fromEntries(
    dealIds.map((id, idx) => [id, ((idx + 1) * H) / (dealIds.length + 1)]),
  ) as Record<number, number>;
  const cpY = Object.fromEntries(
    cpIds.map((id, idx) => [id, ((idx + 1) * H) / (cpIds.length + 1)]),
  ) as Record<number, number>;

  function path(x1: number, y1: number, x2: number, y2: number) {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  return (
    <div className="fund-flow">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Fund flow">
        <defs>
          <linearGradient id="flow" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(197,100,50,0.55)" />
            <stop offset="1" stopColor="rgba(47,107,58,0.45)" />
          </linearGradient>
        </defs>

        {triples.map((t, i) => (
          <g key={i} opacity={0.78}>
            <path
              d={path(colX[0] + 8, fundY[t.fundId], colX[1] - 6, dealY[t.dealId])}
              fill="none"
              stroke="url(#flow)"
              strokeWidth={Math.max(1.5, Math.min(8, t.entry.chequeUsd / 4500))}
            />
            <path
              d={path(colX[1] + 6, dealY[t.dealId], colX[2] - 12, cpY[t.cpId])}
              fill="none"
              stroke="url(#flow)"
              strokeWidth={Math.max(1.5, Math.min(8, t.entry.chequeUsd / 4500))}
            />
          </g>
        ))}

        {fundIds.map((id) => {
          const fund = getFundById(id);
          return (
            <g key={`fund-${id}`}>
              <circle cx={colX[0]} cy={fundY[id]} r={6} fill="var(--accent)" />
              <text x={colX[0] - 12} y={fundY[id] + 4} textAnchor="end" fontWeight={600}>
                {fund?.displayName ?? id}
              </text>
            </g>
          );
        })}

        {dealIds.map((id) => {
          const d = dealMap.get(id);
          return (
            <g key={`deal-${id}`}>
              <rect x={colX[1] - 5} y={dealY[id] - 5} width={10} height={10} fill="var(--accent-deep)" />
              <text x={colX[1] + 12} y={dealY[id] + 4}>{d?.name ?? `#${id}`}</text>
            </g>
          );
        })}

        {cpIds.map((id) => {
          const cp = cpMap.get(id);
          return (
            <g key={`cp-${id}`}>
              <circle cx={colX[2]} cy={cpY[id]} r={6} fill="var(--invest)" />
              <text x={colX[2] + 12} y={cpY[id] + 4} fontWeight={600}>
                {cp?.name ?? `#${id}`}
              </text>
            </g>
          );
        })}

        <text x={colX[0]} y={20} textAnchor="middle" className="eyebrow" fontSize={11} opacity={0.6}>
          MIRRORED FUND
        </text>
        <text x={colX[1]} y={20} textAnchor="middle" fontSize={11} opacity={0.6}>
          THEIR DEAL
        </text>
        <text x={colX[2]} y={20} textAnchor="middle" fontSize={11} opacity={0.6}>
          OUR COUNTERPART
        </text>
      </svg>
    </div>
  );
}
