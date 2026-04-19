"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Anchor,
  Ban,
  Building2,
  CheckCircle2,
  Coins,
  Compass,
  Edit3,
  Globe,
  Plus,
  Rocket,
  Target,
  TrendingUp,
  Wallet,
  X,
  Check,
} from "lucide-react";
import { FUNDS } from "@/lib/funds/registry";
import type { FundId } from "@/lib/funds/types";
import KrabsMascot from "@/components/krabs/KrabsMascot";
import StepHeader, { type OnboardingStep } from "@/components/krabs/StepHeader";

// ============================================================
// Types & state
// ============================================================

type CustomBlockKind = "geo" | "sector" | "stage" | "tag";
type CustomBlock = { value: string; kind: CustomBlockKind };

type CapitalState = {
  fundSize: number;
  numBets: number;
  chequeSize: number;
  chequeOverridden: boolean;
};

type BlocksState = {
  blockedGeos: string[];
  blockedSectors: string[];
  customBlocks: CustomBlock[];
};

type OnboardingState = {
  step: OnboardingStep;
  funds: FundId[];
  capital: CapitalState;
  blocks: BlocksState;
};

// ============================================================
// Static config for the UI
// ============================================================

const FUND_THEME: Record<
  FundId,
  { color: string; icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; tagline: string; thesis: string }
> = {
  a16z: {
    color: "var(--tomato)",
    icon: Building2,
    tagline: "Andreessen Horowitz",
    thesis: "AI infra · fintech rails · defense tech · creator economy",
  },
  yc: {
    color: "var(--yellow)",
    icon: Rocket,
    tagline: "Y Combinator (latest batches)",
    thesis: "Vertical AI agents · dev tools · SMB automation · health ops",
  },
  spc: {
    color: "var(--avocado)",
    icon: Compass,
    tagline: "South Park Commons fellowship",
    thesis: "Pre-idea founders · platform shifts · technical wedges",
  },
  "founders-fund": {
    color: "var(--aqua)",
    icon: Anchor,
    tagline: "Founders Fund",
    thesis: "Hard tech · defense · biotech · zero-to-one bets",
  },
  khosla: {
    color: "var(--tomato-deep)",
    icon: TrendingUp,
    tagline: "Khosla Ventures",
    thesis: "Climate · energy · health · long-cycle deep tech",
  },
};

const DEFAULT_GEOS = ["Russia", "Iran", "China"];
const DEFAULT_SECTORS = ["Gambling", "Crypto", "Defense", "Tobacco"];
const ALL_GEO_SUGGESTIONS = ["North Korea", "Belarus", "Myanmar", "Venezuela", "Syria"];
const ALL_SECTOR_SUGGESTIONS = [
  "Adult content",
  "Vapes",
  "Firearms",
  "Fossil fuels",
  "Payday lending",
  "Surveillance",
];

const FUND_LABELS: Record<FundId, string> = Object.fromEntries(
  FUNDS.map((f) => [f.id, f.displayName] as const),
) as Record<FundId, string>;

const INITIAL_STATE: OnboardingState = {
  step: "funds",
  funds: ["a16z", "yc", "spc", "founders-fund"],
  capital: {
    fundSize: 10_000_000,
    numBets: 40,
    chequeSize: 250_000,
    chequeOverridden: false,
  },
  blocks: {
    blockedGeos: [...DEFAULT_GEOS],
    blockedSectors: [...DEFAULT_SECTORS],
    customBlocks: [],
  },
};

// ============================================================
// Money formatter
// ============================================================
function fmtUSD(n: number) {
  if (!Number.isFinite(n) || n <= 0) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ============================================================
// Root
// ============================================================

export default function OnboardingFlow({ demo = false }: { demo?: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);

  const go = (step: OnboardingStep) => setState((s) => ({ ...s, step }));
  const exit = () => router.push("/");

  const handleConfirm = () => {
    setSubmitting(true);

    const customGeos = state.blocks.customBlocks
      .filter((c) => c.kind === "geo")
      .map((c) => c.value);
    const customSectors = state.blocks.customBlocks
      .filter((c) => c.kind === "sector")
      .map((c) => c.value);

    const blockedGeos = Array.from(new Set([...state.blocks.blockedGeos, ...customGeos]));
    const blockedSectors = Array.from(
      new Set([...state.blocks.blockedSectors, ...customSectors]),
    );

    const effectiveCheque = state.capital.chequeOverridden
      ? state.capital.chequeSize
      : Math.max(1, Math.round(state.capital.fundSize / Math.max(1, state.capital.numBets)));

    const params = new URLSearchParams({
      funds: state.funds.join(","),
      fundSize: String(Math.max(1, Math.round(state.capital.fundSize))),
      targetPortfolioSize: String(Math.max(1, Math.round(state.capital.numBets))),
      maxChequeSize: String(Math.max(1000, Math.round(effectiveCheque))),
      blockedGeos: blockedGeos.join(","),
      blockedSectors: blockedSectors.join(","),
      minStage: "pre_seed",
      maxStage: "series_a",
      demo: demo ? "1" : "0",
    });

    router.push(`/run?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-parchment">
      <StepHeader current={state.step} onExit={exit} />

      {state.step === "funds" && (
        <FundFilterScreen
          selected={state.funds}
          onChange={(funds) => setState((s) => ({ ...s, funds }))}
          onNext={() => go("capital")}
          onBack={exit}
        />
      )}

      {state.step === "capital" && (
        <CapitalScreen
          state={state.capital}
          onChange={(capital) => setState((s) => ({ ...s, capital }))}
          onNext={() => go("blocks")}
          onBack={() => go("funds")}
        />
      )}

      {state.step === "blocks" && (
        <BlocksScreen
          state={state.blocks}
          onChange={(blocks) => setState((s) => ({ ...s, blocks }))}
          onNext={() => go("review")}
          onBack={() => go("capital")}
        />
      )}

      {state.step === "review" && (
        <ReviewScreen
          state={state}
          onEdit={(step) => go(step)}
          onBack={() => go("blocks")}
          onConfirm={handleConfirm}
          submitting={submitting}
          demo={demo}
        />
      )}
    </div>
  );
}

// ============================================================
// Step 1 — Fund filter
// ============================================================
function FundFilterScreen({
  selected,
  onChange,
  onNext,
  onBack,
}: {
  selected: FundId[];
  onChange: (funds: FundId[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const toggle = (id: FundId) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  const coverage = Math.min(100, 20 + selected.length * 18);

  return (
    <main className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-start mb-10">
        <div className="slide-up">
          <div
            className="font-mono text-tomato mb-3"
            style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
          >
            Step 01 / 04 — Shadow funds
          </div>
          <h1
            className="font-display text-ink max-w-3xl"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.04 }}
          >
            Which funds should Eugene K. tail for thesis signal?
          </h1>
          <p
            className="mt-4 max-w-2xl"
            style={{ fontSize: "1rem", color: "rgba(28,34,51,0.7)", lineHeight: 1.5 }}
          >
            Pick any combination. We&apos;ll extract their thesis patterns and hunt the second
            mover in the same category — at a fraction of the valuation.
          </p>
        </div>
        <div className="hidden md:block">
          <KrabsMascot size={140} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {FUNDS.map((fund, i) => {
          const theme = FUND_THEME[fund.id];
          const Icon = theme?.icon ?? Building2;
          const isSel = selected.includes(fund.id);
          return (
            <button
              key={fund.id}
              type="button"
              onClick={() => toggle(fund.id)}
              className={`kk-card selectable slide-up ${isSel ? "kk-selected" : ""}`}
              aria-pressed={isSel}
              style={{
                animationDelay: `${i * 60}ms`,
                padding: "1.25rem",
                textAlign: "left",
                font: "inherit",
                color: "inherit",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid place-items-center flex-shrink-0"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        border: "2.5px solid var(--ink)",
                        background: theme?.color ?? "var(--aqua)",
                        boxShadow: "3px 3px 0 0 var(--ink)",
                      }}
                    >
                      <Icon size={20} strokeWidth={3} className="text-ink" />
                    </div>
                    <div>
                      <div
                        className="font-mono"
                        style={{
                          fontSize: "0.65rem",
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "rgba(28,34,51,0.55)",
                        }}
                      >
                        Rolling 6mo · {fund.siteDomain}
                      </div>
                      <div className="font-display text-ink" style={{ fontSize: "1.2rem", lineHeight: 1.15 }}>
                        {fund.displayName}
                      </div>
                    </div>
                  </div>
                  <div
                    className="grid place-items-center flex-shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: "2.5px solid var(--ink)",
                      background: isSel ? "var(--avocado)" : "#fff",
                      boxShadow: "2px 2px 0 0 var(--ink)",
                      transition: "background 140ms ease",
                    }}
                  >
                    {isSel && <Check size={18} strokeWidth={4} color="#fff" />}
                  </div>
                </div>
                <p
                  className="mt-4"
                  style={{ fontSize: "0.88rem", color: "rgba(28,34,51,0.78)", lineHeight: 1.55 }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(28,34,51,0.5)",
                      marginRight: "0.4rem",
                    }}
                  >
                    Thesis:
                  </span>
                  {theme?.thesis ?? "Thesis-driven sourcing"}
                </p>
                <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                  <span className="kk-chip kk-chip-aqua">
                    {fund.aliases.length} alias{fund.aliases.length === 1 ? "" : "es"} · 6-month funding window
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(28,34,51,0.5)",
                    }}
                  >
                    {isSel ? "Shadowing ✓" : "Tap to shadow"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="kk-panel p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(28,34,51,0.55)",
            }}
          >
            Shadowing {selected.length} fund{selected.length === 1 ? "" : "s"}
          </div>
          <div className="font-display text-ink" style={{ fontSize: "1.1rem" }}>
            {selected.length === 0
              ? "Select at least one fund to continue."
              : `Signal coverage: ${coverage}%`}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="kk-btn kk-btn-ghost" type="button">
            <ArrowLeft size={16} strokeWidth={3} />
            Back
          </button>
          <button onClick={onNext} disabled={selected.length === 0} className="kk-btn" type="button">
            Configure capital
            <ArrowRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// Step 2 — Capital
// ============================================================
function CapitalScreen({
  state,
  onChange,
  onNext,
  onBack,
}: {
  state: CapitalState;
  onChange: (capital: CapitalState) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { fundSize, numBets, chequeSize, chequeOverridden } = state;

  const derivedCheque = useMemo(() => {
    if (numBets <= 0) return 0;
    return Math.round(fundSize / numBets);
  }, [fundSize, numBets]);

  const effectiveCheque = chequeOverridden ? chequeSize : derivedCheque;
  const totalDeployed = effectiveCheque * numBets;
  const deploymentRatio = fundSize > 0 ? Math.min(100, (totalDeployed / fundSize) * 100) : 0;

  const setFundSize = (v: number) =>
    onChange({
      ...state,
      fundSize: v,
      chequeSize: chequeOverridden ? state.chequeSize : Math.round(v / Math.max(1, numBets)),
    });
  const setNumBets = (v: number) =>
    onChange({
      ...state,
      numBets: v,
      chequeSize: chequeOverridden ? state.chequeSize : Math.round(fundSize / Math.max(1, v)),
    });
  const setCheque = (v: number) =>
    onChange({ ...state, chequeSize: v, chequeOverridden: true });
  const resetCheque = () =>
    onChange({ ...state, chequeSize: derivedCheque, chequeOverridden: false });

  const ratioTone =
    deploymentRatio > 100 ? "kk-chip-tomato" : deploymentRatio > 95 ? "kk-chip-yellow" : "kk-chip-avocado";

  return (
    <main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="mb-10 slide-up">
        <div
          className="font-mono text-tomato mb-3"
          style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          Step 02 / 04 — Configure capital
        </div>
        <h1
          className="font-display text-ink max-w-3xl"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.04 }}
        >
          How much powder, how many bets, what size cheque?
        </h1>
        <p
          className="mt-4 max-w-2xl"
          style={{ fontSize: "1rem", color: "rgba(28,34,51,0.7)", lineHeight: 1.5 }}
        >
          Eugene K. uses this to size the portfolio against the power law. More bets = more
          lottery tickets. Cheque size is also the per-investment cap our allocator enforces.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <CapitalCard
          icon={Wallet}
          tint="var(--avocado)"
          kicker="Total fund"
          headline={fmtUSD(fundSize)}
        >
          <input
            type="range"
            min={1_000_000}
            max={100_000_000}
            step={500_000}
            value={fundSize}
            onChange={(e) => setFundSize(Number(e.target.value))}
            className="kk-slider"
          />
          <RangeFooter left="$1M" right="$100M" />
        </CapitalCard>

        <CapitalCard
          icon={Target}
          tint="var(--tomato)"
          kicker="Number of bets"
          headline={String(numBets)}
        >
          <input
            type="range"
            min={5}
            max={200}
            step={1}
            value={numBets}
            onChange={(e) => setNumBets(Number(e.target.value))}
            className="kk-slider"
          />
          <RangeFooter left="5" right="200" />
        </CapitalCard>

        <CapitalCard
          icon={Coins}
          tint="var(--yellow)"
          tintFg="var(--ink)"
          kicker="Cheque cap (per company)"
          headline={fmtUSD(effectiveCheque)}
          subtext={chequeOverridden ? "Override active" : "Auto-sized (fund ÷ bets)"}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={effectiveCheque}
              onChange={(e) => setCheque(Number(e.target.value))}
              className="kk-input"
              min={10_000}
              step={10_000}
            />
            {chequeOverridden && (
              <button
                onClick={resetCheque}
                className="kk-chip kk-chip-yellow"
                type="button"
                style={{ cursor: "pointer" }}
              >
                Reset
              </button>
            )}
          </div>
        </CapitalCard>
      </div>

      <div className="kk-panel p-6 mb-8 slide-up" style={{ animationDelay: "200ms" }}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(28,34,51,0.55)",
              }}
            >
              Deployment forecast
            </div>
            <div className="font-display text-ink" style={{ fontSize: "1.5rem", marginTop: "0.25rem" }}>
              {fmtUSD(totalDeployed)} / {fmtUSD(fundSize)}
            </div>
          </div>
          <div className={`kk-chip ${ratioTone}`}>
            {deploymentRatio > 100
              ? `${deploymentRatio.toFixed(0)}% — exceeds fund size`
              : `${deploymentRatio.toFixed(0)}% deployed`}
          </div>
        </div>

        <div
          className="w-full overflow-hidden"
          style={{
            height: "1.25rem",
            border: "2.5px solid var(--ink)",
            borderRadius: 999,
            background: "#fff",
            boxShadow: "3px 3px 0 0 var(--ink)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, deploymentRatio)}%`,
              background: deploymentRatio > 100 ? "var(--tomato)" : "var(--avocado)",
              transition: "width 200ms ease",
            }}
          />
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <Stat label="Per cheque" value={fmtUSD(effectiveCheque)} />
          <Stat label="Total bets" value={String(numBets)} />
          <Stat
            label="Reserve"
            value={
              fundSize - totalDeployed >= 0
                ? fmtUSD(fundSize - totalDeployed)
                : `−${fmtUSD(totalDeployed - fundSize)}`
            }
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <button onClick={onBack} className="kk-btn kk-btn-ghost" type="button">
          <ArrowLeft size={16} strokeWidth={3} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={fundSize <= 0 || numBets <= 0 || effectiveCheque <= 0}
          className="kk-btn"
          type="button"
        >
          Set block filters
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </main>
  );
}

function CapitalCard({
  icon: Icon,
  tint,
  tintFg = "#fff",
  kicker,
  headline,
  subtext,
  children,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  tint: string;
  tintFg?: string;
  kicker: string;
  headline: string;
  subtext?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="kk-panel p-6 slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="grid place-items-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "2.5px solid var(--ink)",
            background: tint,
            boxShadow: "3px 3px 0 0 var(--ink)",
          }}
        >
          <Icon size={20} strokeWidth={3} color={tintFg} />
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(28,34,51,0.55)",
          }}
        >
          {kicker}
        </div>
      </div>
      <div className="font-display text-ink mb-2" style={{ fontSize: "2.4rem", lineHeight: 1 }}>
        {headline}
      </div>
      {subtext && (
        <div
          className="font-mono mb-3"
          style={{ fontSize: "0.7rem", color: "rgba(28,34,51,0.55)" }}
        >
          {subtext}
        </div>
      )}
      {children}
    </div>
  );
}

function RangeFooter({ left, right }: { left: string; right: string }) {
  return (
    <div
      className="flex justify-between font-mono mt-2"
      style={{
        fontSize: "0.62rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(28,34,51,0.5)",
      }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--parchment)",
        border: "2.5px solid var(--ink)",
        borderRadius: 12,
        padding: "0.7rem 0.9rem",
        boxShadow: "3px 3px 0 0 var(--ink)",
      }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(28,34,51,0.55)",
        }}
      >
        {label}
      </div>
      <div className="font-display text-ink" style={{ fontSize: "1.05rem", marginTop: "0.15rem" }}>
        {value}
      </div>
    </div>
  );
}

// ============================================================
// Step 3 — Blocks
// ============================================================
function BlocksScreen({
  state,
  onChange,
  onNext,
  onBack,
}: {
  state: BlocksState;
  onChange: (blocks: BlocksState) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const { blockedGeos, blockedSectors, customBlocks } = state;
  const [customInput, setCustomInput] = useState("");
  const [customKind, setCustomKind] = useState<CustomBlockKind>("sector");

  const toggleGeo = (g: string) =>
    onChange({
      ...state,
      blockedGeos: blockedGeos.includes(g)
        ? blockedGeos.filter((x) => x !== g)
        : [...blockedGeos, g],
    });
  const toggleSector = (s: string) =>
    onChange({
      ...state,
      blockedSectors: blockedSectors.includes(s)
        ? blockedSectors.filter((x) => x !== s)
        : [...blockedSectors, s],
    });

  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    if (customBlocks.some((c) => c.value.toLowerCase() === val.toLowerCase())) return;
    onChange({ ...state, customBlocks: [...customBlocks, { value: val, kind: customKind }] });
    setCustomInput("");
  };
  const removeCustom = (val: string) =>
    onChange({ ...state, customBlocks: customBlocks.filter((c) => c.value !== val) });

  const geoSuggestions = ALL_GEO_SUGGESTIONS.filter((g) => !blockedGeos.includes(g));
  const sectorSuggestions = ALL_SECTOR_SUGGESTIONS.filter((s) => !blockedSectors.includes(s));

  return (
    <main className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="mb-10 slide-up">
        <div
          className="font-mono text-tomato mb-3"
          style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
        >
          Step 03 / 04 — Block filters
        </div>
        <h1
          className="font-display text-ink max-w-3xl"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.04 }}
        >
          What shouldn&apos;t Mr. Krabs touch with a ten-foot pincer?
        </h1>
        <p
          className="mt-4 max-w-2xl"
          style={{ fontSize: "1rem", color: "rgba(28,34,51,0.7)", lineHeight: 1.5 }}
        >
          Any company matching these blocks is removed from sourcing, no matter how hot the thesis.
          Geography &amp; sector blocks are honored by the backend pipeline; custom keyword/stage
          blocks are stored for the dossier rationale.
        </p>
      </div>

      <BlockPanel
        accent="var(--aqua)"
        icon={Globe}
        kicker="Blocked geographies"
        headline="Where we won't deploy"
      >
        <ChipRow
          items={[...DEFAULT_GEOS, ...blockedGeos.filter((g) => !DEFAULT_GEOS.includes(g))]}
          isActive={(g) => blockedGeos.includes(g)}
          onToggle={toggleGeo}
        />
        {geoSuggestions.length > 0 && (
          <SuggestionRow items={geoSuggestions} onAdd={toggleGeo} />
        )}
      </BlockPanel>

      <BlockPanel
        accent="var(--tomato)"
        icon={Ban}
        kicker="Blocked sectors"
        headline="Categories we skip"
      >
        <ChipRow
          items={[...DEFAULT_SECTORS, ...blockedSectors.filter((s) => !DEFAULT_SECTORS.includes(s))]}
          isActive={(s) => blockedSectors.includes(s)}
          onToggle={toggleSector}
        />
        {sectorSuggestions.length > 0 && (
          <SuggestionRow items={sectorSuggestions} onAdd={toggleSector} />
        )}
      </BlockPanel>

      <BlockPanel
        accent="var(--yellow)"
        accentFg="var(--ink)"
        icon={Plus}
        kicker="Your custom blocks"
        headline="Anything else off-limits?"
      >
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <select
            value={customKind}
            onChange={(e) => setCustomKind(e.target.value as CustomBlockKind)}
            className="kk-input"
            style={{ maxWidth: 160 }}
          >
            <option value="sector">Sector</option>
            <option value="geo">Geography</option>
            <option value="stage">Stage</option>
            <option value="tag">Keyword</option>
          </select>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
            placeholder="e.g. Pre-seed bootstrapped, Latam only, etc."
            className="kk-input"
            style={{ flex: 1 }}
          />
          <button onClick={addCustom} className="kk-btn kk-btn-avocado" type="button">
            <Plus size={16} strokeWidth={3} />
            Add block
          </button>
        </div>

        {customBlocks.length === 0 ? (
          <p
            className="font-mono italic"
            style={{ fontSize: "0.78rem", color: "rgba(28,34,51,0.5)" }}
          >
            No custom blocks yet. Mr. Krabs is holding his pincers loose.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {customBlocks.map((c) => (
              <span key={c.value} className="kk-chip kk-chip-tomato">
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.55rem",
                    textTransform: "uppercase",
                    opacity: 0.85,
                    marginRight: "0.2rem",
                  }}
                >
                  {c.kind}
                </span>
                {c.value}
                <button
                  onClick={() => removeCustom(c.value)}
                  className="ml-1 hover:scale-110 transition-transform"
                  aria-label={`Remove ${c.value}`}
                  style={{ background: "transparent", border: 0, color: "inherit", cursor: "pointer" }}
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </span>
            ))}
          </div>
        )}
      </BlockPanel>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-2">
        <button onClick={onBack} className="kk-btn kk-btn-ghost" type="button">
          <ArrowLeft size={16} strokeWidth={3} />
          Back
        </button>
        <button onClick={onNext} className="kk-btn" type="button">
          Review everything
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </main>
  );
}

function BlockPanel({
  accent,
  accentFg = "#fff",
  icon: Icon,
  kicker,
  headline,
  children,
}: {
  accent: string;
  accentFg?: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  kicker: string;
  headline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="kk-panel p-6 mb-6 slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="grid place-items-center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "2.5px solid var(--ink)",
            background: accent,
            boxShadow: "3px 3px 0 0 var(--ink)",
          }}
        >
          <Icon size={20} strokeWidth={3} color={accentFg} />
        </div>
        <div>
          <div
            className="font-mono"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(28,34,51,0.55)",
            }}
          >
            {kicker}
          </div>
          <div className="font-display text-ink" style={{ fontSize: "1.2rem" }}>
            {headline}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function ChipRow({
  items,
  isActive,
  onToggle,
}: {
  items: string[];
  isActive: (item: string) => boolean;
  onToggle: (item: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((item) => {
        const active = isActive(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`kk-chip ${active ? "kk-chip-tomato" : ""}`}
            style={{ cursor: "pointer" }}
          >
            {active ? <Ban size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
            {item}
          </button>
        );
      })}
    </div>
  );
}

function SuggestionRow({ items, onAdd }: { items: string[]; onAdd: (item: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="font-mono mr-1"
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(28,34,51,0.5)",
        }}
      >
        Add:
      </span>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onAdd(item)}
          className="kk-chip"
          style={{ cursor: "pointer" }}
        >
          <Plus size={12} strokeWidth={3} />
          {item}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// Step 4 — Review
// ============================================================
function ReviewScreen({
  state,
  onEdit,
  onBack,
  onConfirm,
  submitting,
  demo,
}: {
  state: OnboardingState;
  onEdit: (step: OnboardingStep) => void;
  onBack: () => void;
  onConfirm: () => void;
  submitting: boolean;
  demo: boolean;
}) {
  const { funds, capital, blocks } = state;
  const totalDeployed =
    (capital.chequeOverridden
      ? capital.chequeSize
      : Math.round(capital.fundSize / Math.max(1, capital.numBets))) * capital.numBets;

  return (
    <main className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-start mb-10">
        <div className="slide-up">
          <div
            className="font-mono text-tomato mb-3"
            style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
          >
            Step 04 / 04 — Review
          </div>
          <h1
            className="font-display text-ink max-w-3xl"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.04 }}
          >
            One last look before Eugene K. drops the anchor.
          </h1>
          <p
            className="mt-4 max-w-2xl"
            style={{ fontSize: "1rem", color: "rgba(28,34,51,0.7)", lineHeight: 1.5 }}
          >
            Hit the button and we&apos;ll spin up a live mirror run — Crustdata fetches, thesis
            extraction, counterpart hunting, founder synth. You&apos;ll watch every event stream in.
          </p>
        </div>
        <div className="hidden md:block">
          <KrabsMascot size={140} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <ReviewCard
          accent="var(--aqua)"
          icon={Building2}
          kicker="Shadowing"
          title={`${funds.length} fund${funds.length === 1 ? "" : "s"}`}
          onEdit={() => onEdit("funds")}
        >
          {funds.length === 0 ? (
            <p style={{ color: "rgba(28,34,51,0.6)", fontStyle: "italic", fontSize: "0.9rem" }}>
              No funds selected yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {funds.map((f) => (
                <span key={f} className="kk-chip kk-chip-aqua">
                  {FUND_LABELS[f] ?? f}
                </span>
              ))}
            </div>
          )}
        </ReviewCard>

        <ReviewCard
          accent="var(--avocado)"
          icon={Wallet}
          kicker="Capital"
          title={`${fmtUSD(capital.fundSize)} fund`}
          onEdit={() => onEdit("capital")}
        >
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Bets" value={String(capital.numBets)} />
            <MiniStat
              label="Cheque cap"
              value={fmtUSD(
                capital.chequeOverridden
                  ? capital.chequeSize
                  : Math.round(capital.fundSize / Math.max(1, capital.numBets)),
              )}
            />
            <MiniStat label="Deployed" value={fmtUSD(totalDeployed)} />
          </div>
        </ReviewCard>

        <ReviewCard
          accent="var(--tomato)"
          icon={Globe}
          kicker="Blocked geographies"
          title={`${blocks.blockedGeos.length} region${blocks.blockedGeos.length === 1 ? "" : "s"}`}
          onEdit={() => onEdit("blocks")}
        >
          <div className="flex flex-wrap gap-2">
            {blocks.blockedGeos.map((g) => (
              <span key={g} className="kk-chip kk-chip-tomato">
                <Ban size={10} strokeWidth={3} />
                {g}
              </span>
            ))}
          </div>
        </ReviewCard>

        <ReviewCard
          accent="var(--yellow)"
          accentFg="var(--ink)"
          icon={Ban}
          kicker="Blocked sectors + custom"
          title={`${blocks.blockedSectors.length + blocks.customBlocks.length} filter${
            blocks.blockedSectors.length + blocks.customBlocks.length === 1 ? "" : "s"
          }`}
          onEdit={() => onEdit("blocks")}
        >
          <div className="flex flex-wrap gap-2">
            {blocks.blockedSectors.map((s) => (
              <span key={s} className="kk-chip kk-chip-tomato">
                <Ban size={10} strokeWidth={3} />
                {s}
              </span>
            ))}
            {blocks.customBlocks.map((c) => (
              <span key={c.value} className="kk-chip kk-chip-avocado">
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.55rem",
                    textTransform: "uppercase",
                    opacity: 0.85,
                    marginRight: "0.2rem",
                  }}
                >
                  {c.kind}
                </span>
                {c.value}
              </span>
            ))}
          </div>
        </ReviewCard>
      </div>

      <div className="kk-panel p-6 plank-stripes flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div
            className="font-mono text-tomato mb-1"
            style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}
          >
            Next stop: live mirror run
          </div>
          <div className="font-display text-ink" style={{ fontSize: "1.25rem" }}>
            {demo
              ? "We'll replay a captured run so you can see the full pipeline in seconds."
              : "Eugene K. will pull matching second movers from Crustdata and score them against your thesis signal."}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={onBack} className="kk-btn kk-btn-ghost" type="button">
            <ArrowLeft size={16} strokeWidth={3} />
            Back
          </button>
          <button
            onClick={onConfirm}
            disabled={funds.length === 0 || submitting}
            className="kk-btn"
            type="button"
          >
            {submitting ? (
              <>
                Launching…
                <CheckCircle2 size={18} strokeWidth={3} />
              </>
            ) : (
              <>
                Build my portfolio
                <Rocket size={18} strokeWidth={3} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

function ReviewCard({
  icon: Icon,
  accent,
  accentFg = "#fff",
  kicker,
  title,
  onEdit,
  children,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  accent: string;
  accentFg?: string;
  kicker: string;
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="kk-panel p-5 slide-up">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="grid place-items-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "2.5px solid var(--ink)",
              background: accent,
              boxShadow: "3px 3px 0 0 var(--ink)",
            }}
          >
            <Icon size={20} strokeWidth={3} color={accentFg} />
          </div>
          <div>
            <div
              className="font-mono"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(28,34,51,0.55)",
              }}
            >
              {kicker}
            </div>
            <div className="font-display text-ink" style={{ fontSize: "1.1rem" }}>
              {title}
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="kk-chip"
          aria-label="Edit"
          type="button"
          style={{ cursor: "pointer" }}
        >
          <Edit3 size={11} strokeWidth={3} />
          Edit
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--parchment)",
        border: "2.5px solid var(--ink)",
        borderRadius: 10,
        padding: "0.55rem 0.7rem",
        boxShadow: "2px 2px 0 0 var(--ink)",
      }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(28,34,51,0.55)",
        }}
      >
        {label}
      </div>
      <div className="font-display text-ink" style={{ fontSize: "0.95rem" }}>
        {value}
      </div>
    </div>
  );
}
