"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { PipelineEvent } from "@/lib/pipeline/events";

export default function RightRail({ events }: { events: PipelineEvent[] }) {
  const apiCalls = events
    .filter((e) => e.type === "api.call")
    .map((e) => (e as Extract<PipelineEvent, { type: "api.call" }>).payload)
    .reverse();
  const reasoning = events
    .filter((e) => e.type === "reasoning")
    .map((e) => (e as Extract<PipelineEvent, { type: "reasoning" }>).payload)
    .reverse();

  const totalCredits = events
    .filter((e) => e.type === "api.call")
    .reduce((sum, e) => sum + ((e as Extract<PipelineEvent, { type: "api.call" }>).payload.estimatedCredits ?? 0), 0);
  const cachedCount = apiCalls.filter((c) => c.cached).length;

  return (
    <aside className="right-rail">
      <section className="rail-section">
        <header className="rail-section__head">
          <h3>AI reasoning</h3>
          <span className="eyebrow">{reasoning.length} entries</span>
        </header>
        <AnimatePresence initial={false}>
          {reasoning.length === 0 ? (
            <p className="empty-state" style={{ padding: "0.5rem" }}>
              The model hasn&apos;t spoken yet.
            </p>
          ) : (
            reasoning.map((entry, idx) => (
              <motion.div
                key={`r-${idx}-${entry.companyName}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="reasoning-entry"
              >
                <div className="eyebrow">
                  {entry.step.toUpperCase()} · {entry.companyName}
                </div>
                <p className="reasoning-entry__rationale">{entry.rationale}</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>

      <section className="rail-section">
        <header className="rail-section__head">
          <h3>Crustdata API inspector</h3>
          <span className="eyebrow">
            {apiCalls.length} calls · {totalCredits.toFixed(1)} credits · {cachedCount} cached
          </span>
        </header>
        <AnimatePresence initial={false}>
          {apiCalls.length === 0 ? (
            <p className="empty-state" style={{ padding: "0.5rem" }}>No calls yet.</p>
          ) : (
            apiCalls.map((call, idx) => (
              <motion.div
                key={`api-${idx}-${call.endpoint}-${call.durationMs}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="api-call"
                data-cached={call.cached}
              >
                <span className="api-call__endpoint">{call.endpoint}</span>
                <span className="api-call__meta">
                  {call.durationMs}ms{call.cached ? " · CACHED" : ` · ${call.estimatedCredits.toFixed(1)}c`}
                  {call.resultCount != null ? ` · n=${call.resultCount}` : ""}
                </span>
                <p className="api-call__desc">{call.description}</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </section>
    </aside>
  );
}
