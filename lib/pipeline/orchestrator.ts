import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cacheSubdir } from "@/lib/cachePaths";
import type { PipelineEvent } from "@/lib/pipeline/events";
import type {
  ApiCallSnapshot,
  CompanyFounderScore,
  CounterpartCompany,
  DealThesis,
  MirroredDeal,
  PortfolioSummary,
  ReasoningEntry,
  RiskFlag,
  RunConfig,
  RunRecord,
  TractionScore,
} from "@/lib/pipeline/types";

type CrustdataResult<T> = {
  payload: T;
  usage: { endpoint: string; estimatedCredits: number };
  cached: boolean;
};

export type RunCollector = {
  runId: string;
  startedAt: string;
  config: RunConfig;
  deals: MirroredDeal[];
  theses: DealThesis[];
  counterparts: CounterpartCompany[];
  traction: TractionScore[];
  riskFlags: RiskFlag[];
  founders: CompanyFounderScore[];
  portfolio: PortfolioSummary | null;
  apiCalls: ApiCallSnapshot[];
  reasoning: ReasoningEntry[];
  totalCredits: number;
  notes: string[];
};

export type PipelineContext = {
  collector: RunCollector;
  emit: (event: PipelineEvent) => void;
  track: <T>(description: string, call: Promise<CrustdataResult<T>>) => Promise<T>;
  pushReasoning: (entry: ReasoningEntry) => void;
  note: (message: string) => void;
};

export function createCollector(runId: string, config: RunConfig): RunCollector {
  return {
    runId,
    startedAt: new Date().toISOString(),
    config,
    deals: [],
    theses: [],
    counterparts: [],
    traction: [],
    riskFlags: [],
    founders: [],
    portfolio: null,
    apiCalls: [],
    reasoning: [],
    totalCredits: 0,
    notes: [],
  };
}

export function createContext(
  collector: RunCollector,
  emit: (event: PipelineEvent) => void,
): PipelineContext {
  return {
    collector,
    emit,
    async track(description, call) {
      const startedAt = Date.now();
      const result = await call;
      const durationMs = Date.now() - startedAt;
      const resultCount = countResults(result.payload);
      const snapshot: ApiCallSnapshot = {
        endpoint: result.usage.endpoint,
        durationMs,
        cached: result.cached,
        estimatedCredits: result.cached ? 0 : result.usage.estimatedCredits,
        resultCount,
        description,
      };
      collector.apiCalls.push(snapshot);
      collector.totalCredits += snapshot.estimatedCredits;
      emit({ type: "api.call", payload: snapshot });
      return result.payload;
    },
    pushReasoning(entry) {
      collector.reasoning.push(entry);
      emit({ type: "reasoning", payload: entry });
    },
    note(message) {
      collector.notes.push(message);
    },
  };
}

function countResults(payload: unknown): number | undefined {
  if (Array.isArray(payload)) {
    return payload.length;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "companies" in payload &&
    Array.isArray((payload as { companies: unknown[] }).companies)
  ) {
    return (payload as { companies: unknown[] }).companies.length;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "people" in payload &&
    Array.isArray((payload as { people: unknown[] }).people)
  ) {
    return (payload as { people: unknown[] }).people.length;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "results" in payload &&
    Array.isArray((payload as { results: unknown[] }).results)
  ) {
    return (payload as { results: unknown[] }).results.length;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "suggestions" in payload &&
    Array.isArray((payload as { suggestions: unknown[] }).suggestions)
  ) {
    return (payload as { suggestions: unknown[] }).suggestions.length;
  }

  return undefined;
}

const RUNS_ROOT = cacheSubdir("runs");

export async function persistRun(collector: RunCollector) {
  if (!collector.portfolio) {
    collector.portfolio = {
      entries: [],
      totalDeployed: 0,
      reservesHeld: 0,
      byStatus: { invest: 0, watch: 0, skip: 0 },
      byThesisCluster: [],
      byGeo: {},
      byStage: {},
      warnings: ["Portfolio not produced. The pipeline failed before Step 6."],
    };
  }

  const record: RunRecord = {
    runId: collector.runId,
    startedAt: collector.startedAt,
    completedAt: new Date().toISOString(),
    config: collector.config,
    deals: collector.deals,
    theses: collector.theses,
    counterparts: collector.counterparts,
    traction: collector.traction,
    riskFlags: collector.riskFlags,
    founders: collector.founders,
    portfolio: collector.portfolio,
    apiCalls: collector.apiCalls,
    reasoning: collector.reasoning,
    totalCredits: collector.totalCredits,
    notes: collector.notes,
  };

  await mkdir(RUNS_ROOT, { recursive: true });
  const filePath = path.join(RUNS_ROOT, `${collector.runId}.json`);
  await writeFile(filePath, JSON.stringify(record, null, 2), "utf8");
  await writeFile(path.join(RUNS_ROOT, "latest.json"), JSON.stringify(record, null, 2), "utf8");
  return record;
}

export function generateRunId() {
  const datePart = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `${datePart}-${randomPart}`;
}
