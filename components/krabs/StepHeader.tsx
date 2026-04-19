"use client";

import Link from "next/link";
import { Fragment } from "react";
import CrustyLogo from "./CrustyLogo";

export type OnboardingStep = "funds" | "capital" | "blocks" | "review";

const STEPS: Array<{ key: OnboardingStep; label: string }> = [
  { key: "funds", label: "Shadow" },
  { key: "capital", label: "Capital" },
  { key: "blocks", label: "Filters" },
  { key: "review", label: "Review" },
];

type StepHeaderProps = {
  current: OnboardingStep;
  onExit?: () => void;
  liveBadgeLabel?: string;
};

export default function StepHeader({
  current,
  onExit,
  liveBadgeLabel = "Eugene K. is sourcing",
}: StepHeaderProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <header
      className="w-full border-b-[2.5px] border-ink bg-parchment sticky top-0 z-30"
      data-testid="step-header"
      style={{ borderColor: "var(--ink)" }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-6">
        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-2"
            aria-label="Back to landing"
            style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
          >
            <CrustyLogo />
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2" aria-label="Back to landing">
            <CrustyLogo />
          </Link>
        )}

        <div className="hidden md:flex items-center gap-0 flex-1 max-w-xl mx-8">
          {STEPS.map((s, i) => (
            <Fragment key={s.key}>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`step-dot ${
                    i < currentIdx ? "done" : i === currentIdx ? "current" : ""
                  }`}
                  data-testid={`step-dot-${s.key}`}
                />
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    fontWeight: i === currentIdx ? 700 : 500,
                    color: i === currentIdx ? "var(--ink)" : "rgba(28,34,51,0.55)",
                  }}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 mx-3 border-t-[2.5px] border-dotted"
                  style={{
                    borderColor: i < currentIdx ? "var(--avocado)" : "rgba(28,34,51,0.25)",
                  }}
                />
              )}
            </Fragment>
          ))}
        </div>

        <div className="kk-chip kk-chip-aqua hidden sm:inline-flex">
          <span
            className="rounded-full bg-white animate-pulse"
            style={{ width: 6, height: 6, background: "#ffffff" }}
          />
          {liveBadgeLabel}
        </div>
      </div>
      <div className="pattern-bar" />
    </header>
  );
}
