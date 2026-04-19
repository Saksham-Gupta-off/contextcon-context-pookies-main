import pLimit from "p-limit";

const DEFAULT_LLM_CONCURRENCY = (() => {
  const raw = Number(process.env.MIRRORVC_LLM_CONCURRENCY);
  if (Number.isFinite(raw) && raw >= 1 && raw <= 32) return Math.floor(raw);
  return 8;
})();

export function createLlmLimiter(concurrency: number = DEFAULT_LLM_CONCURRENCY) {
  return pLimit(concurrency);
}

export const LLM_CONCURRENCY = DEFAULT_LLM_CONCURRENCY;
