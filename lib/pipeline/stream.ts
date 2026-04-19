import type { PipelineEvent } from "@/lib/pipeline/events";

const encoder = new TextEncoder();

export function encodePipelineEvent(event: PipelineEvent) {
  return encoder.encode(
    `event: ${event.type}\ndata: ${JSON.stringify(event.payload)}\n\n`,
  );
}

// SSE comment line ≥ 2 KB to defeat dev-proxy / Next.js dev-mode response
// buffering so the browser starts receiving events immediately instead of
// waiting for a chunk to fill.
export function encodeSseFlushPadding() {
  const padding = `: ${"\u200b".repeat(2048)}\n\n`;
  return encoder.encode(padding);
}

export function createSseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    // Disables proxy/upstream buffering (e.g. nginx, Vercel edge, some Next
    // dev wrappers) so each enqueue is flushed to the client immediately.
    "X-Accel-Buffering": "no",
  } as const;
}

