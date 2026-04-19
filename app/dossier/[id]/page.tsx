import Link from "next/link";
import { notFound } from "next/navigation";
import { getFundById } from "@/lib/funds/registry";
import { loadRun } from "@/lib/pipeline/runStore";

function fmtMoney(value?: number | null) {
  if (value == null) return "—";
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
}

function ScoreBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="score-bar">
      <span>{label}</span>
      <div className="score-bar__track">
        <span className="score-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="score-bar__value">{Math.round(value)}</span>
    </div>
  );
}

export default async function DossierPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ runId?: string }>;
}) {
  const { id } = await params;
  const { runId } = await searchParams;
  const run = await loadRun(runId);
  if (!run) notFound();

  const companyId = Number(id);
  const entry = run.portfolio.entries.find((e) => e.crustdataCompanyId === companyId);
  const cp = run.counterparts.find((c) => c.crustdataCompanyId === companyId);

  if (!entry || !cp) {
    return (
      <main className="container dossier-page">
        <section className="panel">
          <div className="eyebrow">Dossier</div>
          <h1 style={{ margin: "0.5rem 0 1rem" }}>Company not found in this run.</h1>
          <Link href="/portfolio" className="primary-button">← Back to portfolio</Link>
        </section>
      </main>
    );
  }

  const traction = run.traction.find((t) => t.crustdataCompanyId === companyId);
  const risk = run.riskFlags.find((r) => r.crustdataCompanyId === companyId);
  const founderScore = run.founders.find((f) => f.crustdataCompanyId === companyId);
  const mirrorDeal = run.deals.find((d) => d.crustdataCompanyId === cp.mirroredFromCompanyId);
  const mirrorThesis = run.theses.find((t) => t.crustdataCompanyId === cp.mirroredFromCompanyId);
  const reasoning = run.reasoning.filter(
    (r) => r.companyName === cp.name || r.companyName === mirrorDeal?.name,
  );

  return (
    <main className="container container--wide dossier-page">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <Link href={`/portfolio${runId ? `?runId=${runId}` : ""}`} className="eyebrow" style={{ textDecoration: "none" }}>
            ← BACK TO PORTFOLIO
          </Link>
          <h1 style={{ margin: "0.5rem 0 0.4rem", fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>{cp.name}</h1>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
            {cp.primaryDomain ? <a href={`https://${cp.primaryDomain}`} target="_blank" rel="noreferrer">{cp.primaryDomain}</a> : null}
            {cp.hqCity ? ` · ${cp.hqCity}` : ""}
            {cp.hqCountry ? `, ${cp.hqCountry}` : ""}
            {cp.yearFounded ? ` · founded ${cp.yearFounded}` : ""}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className={`tag tag--${entry.status}`}>{entry.status.toUpperCase()}</span>
          <h2 style={{ margin: "0.4rem 0 0", fontSize: "2rem" }}>{fmtMoney(entry.chequeUsd)}</h2>
          <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
            composite {Math.round(entry.scores.composite)}/100
          </p>
        </div>
      </header>

      <section className="panel">
        <div className="callout">
          <strong>Why we&apos;re mirroring this:</strong> {entry.allocationRationale}
        </div>
      </section>

      <div className="dossier-grid">
        <div className="dossier-section" style={{ display: "grid", gap: "1rem" }}>
          <section className="panel">
            <div className="eyebrow">Mirror context</div>
            <h2 style={{ margin: "0.4rem 0 0.7rem" }}>
              Traced back to {getFundById(cp.fundId)?.displayName ?? cp.fundId}&apos;s bet on{" "}
              <em>{cp.mirroredFromName}</em>
            </h2>
            {mirrorThesis && (
              <>
                <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.55 }}>
                  <strong>{mirrorThesis.thesisOneLiner}</strong>
                </p>
                <p style={{ margin: "0.5rem 0 0", color: "var(--muted-foreground)", lineHeight: 1.55 }}>
                  {mirrorThesis.beliefStatement}
                </p>
                <div className="feed-card__row" style={{ marginTop: "0.7rem" }}>
                  {mirrorThesis.resolvedIndustries.map((ind) => (
                    <span className="tag" key={ind}>{ind}</span>
                  ))}
                  <span className="tag tag--accent">{mirrorThesis.marketTiming}</span>
                </div>
              </>
            )}
            {mirrorDeal && (
              <p style={{ margin: "0.7rem 0 0", color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
                Mirrored deal: {fmtMoney(mirrorDeal.roundAmountUsd)} {mirrorDeal.roundType ?? "round"} on{" "}
                {mirrorDeal.fundingDate ?? "unknown date"}.
              </p>
            )}
          </section>

          <section className="panel">
            <div className="eyebrow">Thesis fit</div>
            <h3 style={{ margin: "0.4rem 0 0.6rem" }}>{cp.thesisAlignment}/100 alignment with mirrored thesis</h3>
            <p style={{ margin: 0, color: "var(--muted-foreground)", lineHeight: 1.55 }}>{cp.thesisRationale}</p>
            {cp.llmRedFlag && (
              <div className="error-state" style={{ marginTop: "0.7rem" }}>⚠ {cp.llmRedFlag}</div>
            )}
          </section>

          {founderScore && founderScore.founders.length > 0 && (
            <section className="panel">
              <div className="eyebrow">Founders</div>
              <h3 style={{ margin: "0.4rem 0 0.7rem" }}>
                {founderScore.founders.length} founder{founderScore.founders.length > 1 ? "s" : ""} ·
                composite {Math.round(founderScore.composite)}/100
              </h3>
              <div style={{ display: "grid", gap: "0.7rem" }}>
                {founderScore.founders.map((f) => (
                  <article key={f.name} className="founder-card">
                    <div className="founder-card__head">
                      <div>
                        <span className="founder-card__name">{f.name}</span>
                        {f.title && <span style={{ marginLeft: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.85rem" }}>{f.title}</span>}
                      </div>
                      <span className="founder-card__archetype">{f.archetype.replace("-", " ")}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.55 }}>{f.dossierHeadline}</p>
                    {f.highlights.length > 0 && (
                      <ul style={{ margin: 0, paddingInlineStart: "1.1rem", color: "var(--muted-foreground)", fontSize: "0.88rem" }}>
                        {f.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    )}
                    {f.caveats.length > 0 && (
                      <ul style={{ margin: 0, paddingInlineStart: "1.1rem", color: "var(--accent-deep)", fontSize: "0.85rem" }}>
                        {f.caveats.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    )}
                    {f.linkedinUrl && (
                      <a href={f.linkedinUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "var(--accent-deep)" }}>
                        LinkedIn ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="dossier-section" style={{ display: "grid", gap: "1rem" }}>
          <section className="panel">
            <div className="eyebrow">Score breakdown</div>
            <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.7rem" }}>
              <ScoreBar label="Thesis alignment" value={entry.scores.thesisAlignment} />
              <ScoreBar label="Founder" value={entry.scores.founderScore} />
              <ScoreBar label="Traction" value={entry.scores.tractionScore} />
              <ScoreBar label="Valuation proxy" value={entry.scores.valuationProxy} />
              <ScoreBar label="Data confidence" value={entry.scores.dataConfidence} />
              <ScoreBar label="Composite" value={entry.scores.composite} />
            </div>
          </section>

          {traction && (
            <section className="panel">
              <div className="eyebrow">Traction signals</div>
              <h3 style={{ margin: "0.4rem 0 0.7rem" }}>{Math.round(traction.composite)}/100 composite</h3>
              <ul className="signal-list">
                {traction.signals.map((s) => (
                  <li key={s.label}>
                    <span className="confidence-dot" data-c={s.confidence === "high" ? "high" : s.confidence === "medium" ? "med" : "low"} />
                    <strong>{s.label}:</strong>&nbsp;<span style={{ color: "var(--muted-foreground)" }}>{s.value}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {risk && risk.flags.length > 0 && (
            <section className="panel">
              <div className="eyebrow">Risk flags</div>
              <div className="feed-card__row" style={{ marginTop: "0.6rem" }}>
                {risk.flags.map((flag) => (
                  <span key={flag} className="tag tag--skip">⚠ {flag}</span>
                ))}
              </div>
            </section>
          )}

          <section className="panel">
            <div className="eyebrow">Valuation proxy</div>
            <h3 style={{ margin: "0.4rem 0 0.6rem" }}>{cp.valuationProxy.score}/100 cheaper-twin score</h3>
            <ul style={{ margin: 0, paddingInlineStart: "1.1rem", color: "var(--muted-foreground)", fontSize: "0.9rem" }}>
              {cp.valuationProxy.signals.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p style={{ margin: "0.7rem 0 0", color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
              Round: {cp.roundType ?? "—"} · {fmtMoney(cp.roundAmountUsd)} · {cp.headcountTotal ?? "?"} heads ·{" "}
              {cp.investors.length} investor{cp.investors.length === 1 ? "" : "s"}
            </p>
          </section>

          {reasoning.length > 0 && (
            <section className="panel">
              <div className="eyebrow">AI reasoning trail</div>
              <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.6rem" }}>
                {reasoning.map((r, idx) => (
                  <div key={idx} className="reasoning-entry">
                    <div className="eyebrow">{r.step.toUpperCase()}</div>
                    <p className="reasoning-entry__rationale">{r.rationale}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
