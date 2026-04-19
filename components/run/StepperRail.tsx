"use client";

import type { PipelineEvent, PipelineStepId } from "@/lib/pipeline/events";

const STEP_DEFS: Array<{ id: PipelineStepId; label: string }> = [
  { id: "bootstrap", label: "Bootstrap" },
  { id: "step1a", label: "1 · Mirrored deals (6mo)" },
  { id: "step2", label: "2 · Thesis extraction" },
  { id: "step3", label: "3 · Counterpart finder" },
  { id: "step4", label: "4 · Traction & risk" },
  { id: "step5", label: "5 · Founder scoring" },
  { id: "step6", label: "6 · Portfolio assembly" },
];

type StepState = "pending" | "running" | "completed" | "failed" | "skipped";

function deriveStepStates(events: PipelineEvent[]): Record<PipelineStepId, { state: StepState; count: number }> {
  const result = Object.fromEntries(
    STEP_DEFS.map((s) => [s.id, { state: "pending" as StepState, count: 0 }]),
  ) as Record<PipelineStepId, { state: StepState; count: number }>;

  for (const ev of events) {
    if (ev.type === "step.started") result[ev.payload.step] = { ...result[ev.payload.step], state: "running" };
    if (ev.type === "step.completed")
      result[ev.payload.step] = { state: "completed", count: ev.payload.itemCount };
    if (ev.type === "step.skipped") result[ev.payload.step] = { ...result[ev.payload.step], state: "skipped" };
    if (ev.type === "run.failed") {
      for (const id of Object.keys(result) as PipelineStepId[]) {
        if (result[id].state === "running") result[id].state = "failed";
      }
    }
  }
  return result;
}

export default function StepperRail({ events }: { events: PipelineEvent[] }) {
  const states = deriveStepStates(events);

  return (
    <aside className="stepper">
      <p className="stepper__title">Pipeline</p>
      {STEP_DEFS.map((step, idx) => {
        const s = states[step.id];
        return (
          <div key={step.id} className="step-row" data-state={s.state}>
            <span className="step-row__index">{idx === 0 ? "·" : idx}</span>
            <span className="step-row__label">{step.label}</span>
            {s.count > 0 && <span className="step-row__count">{s.count}</span>}
          </div>
        );
      })}
    </aside>
  );
}
