import RunClient from "./RunClient";

type SearchParams = Record<string, string | string[] | undefined>;

function pickString(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function pickNumber(value: string | string[] | undefined, fallback: number) {
  const raw = pickString(value, "");
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function RunPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const fundsRaw = pickString(params.funds, "yc,a16z,spc,founders-fund");
  const funds = fundsRaw.split(",").map((s) => s.trim()).filter(Boolean);
  const blockedGeos = pickString(params.blockedGeos, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const blockedSectors = pickString(params.blockedSectors, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const config = {
    fundsToMirror: funds,
    fundSize: pickNumber(params.fundSize, 500_000),
    targetPortfolioSize: pickNumber(params.targetPortfolioSize, 25),
    maxChequeSize: pickNumber(params.maxChequeSize, 25_000),
    blockedGeos,
    blockedSectors,
    minStage: (pickString(params.minStage, "pre_seed") as "pre_seed" | "seed" | "series_a"),
    maxStage: (pickString(params.maxStage, "series_a") as "pre_seed" | "seed" | "series_a"),
    demo: pickString(params.demo, "0") === "1",
  };

  return <RunClient config={config} />;
}
