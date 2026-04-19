import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireEnv } from "@/lib/env";

const API_VERSION = "2025-11-01";
const BASE_URL = "https://api.crustdata.com";
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined };

type EndpointKind =
  | "company/search"
  | "company/enrich"
  | "company/identify"
  | "company/search/autocomplete"
  | "person/search"
  | "person/enrich"
  | "person/search/autocomplete"
  | "web/search/live"
  | "web/enrich/live";

type RequestOptions<T> = {
  body: JsonValue;
  normalize?: (payload: unknown) => T;
  useCache?: boolean;
};

type CreditUsage = {
  endpoint: EndpointKind;
  estimatedCredits: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class IntervalQueue {
  private timestamps: number[] = [];
  private tail: Promise<void> = Promise.resolve();

  add<T>(task: () => Promise<T>) {
    const runTask = async () => {
      await this.waitForTurn();
      this.timestamps.push(Date.now());
      return task();
    };

    const result = this.tail.then(runTask, runTask);
    this.tail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private async waitForTurn() {
    while (true) {
      this.prune();

      if (this.timestamps.length < MAX_REQUESTS_PER_WINDOW) {
        return;
      }

      const oldest = this.timestamps[0];
      const waitMs = Math.max(50, WINDOW_MS - (Date.now() - oldest) + 10);
      await sleep(waitMs);
    }
  }

  private prune() {
    const threshold = Date.now() - WINDOW_MS;
    this.timestamps = this.timestamps.filter((timestamp) => timestamp > threshold);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Live Crustdata behavior for company identify/enrich and person enrich is a
// top-level array. Some docs and example blocks still show a stale
// { results: [...] } wrapper, so we normalize both safely here.
function normalizeWrappedArray(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (isObject(payload) && Array.isArray(payload.results)) {
    return payload.results;
  }

  return payload;
}

function estimateCredits(endpoint: EndpointKind, payload: unknown): number {
  if (endpoint === "company/search" && isObject(payload) && Array.isArray(payload.companies)) {
    return payload.companies.length * 0.03;
  }

  const normalized = normalizeWrappedArray(payload);

  if (
    (endpoint === "company/enrich" || endpoint === "person/enrich") &&
    Array.isArray(normalized)
  ) {
    return endpoint === "company/enrich" ? normalized.length * 2 : normalized.length;
  }

  if (endpoint === "web/search/live") {
    return 1;
  }

  if (endpoint === "web/enrich/live" && Array.isArray(normalized)) {
    return normalized.length;
  }

  return 0;
}

async function readCachedJson<T>(filePath: string) {
  try {
    const contents = await readFile(filePath, "utf8");
    return JSON.parse(contents) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export class CrustdataClient {
  private readonly queue = new IntervalQueue();
  private readonly cacheRoot: string;

  constructor(cacheRoot = path.join(process.cwd(), ".cache")) {
    this.cacheRoot = cacheRoot;
  }

  async companySearch<T = unknown>(body: JsonValue, normalize?: (payload: unknown) => T) {
    return this.post("company/search", { body, normalize });
  }

  async companyEnrich<T = unknown>(body: JsonValue, normalize?: (payload: unknown) => T) {
    return this.post("company/enrich", {
      body,
      normalize: normalize ?? ((payload) => normalizeWrappedArray(payload) as T),
    });
  }

  async companyIdentify<T = unknown>(body: JsonValue, normalize?: (payload: unknown) => T) {
    return this.post("company/identify", {
      body,
      normalize: normalize ?? ((payload) => normalizeWrappedArray(payload) as T),
    });
  }

  async companyAutocomplete<T = unknown>(
    body: JsonValue,
    normalize?: (payload: unknown) => T,
  ) {
    // Autocomplete suggestions currently expose `value` only. Do not assume
    // per-suggestion document counts exist.
    return this.post("company/search/autocomplete", { body, normalize });
  }

  async personSearch<T = unknown>(body: JsonValue, normalize?: (payload: unknown) => T) {
    return this.post("person/search", { body, normalize });
  }

  async personEnrich<T = unknown>(body: JsonValue, normalize?: (payload: unknown) => T) {
    return this.post("person/enrich", {
      body,
      normalize: normalize ?? ((payload) => normalizeWrappedArray(payload) as T),
    });
  }

  async personAutocomplete<T = unknown>(
    body: JsonValue,
    normalize?: (payload: unknown) => T,
  ) {
    return this.post("person/search/autocomplete", { body, normalize });
  }

  async webSearch<T = unknown>(body: JsonValue, normalize?: (payload: unknown) => T) {
    return this.post("web/search/live", { body, normalize });
  }

  async webFetch<T = unknown>(body: JsonValue, normalize?: (payload: unknown) => T) {
    return this.post("web/enrich/live", {
      body,
      normalize: normalize ?? ((payload) => normalizeWrappedArray(payload) as T),
    });
  }

  private async post<T>(endpoint: EndpointKind, options: RequestOptions<T>) {
    const cacheFile = await this.getCacheFile(endpoint, options.body);

    if (options.useCache !== false) {
      const cached = await readCachedJson<{
        payload: T;
        usage: CreditUsage;
      }>(cacheFile);

      if (cached) {
        return {
          payload: cached.payload,
          usage: cached.usage,
          cached: true,
        };
      }
    }

    return this.queue.add(async () => {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${requireEnv("CRUSTDATA_API_KEY")}`,
          "Content-Type": "application/json",
          "x-api-version": API_VERSION,
        },
        body: JSON.stringify(options.body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Crustdata ${endpoint} failed: ${response.status} ${errorText}`);
      }

      const rawPayload = (await response.json()) as unknown;
      const payload = options.normalize
        ? options.normalize(rawPayload)
        : (rawPayload as T);
      const usage = {
        endpoint,
        estimatedCredits: estimateCredits(endpoint, rawPayload),
      };

      if (options.useCache !== false) {
        await mkdir(path.dirname(cacheFile), { recursive: true });
        await writeFile(
          cacheFile,
          JSON.stringify(
            {
              payload,
              usage,
              savedAt: new Date().toISOString(),
            },
            null,
            2,
          ),
          "utf8",
        );
      }

      return {
        payload,
        usage,
        cached: false,
      };
    });
  }

  private async getCacheFile(endpoint: EndpointKind, body: JsonValue) {
    const digest = createHash("sha256")
      .update(JSON.stringify({ endpoint, body }))
      .digest("hex");

    const cacheDirectory = path.join(this.cacheRoot, endpoint.replaceAll("/", "__"));
    await mkdir(cacheDirectory, { recursive: true });
    return path.join(cacheDirectory, `${digest}.json`);
  }
}

export const crustdataClient = new CrustdataClient();
