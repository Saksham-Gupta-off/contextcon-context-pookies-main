"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PipelineEvent } from "@/lib/pipeline/events";
import type {
  CompanyFounderScore,
  CounterpartCompany,
  DealThesis,
  MirroredDeal,
  PortfolioEntry,
  PortfolioSummary,
  RiskFlag,
  TractionScore,
} from "@/lib/pipeline/types";

function fmtMoney(value?: number | null) {
  if (value == null) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
}

function MirroredDealCard({ deal }: { deal: MirroredDeal }) {
  return (
    <article className="feed-card">
      <header className="feed-card__head">
        <div>
          <div className="feed-card__title">{deal.name}</div>
          <div className="feed-card__sub">
            Mirrored from {deal.fundId} · {deal.roundType ?? "—"} ·{" "}
            {deal.fundingDate ?? "date unknown"}
          </div>
        </div>
        <span className="tag tag--watch">step 1</span>
      </header>
      <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: "0.9rem", lineHeight: 1.5 }}>
        {deal.description ?? "No description in Crustdata."}
      </p>
      <div className="feed-card__row">
        {deal.roundAmountUsd ? <span className="tag tag--accent">{fmtMoney(deal.roundAmountUsd)} round</span> : null}
        {deal.headcountTotal ? <span className="tag">{deal.headcountTotal} heads</span> : null}
        {deal.hqCity ? <span className="tag">{deal.hqCity}</span> : null}
        {(deal.industries ?? []).slice(0, 3).map((ind) => (
          <span className="tag" key={ind}>{ind}</span>
        ))}
      </div>
    </article>
  );
}

function ThesisCard({ thesis, deals }: { thesis: DealThesis; deals: MirroredDeal[] }) {
  const deal = deals.find((d) => d.crustdataCompanyId === thesis.crustdataCompanyId);
  return (
    <article className="feed-card">
      <header className="feed-card__head">
        <div>
          <div className="feed-card__title">{deal?.name ?? `Company #${thesis.crustdataCompanyId}`}</div>
          <div className="feed-card__sub">Thesis · {thesis.marketTiming}</div>
        </div>
        <span className="tag tag--accent">step 2</span>
      </header>
      <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.45 }}>
        <strong>{thesis.thesisOneLiner}</strong>
      </p>
      <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
        {thesis.beliefStatement}
      </p>
      <div className="feed-card__row">
        {thesis.resolvedIndustries.slice(0, 5).map((ind) => (
          <span className="tag" key={ind}>{ind}</span>
        ))}
      </div>
    </article>
  );
}

function CounterpartCard({ cp }: { cp: CounterpartCompany }) {
  return (
    <article className="feed-card">
      <header className="feed-card__head">
        <div>
          <div className="feed-card__title">{cp.name}</div>
          <div className="feed-card__sub">
            counterpart of <em>{cp.mirroredFromName}</em> · {cp.roundType ?? "stage unknown"}
          </div>
        </div>
        <span className="tag tag--accent">{cp.thesisAlignment}/100 fit</span>
      </header>
      <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
        {cp.thesisRationale}
      </p>
      <div className="feed-card__row">
        {cp.timingMatch && <span className="tag tag--invest">timing match</span>}
        {cp.valuationProxy.signals.slice(0, 4).map((s) => (
          <span className="tag" key={s}>{s}</span>
        ))}
        {cp.headcountTotal ? <span className="tag">{cp.headcountTotal} heads</span> : null}
        {cp.hqCity ? <span className="tag">{cp.hqCity}</span> : null}
      </div>
    </article>
  );
}

function TractionCard({
  traction,
  risk,
  cp,
}: {
  traction: TractionScore;
  risk: RiskFlag;
  cp?: CounterpartCompany;
}) {
  return (
    <article className="feed-card">
      <header className="feed-card__head">
        <div>
          <div className="feed-card__title">{cp?.name ?? `Company #${traction.crustdataCompanyId}`}</div>
          <div className="feed-card__sub">Traction composite · {Math.round(traction.composite)}/100</div>
        </div>
        <span className="tag tag--watch">step 4</span>
      </header>
      <ul className="signal-list">
        {traction.signals.slice(0, 4).map((sig) => (
          <li key={sig.label}>
            <span className="confidence-dot" data-c={sig.confidence === "high" ? "high" : sig.confidence === "medium" ? "med" : "low"} />
            <strong>{sig.label}:</strong>&nbsp;<span style={{ color: "var(--muted-foreground)" }}>{sig.value}</span>
          </li>
        ))}
      </ul>
      {risk.flags.length > 0 && (
        <div className="feed-card__row">
          {risk.flags.map((flag) => (
            <span className="tag tag--skip" key={flag}>⚠ {flag}</span>
          ))}
        </div>
      )}
    </article>
  );
}

function FoundersCard({ score, cp }: { score: CompanyFounderScore; cp?: CounterpartCompany }) {
  return (
    <article className="feed-card">
      <header className="feed-card__head">
        <div>
          <div className="feed-card__title">{cp?.name ?? `Company #${score.crustdataCompanyId}`}</div>
          <div className="feed-card__sub">
            Founder composite · {Math.round(score.composite)}/100
            {score.hasRepeatOperator && " · repeat operator on team"}
          </div>
        </div>
        <span className="tag tag--accent">step 5</span>
      </header>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {score.founders.slice(0, 2).map((f) => (
          <div key={f.name} className="founder-card">
            <div className="founder-card__head">
              <span className="founder-card__name">{f.name}</span>
              <span className="founder-card__archetype">{f.archetype.replace("-", " ")}</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted-foreground)", lineHeight: 1.45 }}>
              {f.dossierHeadline}
            </p>
            {f.highlights.length > 0 && (
              <ul style={{ margin: 0, paddingInlineStart: "1.1rem", color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
                {f.highlights.slice(0, 2).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

function PortfolioEntryCard({ entry }: { entry: PortfolioEntry }) {
  return (
    <article className="feed-card" data-tone={entry.status}>
      <header className="feed-card__head">
        <div>
          <div className="feed-card__title">{entry.name}</div>
          <div className="feed-card__sub">
            mirrored from <em>{entry.mirroredFromName}</em> · {entry.thesisOneLiner}
          </div>
        </div>
        <span className={`tag tag--${entry.status}`}>{entry.status.toUpperCase()}</span>
      </header>
      <div className="feed-card__row">
        <span className="tag tag--accent portfolio-table__cheque">{fmtMoney(entry.chequeUsd)} cheque</span>
        <span className="tag">composite {Math.round(entry.scores.composite)}</span>
        <span className="tag">founder {Math.round(entry.scores.founderScore)}</span>
        <span className="tag">traction {Math.round(entry.scores.tractionScore)}</span>
        <span className="tag">val proxy {Math.round(entry.scores.valuationProxy)}</span>
        {entry.scores.riskFlagCount > 0 && (
          <span className="tag tag--skip">{entry.scores.riskFlagCount} risk flag{entry.scores.riskFlagCount > 1 ? "s" : ""}</span>
        )}
      </div>
      <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted-foreground)", lineHeight: 1.5 }}>
        {entry.allocationRationale}
      </p>
    </article>
  );
}

function SummaryCard({ summary }: { summary: PortfolioSummary }) {
  const total = summary.byStatus.invest + summary.byStatus.watch + summary.byStatus.skip;
  return (
    <article className="feed-card" data-tone="invest" style={{ background: "rgba(47,107,58,0.06)" }}>
      <header className="feed-card__head">
        <div>
          <div className="feed-card__title">Final portfolio assembled</div>
          <div className="feed-card__sub">
            {summary.byStatus.invest} invest · {summary.byStatus.watch} watch · {summary.byStatus.skip} skip · ${summary.totalDeployed.toLocaleString()} deployed
          </div>
        </div>
        <span className="tag tag--invest">complete</span>
      </header>
      {summary.warnings.length > 0 && (
        <div style={{ display: "grid", gap: "0.4rem" }}>
          {summary.warnings.map((w) => (
            <div className="error-state" key={w} style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>
              ⚠ {w}
            </div>
          ))}
        </div>
      )}
      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
        Total considered: {total} · Reserves held: ${summary.reservesHeld.toLocaleString()}
      </p>
    </article>
  );
}

type FeedItem =
  | { kind: "deal"; deal: MirroredDeal; key: string }
  | { kind: "thesis"; thesis: DealThesis; key: string }
  | { kind: "counterpart"; cp: CounterpartCompany; key: string }
  | { kind: "traction"; traction: TractionScore; risk: RiskFlag; key: string }
  | { kind: "founders"; score: CompanyFounderScore; key: string }
  | { kind: "entry"; entry: PortfolioEntry; key: string }
  | { kind: "summary"; summary: PortfolioSummary; key: string }
  | { kind: "warning"; step: string; message: string; key: string }
  | { kind: "blocked"; reason: string; key: string }
  | { kind: "failed"; message: string; key: string };

function buildFeedItems(events: PipelineEvent[]): FeedItem[] {
  const items: FeedItem[] = [];
  // De-dupe mirrored deals by Crustdata company id so the feed never shows
  // the same company twice if more than one fund happened to surface it.
  const dealMap = new Map<number, MirroredDeal>();

  events.forEach((ev, idx) => {
    if (ev.type === "step1a.deal") {
      if (!dealMap.has(ev.payload.crustdataCompanyId)) {
        dealMap.set(ev.payload.crustdataCompanyId, ev.payload);
      }
    }
    if (ev.type === "step.warning") {
      items.push({
        kind: "warning",
        step: ev.payload.step,
        message: ev.payload.message,
        key: `warn-${idx}`,
      });
    }
    if (ev.type === "run.blocked") {
      items.push({ kind: "blocked", reason: ev.payload.reason, key: `blocked-${idx}` });
    }
    if (ev.type === "run.failed") {
      items.push({ kind: "failed", message: ev.payload.message, key: `failed-${idx}` });
    }
    if (ev.type === "step2.thesis") {
      items.push({ kind: "thesis", thesis: ev.payload, key: `thesis-${ev.payload.crustdataCompanyId}` });
    }
    if (ev.type === "step3.counterpart") {
      items.push({
        kind: "counterpart",
        cp: ev.payload,
        key: `cp-${ev.payload.crustdataCompanyId}-${ev.payload.mirroredFromCompanyId}`,
      });
    }
    if (ev.type === "step4.traction") {
      items.push({
        kind: "traction",
        traction: ev.payload.traction,
        risk: ev.payload.risk,
        key: `traction-${ev.payload.traction.crustdataCompanyId}`,
      });
    }
    if (ev.type === "step5.founders") {
      items.push({ kind: "founders", score: ev.payload, key: `founders-${ev.payload.crustdataCompanyId}` });
    }
    if (ev.type === "step6.entry") {
      items.push({ kind: "entry", entry: ev.payload, key: `entry-${ev.payload.crustdataCompanyId}` });
    }
    if (ev.type === "step6.summary") {
      items.push({ kind: "summary", summary: ev.payload, key: `summary-${ev.payload.entries.length}` });
    }
  });

  // Insert dedup'd merged deals at the top of the feed
  const dealItems: FeedItem[] = Array.from(dealMap.values()).map((deal) => ({
    kind: "deal",
    deal,
    key: `deal-${deal.crustdataCompanyId}`,
  }));

  return [...dealItems, ...items];
}

function pickLatestStatusLine(events: PipelineEvent[]): string | null {
  for (let i = events.length - 1; i >= 0; i--) {
    const ev = events[i];
    if (ev.type === "step.started") return ev.payload.message ?? `Working on ${ev.payload.step}…`;
    if (ev.type === "api.call") return `Crustdata · ${ev.payload.description}`;
    if (ev.type === "reasoning") return `LLM · ${ev.payload.companyName ?? ev.payload.step}`;
    if (ev.type === "run.checkpoint") return "Bootstrap complete. Calling Crustdata…";
    if (ev.type === "run.started") return "Stream open. Waiting for first Crustdata response…";
  }
  return null;
}

export default function LiveFeed({ events }: { events: PipelineEvent[] }) {
  const items = buildFeedItems(events);
  const deals = events
    .filter((e) => e.type === "step1a.deal")
    .map((e) => (e as Extract<PipelineEvent, { type: "step1a.deal" }>).payload);
  const counterparts = events.filter((e) => e.type === "step3.counterpart").map((e) => (e as Extract<PipelineEvent, { type: "step3.counterpart" }>).payload);
  const statusLine = pickLatestStatusLine(events);

  if (items.length === 0) {
    const apiCallCount = events.filter((e) => e.type === "api.call").length;
    return (
      <section className="live-feed">
        <div className="live-feed__heading">
          <h2>Live feed</h2>
          <span className="eyebrow">{events.length} events · {apiCallCount} Crustdata calls</span>
        </div>
        <div className="empty-state">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", justifyContent: "center" }}>
            <span className="confidence-dot" data-c="high" />
            <strong>{statusLine ?? "Connecting to /api/run…"}</strong>
          </div>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
            Step 1 typically takes 10–25s while we resolve investor aliases and pull the last 6 months of funding rounds for each fund.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="live-feed">
      <div className="live-feed__heading">
        <h2>Live feed</h2>
        <span className="eyebrow">{items.length} cards · {events.length} events{statusLine ? ` · ${statusLine}` : ""}</span>
      </div>

      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.key}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {item.kind === "deal" && <MirroredDealCard deal={item.deal} />}
            {item.kind === "thesis" && <ThesisCard thesis={item.thesis} deals={deals} />}
            {item.kind === "counterpart" && <CounterpartCard cp={item.cp} />}
            {item.kind === "traction" && (
              <TractionCard
                traction={item.traction}
                risk={item.risk}
                cp={counterparts.find((c) => c.crustdataCompanyId === item.traction.crustdataCompanyId)}
              />
            )}
            {item.kind === "founders" && (
              <FoundersCard
                score={item.score}
                cp={counterparts.find((c) => c.crustdataCompanyId === item.score.crustdataCompanyId)}
              />
            )}
            {item.kind === "entry" && <PortfolioEntryCard entry={item.entry} />}
            {item.kind === "summary" && <SummaryCard summary={item.summary} />}
            {item.kind === "warning" && (
              <article className="feed-card" data-tone="skip">
                <header className="feed-card__head">
                  <div>
                    <div className="feed-card__title">Warning · {item.step}</div>
                    <div className="feed-card__sub">Pipeline kept going, but this branch failed.</div>
                  </div>
                  <span className="tag tag--skip">warn</span>
                </header>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted-foreground)" }}>{item.message}</p>
              </article>
            )}
            {item.kind === "blocked" && (
              <article className="feed-card" data-tone="skip">
                <header className="feed-card__head">
                  <div>
                    <div className="feed-card__title">Run blocked</div>
                    <div className="feed-card__sub">Fix the issue below and start a new run.</div>
                  </div>
                  <span className="tag tag--skip">blocked</span>
                </header>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted-foreground)" }}>{item.reason}</p>
              </article>
            )}
            {item.kind === "failed" && (
              <article className="feed-card" data-tone="skip">
                <header className="feed-card__head">
                  <div>
                    <div className="feed-card__title">Pipeline failed</div>
                    <div className="feed-card__sub">An exception bubbled out of one of the steps.</div>
                  </div>
                  <span className="tag tag--skip">failed</span>
                </header>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--muted-foreground)" }}>{item.message}</p>
              </article>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
}
