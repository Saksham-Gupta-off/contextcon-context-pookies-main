import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FundId } from "@/lib/funds/types";
import { cacheSubdir } from "@/lib/cachePaths";

const CACHE_ROOT = cacheSubdir("funds");
const KEYWORD_CACHE_PATH = path.join(CACHE_ROOT, "keyword-resolutions.json");

export type FundRuntimeCache = {
  resolvedInvestorNames?: string[];
  updatedAt?: string;
};

async function ensureFundCacheRoot() {
  await mkdir(CACHE_ROOT, { recursive: true });
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
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

async function writeJsonFile(filePath: string, value: unknown) {
  await ensureFundCacheRoot();
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

function fundCachePath(fundId: FundId) {
  return path.join(CACHE_ROOT, `${fundId}.json`);
}

export async function readFundRuntimeCache(fundId: FundId) {
  return readJsonFile<FundRuntimeCache>(fundCachePath(fundId));
}

export async function writeFundRuntimeCache(
  fundId: FundId,
  patch: Partial<FundRuntimeCache>,
) {
  const current = (await readFundRuntimeCache(fundId)) ?? {};
  const nextValue = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  } satisfies FundRuntimeCache;

  await writeJsonFile(fundCachePath(fundId), nextValue);
  return nextValue;
}

export type KeywordResolutionCache = Record<string, string>;

export async function readKeywordResolutionCache() {
  return (await readJsonFile<KeywordResolutionCache>(KEYWORD_CACHE_PATH)) ?? {};
}

export async function writeKeywordResolution(
  keyword: string,
  industry: string,
) {
  const current = await readKeywordResolutionCache();
  const normalizedKeyword = keyword.trim().toLowerCase();
  const nextValue = {
    ...current,
    [normalizedKeyword]: industry,
  };

  await writeJsonFile(KEYWORD_CACHE_PATH, nextValue);
  return nextValue;
}
