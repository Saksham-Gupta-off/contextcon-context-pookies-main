import Link from "next/link";
import DiversificationDonut from "@/components/portfolio/DiversificationDonut";
import FundFlow from "@/components/portfolio/FundFlow";
import { getFundById } from "@/lib/funds/registry";
import { loadRun } from "@/lib/pipeline/runStore";

function fmtMoney(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ runId?: string }>;
}) {
  const { runId } = await searchParams;
  const run = await loadRun(runId);

  if (!run) {
    return (
      <main className="container portfolio-page">
        <section className="panel">
          <div className="eyebrow">Portfolio</div>
          <h1 style={{ margin: "0.5rem 0 1rem" }}>No run captured yet.</h1>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
            Start a mirror run from the home page. The portfolio appears here as soon as it&apos;s assembled.
          </p>
          <p style={{ marginTop: "1.2rem" }}>
            <Link href="/onboarding" className="primary-button">Start a run →</Link>
          </p>
        </section>
      </main>
    );
  }

  const { portfolio, deals, counterparts, totalCredits, completedAt, config, runId: actualRunId } = run;
  const totalEntries = portfolio.entries.length;
  const investShare = (portfolio.byStatus.invest / Math.max(1, totalEntries)) * 100;
  const watchShare = (portfolio.byStatus.watch / Math.max(1, totalEntries)) * 100;
  const skipShare = (portfolio.byStatus.skip / Math.max(1, totalEntries)) * 100;

  const clusterSlices = portfolio.byThesisCluster.map((c) => ({
    label: c.thesisLabel,
    share: c.capitalShare,
  }));
  const geoSlices = Object.entries(portfolio.byGeo).map(([label, share]) => ({ label, share }));
  const stageSlices = Object.entries(portfolio.byStage).map(([label, share]) => ({ label: label.replace("_", " "), share }));

  return (
    <main className="container container--wide portfolio-page">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span className="accent-pill">Final portfolio</span>
          <h1 style={{ margin: "0.5rem 0 0.4rem", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
            {portfolio.byStatus.invest} cheques. {fmtMoney(portfolio.totalDeployed)} deployed.
          </h1>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
            Run {actualRunId} · finished {new Date(completedAt).toLocaleString()} · {totalCredits.toFixed(1)} Crustdata credits
          </p>
        </div>
        <Link href="/onboarding" className="secondary-button">← New run</Link>
      </header>

      {portfolio.warnings.length > 0 && (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {portfolio.warnings.map((w) => (
            <div key={w} className="error-state">⚠ {w}</div>
          ))}
        </div>
      )}

      <section className="portfolio-summary">
        <div className="summary-card">
          <h3>Capital deployed</h3>
          <p className="summary-card__value">{fmtMoney(portfolio.totalDeployed)}</p>
          <p className="summary-card__sub">
            of {fmtMoney(config.fundSize)} fund · {fmtMoney(portfolio.reservesHeld)} held in reserves
          </p>
          <div className="status-bar" title={`${portfolio.byStatus.invest} invest / ${portfolio.byStatus.watch} watch / ${portfolio.byStatus.skip} skip`}>
            <span className="status-bar__invest" style={{ width: `${investShare}%` }} />
            <span className="status-bar__watch" style={{ width: `${watchShare}%` }} />
            <span className="status-bar__skip" style={{ width: `${skipShare}%` }} />
          </div>
        </div>
        <div className="summary-card">
          <h3>Invest cheques</h3>
          <p className="summary-card__value">{portfolio.byStatus.invest}</p>
          <p className="summary-card__sub">avg {fmtMoney(Math.round(portfolio.totalDeployed / Math.max(1, portfolio.byStatus.invest)))}</p>
        </div>
        <div className="summary-card">
          <h3>Watchlist</h3>
          <p className="summary-card__value">{portfolio.byStatus.watch}</p>
          <p className="summary-card__sub">composite 50–64</p>
        </div>
        <div className="summary-card">
          <h3>Skipped</h3>
          <p className="summary-card__value">{portfolio.byStatus.skip}</p>
          <p className="summary-card__sub">composite &lt; 50</p>
        </div>
      </section>

      <section className="panel" style={{ display: "grid", gap: "1rem" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ margin: 0 }}>Fund flow</h2>
          <span className="eyebrow">smart money → their deal → our cheaper twin</span>
        </header>
        <FundFlow deals={deals} counterparts={counterparts} entries={portfolio.entries} />
      </section>

      <section className="panel">
        <h2 style={{ margin: "0 0 1rem" }}>Diversification</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.6rem" }}>
          <DiversificationDonut title="By thesis cluster" slices={clusterSlices} />
          <DiversificationDonut title="By geography" slices={geoSlices} />
          <DiversificationDonut title="By stage" slices={stageSlices} />
        </div>
      </section>

      <section className="panel" style={{ overflowX: "auto" }}>
        <h2 style={{ margin: "0 0 1rem" }}>Portfolio</h2>
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Mirrored from</th>
              <th>Thesis</th>
              <th>Composite</th>
              <th>Cheque</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {portfolio.entries.map((entry) => (
              <tr key={entry.crustdataCompanyId} data-status={entry.status}>
                <td>
                  <div style={{ fontWeight: 600 }}>{entry.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                    {entry.hqCountry ?? "—"} · {entry.stage ?? "—"}
                  </div>
                </td>
                <td>{getFundById(entry.fundId)?.displayName ?? entry.fundId} · <em>{entry.mirroredFromName}</em></td>
                <td style={{ maxWidth: 320 }}>{entry.thesisOneLiner}</td>
                <td className="portfolio-table__cheque">{Math.round(entry.scores.composite)}</td>
                <td className="portfolio-table__cheque">{entry.chequeUsd > 0 ? fmtMoney(entry.chequeUsd) : "—"}</td>
                <td>
                  <span className={`tag tag--${entry.status}`}>{entry.status.toUpperCase()}</span>
                </td>
                <td>
                  <Link href={`/dossier/${entry.crustdataCompanyId}${runId ? `?runId=${runId}` : ""}`}>
                    Dossier →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
