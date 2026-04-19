import Link from "next/link";
import { ArrowRight, Database, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import KrabsMascot from "@/components/krabs/KrabsMascot";
import CrustyLogo from "@/components/krabs/CrustyLogo";
import OceanBubbles from "@/components/krabs/OceanBubbles";
import { FUNDS } from "@/lib/funds/registry";

const THESIS_CARDS = [
  {
    icon: TrendingUp,
    color: "var(--tomato)",
    title: "Follow the money, not the deck",
    body: "We ingest a16z, YC, SPC and Founders Fund's recent investments and extract the thesis signal — not the headline deal.",
  },
  {
    icon: Zap,
    color: "var(--yellow)",
    title: "Catch second movers early",
    body: "Crustdata surfaces comparable companies in the same thesis before the category gets crowded and expensive.",
  },
  {
    icon: Shield,
    color: "var(--avocado)",
    title: "Your filters, your sleep",
    body: "Block geographies, sectors and stages. Eugene K. only shows you deals that pass your gate.",
  },
];

const HOW_STEPS = [
  { n: "01", label: "Shadow funds", desc: "Pick a16z, YC, SPC, Founders Fund — Eugene tails their thesis." },
  { n: "02", label: "Configure capital", desc: "Fund size, bets, average cheque — Eugene does the math." },
  { n: "03", label: "Block filters", desc: "Geographies, sectors, anything Mr. Krabs doesn't touch." },
  { n: "04", label: "Build portfolio", desc: "Mirror runs live; second movers fill the pipeline." },
];

const MARQUEE_TOKENS = [
  "POWERED BY CRUSTDATA",
  "★",
  "SECOND-MOVER ARBITRAGE",
  "★",
  "POWER-LAW PORTFOLIOS",
  "★",
  "EUGENE K. · AI GP",
  "★",
  "BIKINI BOTTOM HQ",
  "★",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen sand-bg" data-testid="landing-page">
      {/* NAVBAR */}
      <nav className="w-full border-b-[2.5px] bg-parchment" style={{ borderColor: "var(--ink)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Home">
            <CrustyLogo />
          </Link>
          <div
            className="hidden md:flex items-center gap-6 font-mono"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(28,34,51,0.7)",
            }}
          >
            <a href="#thesis" className="hover:text-tomato transition-colors">Thesis</a>
            <a href="#how" className="hover:text-tomato transition-colors">How it works</a>
            <a href="#signals" className="hover:text-tomato transition-colors">Signals</a>
          </div>
          <Link href="/onboarding" className="kk-btn kk-btn-yellow">
            Launch onboarding
            <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>
        <div className="pattern-bar" />
      </nav>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-20">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div className="slide-up">
            <div className="inline-flex kk-chip kk-chip-avocado mb-6">
              <Sparkles size={14} strokeWidth={3} />
              AI-native venture fund · Fund I open
            </div>

            <h1
              className="font-display text-ink"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.3rem)", lineHeight: 0.98 }}
            >
              The AI GP that spots{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-tomato">second movers</span>
                <span
                  className="absolute inset-x-0 bottom-1 h-3 z-0 opacity-60"
                  style={{ background: "var(--yellow)" }}
                />
              </span>
              {" "}before they smell like money.
            </h1>

            <p
              className="mt-6 max-w-xl"
              style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "rgba(28,34,51,0.78)" }}
            >
              Meet <b style={{ color: "var(--ink)" }}>Eugene K.</b> — our AI General Partner. He doesn&apos;t
              chase a16z&apos;s next deal. He tails their{" "}
              <span className="font-mono text-tomato">thesis</span>, then hunts the second mover in
              the same category — cheaper, earlier, before the herd crowds in.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding" className="kk-btn">
                Start sourcing deals
                <ArrowRight size={18} strokeWidth={3} />
              </Link>
              <a href="#thesis" className="kk-btn kk-btn-ghost">
                Read the thesis
              </a>
            </div>

            <div
              className="mt-10 inline-flex items-center gap-3 px-4 py-2.5 bg-white"
              style={{
                border: "2.5px solid var(--ink)",
                borderRadius: 999,
                boxShadow: "4px 4px 0 0 var(--ink)",
              }}
            >
              <Database size={16} strokeWidth={3} className="text-aqua" />
              <span
                className="font-mono"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(28,34,51,0.7)",
                }}
              >
                Signal feed:
              </span>
              <span className="font-display" style={{ fontSize: "0.9rem", color: "var(--ink)" }}>
                Crustdata Company API
              </span>
              <span
                className="rounded-full bg-avocado animate-pulse"
                style={{ width: 6, height: 6 }}
              />
            </div>
          </div>

          {/* KRABS HERO PORTRAIT */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              className="relative ocean-bg rounded-[32px] p-6 w-full max-w-md"
              style={{ border: "2.5px solid var(--ink)", boxShadow: "10px 10px 0 0 var(--ink)" }}
            >
              <OceanBubbles count={12} />
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="absolute kk-chip kk-chip-yellow money-float"
                  style={{ top: 0, left: 0, transform: "translate(-8px, -28px) rotate(-8deg)" }}
                >
                  💰 ROI in sight
                </div>
                <KrabsMascot size={260} />
                <div className="krabs-shadow" />
                <div
                  className="mt-3 w-full bg-white rounded-2xl p-4 relative"
                  style={{ border: "2.5px solid var(--ink)" }}
                >
                  <div
                    className="font-mono text-tomato mb-1"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    Eugene K. · AI GP
                  </div>
                  <div className="font-display" style={{ fontSize: "0.95rem", lineHeight: 1.35 }}>
                    &ldquo;Arrr — I don&apos;t invest in the first mover. I invest in the cheaper
                    one right behind &apos;em.&rdquo;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust band - real backend funds */}
        <div className="mt-14 flex flex-wrap items-center gap-3">
          <span
            className="font-mono"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(28,34,51,0.6)",
            }}
          >
            Shadowing thesis from:
          </span>
          {FUNDS.map((f) => (
            <span key={f.id} className="kk-chip">
              {f.displayName}
            </span>
          ))}
        </div>
      </section>

      {/* THESIS */}
      <section
        id="thesis"
        className="relative ocean-bg py-20"
        style={{ borderTop: "2.5px solid var(--ink)", borderBottom: "2.5px solid var(--ink)" }}
      >
        <OceanBubbles count={22} seed={11} />
        <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex kk-chip kk-chip-yellow mb-5">
              <TrendingUp size={14} strokeWidth={3} />
              The thesis
            </div>
            <h2
              className="font-display text-white"
              style={{ fontSize: "clamp(1.9rem, 4.4vw, 3rem)", lineHeight: 1.04 }}
            >
              Venture returns follow a <span className="text-yellow-pepper">power law</span>.
              So we maximize the portfolio — minimize the bias.
            </h2>
            <p
              className="mt-6 max-w-2xl"
              style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}
            >
              A handful of outliers return entire funds. Real sourcing at scale is a full-time job
              that drowns most GPs. Crusty Crab flips the problem: the winning theses are already
              public — we just need the <i>second</i> name on the list, at a sane price.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {THESIS_CARDS.map((c, i) => (
              <div
                key={c.title}
                className="kk-panel p-6 slide-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div
                  className="inline-grid place-items-center mb-4"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    border: "2.5px solid var(--ink)",
                    background: c.color,
                    boxShadow: "3px 3px 0 0 var(--ink)",
                  }}
                >
                  <c.icon size={22} strokeWidth={3} className="text-ink" />
                </div>
                <h3 className="font-display text-ink" style={{ fontSize: "1.25rem", lineHeight: 1.25 }}>
                  {c.title}
                </h3>
                <p
                  className="mt-2"
                  style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "rgba(28,34,51,0.78)" }}
                >
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex kk-chip kk-chip-tomato mb-4">
                <Zap size={14} strokeWidth={3} />
                Four-step onboarding
              </div>
              <h2
                className="font-display text-ink max-w-2xl"
                style={{ fontSize: "clamp(1.9rem, 4.4vw, 3rem)", lineHeight: 1.04 }}
              >
                From empty portfolio to sourcing pipeline in under{" "}
                <span className="text-tomato">5 minutes</span>.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {HOW_STEPS.map((s, i) => (
              <div
                key={s.n}
                className="kk-panel p-5 plank-stripes slide-up relative overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="font-shade mb-2"
                  style={{ fontSize: "3rem", color: "var(--aqua)" }}
                >
                  {s.n}
                </div>
                <h3 className="font-display text-ink" style={{ fontSize: "1.05rem" }}>
                  {s.label}
                </h3>
                <p className="mt-1" style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "rgba(28,34,51,0.7)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section
        id="signals"
        className="relative bg-tomato overflow-hidden py-5"
        style={{ borderTop: "2.5px solid var(--ink)", borderBottom: "2.5px solid var(--ink)" }}
      >
        <div className="marquee-track">
          {[0, 1].map((j) => (
            <div key={j} className="flex items-center gap-8 px-8">
              {MARQUEE_TOKENS.map((t, i) => (
                <span
                  key={`${j}-${i}`}
                  className="font-display text-white whitespace-nowrap"
                  style={{ fontSize: "1.4rem" }}
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2
            className="font-display text-ink"
            style={{ fontSize: "clamp(1.9rem, 4.4vw, 3rem)", lineHeight: 1.04 }}
          >
            Ready to let Eugene K. do the sourcing?
          </h2>
          <p
            className="mt-5 max-w-xl mx-auto"
            style={{ fontSize: "1.05rem", color: "rgba(28,34,51,0.72)" }}
          >
            Four screens. No pitch decks. Just a portfolio-building machine that actually reads the
            market.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/onboarding" className="kk-btn">
              Open the onboarding
              <ArrowRight size={18} strokeWidth={3} />
            </Link>
            <Link href="/onboarding?demo=1" className="kk-btn kk-btn-aqua">
              Replay demo run
            </Link>
          </div>
          <div
            className="mt-10 flex items-center justify-center gap-2 font-mono"
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(28,34,51,0.5)",
            }}
          >
            <Database size={13} strokeWidth={3} />
            Signal layer: Crustdata · Thesis layer: a16z, YC, SPC, Founders Fund · GP layer: Eugene K.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="bg-ink text-white py-8"
        style={{ borderTop: "2.5px solid var(--ink)" }}
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="grid place-items-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "var(--tomato)",
                border: "2px solid #fff",
              }}
            >
              <span className="font-display text-white" style={{ fontSize: "0.7rem" }}>
                C
              </span>
            </div>
            <span className="font-display" style={{ fontSize: "0.85rem" }}>
              CRUSTY CRAB VENTURES
            </span>
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            © 2026 · Bikini Bottom HQ · Fund I
          </div>
        </div>
      </footer>
    </div>
  );
}
