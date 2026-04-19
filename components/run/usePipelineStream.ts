"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PipelineEvent } from "@/lib/pipeline/events";

export type RunRequestPayload = {
  fundSize: number;
  targetPortfolioSize: number;
  blockedGeos: string[];
  blockedSectors: string[];
  maxChequeSize: number;
  minStage: "pre_seed" | "seed" | "series_a";
  maxStage: "pre_seed" | "seed" | "series_a";
  fundsToMirror: string[];
  demo: boolean;
};

type StreamState = {
  events: PipelineEvent[];
  status: "idle" | "running" | "completed" | "failed";
  error?: string;
  runId?: string;
};

function parseSseChunk(chunk: string): PipelineEvent[] {
  const blocks = chunk.split("\n\n");
  const events: PipelineEvent[] = [];
  for (const block of blocks) {
    if (!block.trim()) continue;
    const lines = block.split("\n");
    let eventName: string | null = null;
    let dataRaw: string | null = null;
    for (const line of lines) {
      if (line.startsWith(":")) continue;
      if (line.startsWith("event: ")) eventName = line.slice(7).trim();
      else if (line.startsWith("data: "))
        dataRaw = (dataRaw ?? "") + line.slice(6);
    }
    if (eventName && dataRaw) {
      try {
        const payload = JSON.parse(dataRaw);
        events.push({ type: eventName, payload } as PipelineEvent);
      } catch {
        // ignore malformed
      }
    }
  }
  return events;
}

export function usePipelineStream() {
  const [state, setState] = useState<StreamState>({
    events: [],
    status: "idle",
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const start = useCallback(async (payload: RunRequestPayload) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ events: [], status: "running" });

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.body) {
        setState((s) => ({ ...s, status: "failed", error: "No response body" }));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const splitIdx = buffer.lastIndexOf("\n\n");
        if (splitIdx === -1) continue;
        const ready = buffer.slice(0, splitIdx + 2);
        buffer = buffer.slice(splitIdx + 2);
        const events = parseSseChunk(ready);
        if (events.length === 0) continue;

        setState((prev) => {
          const merged = [...prev.events, ...events];
          let status = prev.status;
          let error = prev.error;
          let runId = prev.runId;
          for (const ev of events) {
            if (ev.type === "run.started") runId = ev.payload.runId;
            if (ev.type === "run.completed") {
              status = "completed";
              runId = ev.payload.runId;
            }
            if (ev.type === "run.failed") {
              status = "failed";
              error = ev.payload.message;
            }
            if (ev.type === "run.blocked") {
              status = "failed";
              error = ev.payload.reason;
            }
          }
          return { events: merged, status, error, runId };
        });
      }

      // Drain any final buffered event
      if (buffer.trim()) {
        const finalEvents = parseSseChunk(buffer);
        if (finalEvents.length) {
          setState((prev) => ({ ...prev, events: [...prev.events, ...finalEvents] }));
        }
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      setState((s) => ({
        ...s,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setState((s) => ({ ...s, status: s.status === "running" ? "failed" : s.status, error: s.error ?? "Aborted." }));
  }, []);

  return { ...state, start, stop };
}
