import path from "node:path";

// On Vercel (and any read-only serverless filesystem) only `/tmp` is writable.
// Locally we keep using `<repo>/.cache` so dev caches survive across runs.
const IS_SERVERLESS_RO = Boolean(process.env.VERCEL) || process.env.MIRRORVC_USE_TMP_CACHE === "1";

export const CACHE_ROOT = IS_SERVERLESS_RO
  ? path.join("/tmp", "mirrorvc-cache")
  : path.join(process.cwd(), ".cache");

export function cacheSubdir(...segments: string[]) {
  return path.join(CACHE_ROOT, ...segments);
}
