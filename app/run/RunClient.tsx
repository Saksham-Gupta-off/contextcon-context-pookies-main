"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, Rocket } from "lucide-react";
import LiveFeed from "@/components/run/LiveFeed";
import RightRail from "@/components/run/RightRail";
import StepperRail from "@/components/run/StepperRail";
import StepHeader from "@/components/krabs/StepHeader";
import { usePipelineStream, type RunRequestPayload } from "@/components/run/usePipelineStream";
import { getFundById } from "@/lib/funds/registry";

function statusBadge(status: "idle" | "running" | "completed" | "failed") {
  if (status === "running") return { label: "● live", tone: "kk-chip-aqua" };
  if (status === "completed") return { label: "✓ complete", tone: "kk-chip-avocado" };
  if (status === "failed") return { label: "× failed", tone: "kk-chip-tomato" };
  return { label: "preparing", tone: "kk-chip-yellow" };
}

export default function RunClient({ config }: { config: RunRequestPayload }) {
  const { events, status, error, runId, start, stop } = usePipelineStream();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    start(config);
  }, [config, start]);

  const badge = statusBadge(status);
  const fundLabels = config.fundsToMirror
    .map((id) => getFundById(id)?.displayName ?? id)
    .join(" · ");

  return (
    <div className="min-h-screen bg-parchment">
      <StepHeader current="review" liveBadgeLabel="Live mirror run" />

      <main className="container container--wide">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "1rem",
            paddingTop: "1.6rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span className={`kk-chip ${badge.tone}`}>{badge.label}</span>
            <h1
              className="font-display text-ink"
              style={{ margin: "0.6rem 0 0", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", lineHeight: 1.05 }}
            >
              {config.demo ? "Replaying captured run" : "Mirroring smart-money convictions"}
            </h1>
            <p
              style={{
                margin: "0.4rem 0 0",
                color: "rgba(28,34,51,0.7)",
                maxWidth: "62ch",
                fontSize: "0.95rem",
              }}
            >
              Funds: <strong>{fundLabels}</strong> · Portfolio target:{" "}
              {config.targetPortfolioSize} · Cheque cap ${config.maxChequeSize.toLocaleString()}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
            {status === "running" && (
              <button type="button" className="kk-btn kk-btn-ghost kk-btn-sm" onClick={stop}>
                Cancel
              </button>
            )}
            {status === "completed" && (
              <>
                <Link href="/onboarding" className="kk-btn kk-btn-ghost kk-btn-sm">
                  <ArrowLeft size={14} strokeWidth={3} />
                  New run
                </Link>
                <Link
                  href={`/portfolio${runId ? `?runId=${runId}` : ""}`}
                  className="kk-btn kk-btn-sm"
                >
                  View portfolio
                  <Rocket size={14} strokeWidth={3} />
                </Link>
              </>
            )}
            {status !== "running" && status !== "completed" && (
              <Link href="/onboarding" className="kk-btn kk-btn-ghost kk-btn-sm">
                <ArrowLeft size={14} strokeWidth={3} />
                Onboarding
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="error-state" style={{ marginTop: "1rem" }}>
            <strong>Run halted.</strong> {error}
          </div>
        )}

        <section className="live-run">
          <StepperRail events={events} />
          <LiveFeed events={events} />
          <RightRail events={events} />
        </section>
      </main>
    </div>
  );
}
