import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { RunRecord } from "@/lib/pipeline/types";

const RUNS_ROOT = path.join(process.cwd(), ".cache", "runs");
const FIXTURE_PATH = path.join(process.cwd(), "lib", "fixtures", "demo-run.json");

export async function loadRun(runId?: string): Promise<RunRecord | null> {
  const candidates = [
    runId ? path.join(RUNS_ROOT, `${runId}.json`) : null,
    path.join(RUNS_ROOT, "latest.json"),
    FIXTURE_PATH,
  ].filter(Boolean) as string[];

  for (const filePath of candidates) {
    try {
      const raw = await readFile(filePath, "utf8");
      return JSON.parse(raw) as RunRecord;
    } catch {
      // try next candidate
    }
  }

  return null;
}

export async function listRuns(): Promise<string[]> {
  try {
    const entries = await readdir(RUNS_ROOT);
    return entries.filter((name) => name.endsWith(".json") && name !== "latest.json");
  } catch {
    return [];
  }
}
