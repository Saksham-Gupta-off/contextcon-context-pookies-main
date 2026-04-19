import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  ApiCallSnapshot,
  CompanyFounderScore,
  CounterpartCompany,
  DealThesis,
  FounderProfile,
  MirroredDeal,
  PortfolioEntry,
  PortfolioSummary,
  ReasoningEntry,
  RiskFlag,
  RunRecord,
  TractionScore,
} from "../lib/pipeline/types";

const OUT = path.join(process.cwd(), "lib", "fixtures", "demo-run.json");

const deals: MirroredDeal[] = [
  {
    crustdataCompanyId: 101,
    name: "Stitch AI",
    primaryDomain: "stitch.ai",
    fundingDate: "2026-03-04",
    roundType: "series_a",
    roundAmountUsd: 22_000_000,
    totalInvestmentUsd: 28_000_000,
    investors: ["Andreessen Horowitz", "Lux Capital", "Sequoia Capital"],
    headcountTotal: 38,
    hqCountry: "United States",
    hqCity: "San Francisco",
    industries: ["AI", "Developer Tools", "Infrastructure"],
    description:
      "Open-core agentic eval platform that lets engineering teams diff LLM behavior across model versions in CI.",
    yearFounded: "2024",
    source: "structured",
    fundId: "a16z",
  },
  {
    crustdataCompanyId: 102,
    name: "Helix Bio",
    primaryDomain: "helixbio.com",
    fundingDate: "2026-02-19",
    roundType: "series_a",
    roundAmountUsd: 35_000_000,
    totalInvestmentUsd: 41_000_000,
    investors: ["Founders Fund", "Khosla Ventures", "ARCH Venture Partners"],
    headcountTotal: 51,
    hqCountry: "United States",
    hqCity: "San Francisco",
    industries: ["Biotech", "AI", "Synthetic Biology"],
    description:
      "Generative protein design platform for antibody discovery, training a foundation model on cryo-EM data.",
    yearFounded: "2023",
    source: "structured",
    fundId: "founders-fund",
  },
  {
    crustdataCompanyId: 103,
    name: "Tessera Robotics",
    primaryDomain: "tesserarobots.com",
    fundingDate: "2026-01-29",
    roundType: "seed",
    roundAmountUsd: 9_500_000,
    totalInvestmentUsd: 9_500_000,
    investors: ["South Park Commons", "Lux Capital"],
    headcountTotal: 14,
    hqCountry: "United States",
    hqCity: "San Francisco",
    industries: ["Robotics", "AI", "Manufacturing"],
    description:
      "Bimanual manipulation robots for SMB manufacturing — software-first stack with rapid teach-by-demo.",
    yearFounded: "2024",
    source: "structured",
    fundId: "spc",
  },
  {
    crustdataCompanyId: 104,
    name: "PorterRoad",
    primaryDomain: "porterroad.com",
    fundingDate: "2026-03-15",
    roundType: "seed",
    roundAmountUsd: 4_200_000,
    totalInvestmentUsd: 4_200_000,
    investors: ["Y Combinator", "Soma Capital", "General Catalyst"],
    headcountTotal: 6,
    hqCountry: "United States",
    hqCity: "Brooklyn",
    industries: ["Climate", "Logistics", "B2B"],
    description:
      "Software for the cold-chain trucking long tail — broker-neutral telematics + load matching.",
    yearFounded: "2025",
    source: "structured",
    fundId: "yc",
  },
  {
    crustdataCompanyId: 105,
    name: "Morwenna",
    primaryDomain: "morwenna.energy",
    fundingDate: "2026-02-02",
    roundType: "series_a",
    roundAmountUsd: 18_000_000,
    totalInvestmentUsd: 22_500_000,
    investors: ["Founders Fund", "Lowercarbon Capital"],
    headcountTotal: 24,
    hqCountry: "United Kingdom",
    hqCity: "Bristol",
    industries: ["Climate", "Energy", "Marine"],
    description:
      "Tidal stream power generators built from rotating-mass turbines, targeting 24/7 baseload behind the meter.",
    yearFounded: "2022",
    source: "structured",
    fundId: "founders-fund",
  },
  {
    crustdataCompanyId: 106,
    name: "Kindly Labs",
    primaryDomain: "kindly.health",
    fundingDate: "2026-03-20",
    roundType: "seed",
    roundAmountUsd: 6_800_000,
    totalInvestmentUsd: 6_800_000,
    investors: ["Y Combinator", "Khosla Ventures"],
    headcountTotal: 9,
    hqCountry: "United States",
    hqCity: "New York",
    industries: ["Healthcare", "AI", "Mental Health"],
    description:
      "Voice-first agent for behavioral-health intake calls — replaces front-desk triage at outpatient clinics.",
    yearFounded: "2025",
    source: "structured",
    fundId: "yc",
  },
];

const theses: DealThesis[] = [
  {
    crustdataCompanyId: 101,
    thesisOneLiner: "LLM apps are software, and software needs CI.",
    beliefStatement:
      "As model upgrades become the dominant source of regressions, eval-as-code in CI becomes a non-negotiable layer of the LLM dev stack — owned by infra, not data science.",
    marketKeywords: ["LLM evaluation", "AI infrastructure"],
    adjacentIndustries: ["Developer Tools", "Observability"],
    marketTiming: "platform-shift",
    wedge: "Diff-style eval reports inside GitHub PRs.",
    whyNow: "Frontier models ship every 6 weeks; teams have no rollback playbook.",
    redFlagsForCounterparts: ["consumer-app wrappers", "no CI integration"],
    resolvedIndustries: ["Computer Software", "Internet"],
    newsItems: [
      { title: "Stitch raises $22M Series A from a16z", url: "https://example.com/stitch", publishDate: "2026-03-05" },
    ],
  },
  {
    crustdataCompanyId: 102,
    thesisOneLiner: "Generative biology becomes IP-defensible only with proprietary wet-lab data.",
    beliefStatement:
      "The next defensible AI bio companies own a closed-loop between in-silico design and in-house wet-lab validation; pure compute plays will commoditize.",
    marketKeywords: ["protein design", "antibody discovery"],
    adjacentIndustries: ["Biotechnology", "Pharmaceuticals"],
    marketTiming: "platform-shift",
    wedge: "Cryo-EM data flywheel paired with generative model.",
    whyNow: "Cryo-EM throughput just 10x'd; sequence-only models are plateauing.",
    redFlagsForCounterparts: ["sequence-only foundation models", "no wet lab"],
    resolvedIndustries: ["Biotechnology"],
    newsItems: [
      { title: "Helix Bio's $35M Series A", url: "https://example.com/helix", publishDate: "2026-02-20" },
    ],
  },
  {
    crustdataCompanyId: 103,
    thesisOneLiner: "Foundation-model robotics wins the SMB long tail before factories.",
    beliefStatement:
      "The first durable robotics businesses will sell to thousands of SMBs (job shops, kit packers) where teach-by-demo dramatically outperforms hard-coded automation, not to lighthouse F500s.",
    marketKeywords: ["bimanual manipulation", "industrial robotics"],
    adjacentIndustries: ["Robotics", "Industrial Automation"],
    marketTiming: "early-application",
    wedge: "Software-defined dual-arm cell at $80k all-in.",
    whyNow: "Open-source manipulation policies (RT-X, Pi 0.5) hit production-ready in 2026.",
    redFlagsForCounterparts: ["humanoid form factors", "F500-only GTM"],
    resolvedIndustries: ["Robotics", "Industrial Automation"],
    newsItems: [
      { title: "Tessera demos at SPC Fellowship Demo Day", url: "https://example.com/tessera", publishDate: "2026-01-29" },
    ],
  },
  {
    crustdataCompanyId: 104,
    thesisOneLiner: "Software eats the long tail of US trucking — starting with cold chain.",
    beliefStatement:
      "Tier-2/3 cold-chain truckers are the last unsoftwared piece of US logistics. A vertical SaaS that bundles telematics + broker-neutral load matching can compound margin away from incumbents.",
    marketKeywords: ["cold chain logistics", "freight brokerage"],
    adjacentIndustries: ["Transportation", "Logistics & Supply Chain"],
    marketTiming: "vertical-incumbent-play",
    wedge: "Free telematics dongle bundled with margin-taking marketplace.",
    whyNow: "FMCSA ELD mandate 2.0 forces the long tail to digitize in 2026.",
    redFlagsForCounterparts: ["asset-heavy fleets", "warehouse-only plays"],
    resolvedIndustries: ["Transportation/Trucking/Railroad", "Logistics and Supply Chain"],
    newsItems: [
      { title: "PorterRoad joins YC W26", url: "https://example.com/porterroad", publishDate: "2026-03-15" },
    ],
  },
  {
    crustdataCompanyId: 105,
    thesisOneLiner: "Tidal stream is the only renewable that's both 24/7 and forecastable.",
    beliefStatement:
      "Once tidal stream LCOE clears the threshold of $80/MWh, behind-the-meter island and coastal industrial loads become a step-function market that solar/wind cannot serve.",
    marketKeywords: ["tidal energy", "marine renewables"],
    adjacentIndustries: ["Renewables & Environment", "Energy"],
    marketTiming: "picks-and-shovels",
    wedge: "Rotating-mass turbines that survive in shallow estuaries.",
    whyNow: "First UK contracts-for-difference auction including tidal closes Q4 2026.",
    redFlagsForCounterparts: ["wave-energy startups", "deep-water-only plays"],
    resolvedIndustries: ["Renewables & Environment"],
    newsItems: [
      { title: "Morwenna's $18M Series A", url: "https://example.com/morwenna", publishDate: "2026-02-02" },
    ],
  },
  {
    crustdataCompanyId: 106,
    thesisOneLiner: "Behavioral health intake is the wedge for healthcare voice agents.",
    beliefStatement:
      "Behavioral-health clinics have the worst phone-tree problem in healthcare; voice agents that get 80% of intake right unlock real ARR per clinic and bypass EHR integration headaches.",
    marketKeywords: ["healthcare voice agents", "clinical intake"],
    adjacentIndustries: ["Hospital & Health Care", "Mental Health Care"],
    marketTiming: "early-application",
    wedge: "DEA/HIPAA-compliant voice stack pre-sold to outpatient psych networks.",
    whyNow: "Telehealth parity sunset means clinics need higher throughput per FTE.",
    redFlagsForCounterparts: ["chatbot-first general health", "no clinical advisory"],
    resolvedIndustries: ["Hospital & Health Care", "Mental Health Care"],
    newsItems: [
      { title: "Kindly Labs joins YC W26", url: "https://example.com/kindly", publishDate: "2026-03-20" },
    ],
  },
];

function cp(
  partial: Omit<CounterpartCompany, "valuationProxy"> & { signals?: string[]; valuationScore: number },
): CounterpartCompany {
  const { signals, valuationScore, ...rest } = partial;
  return {
    ...rest,
    valuationProxy: {
      score: valuationScore,
      signals: signals ?? ["small headcount", "early round"],
    },
  };
}

const counterparts: CounterpartCompany[] = [
  cp({
    crustdataCompanyId: 201,
    mirroredFromCompanyId: 101,
    mirroredFromName: "Stitch AI",
    fundId: "a16z",
    name: "Snapeval",
    primaryDomain: "snapeval.dev",
    description: "GitHub-native LLM eval suite for backend engineers.",
    fundingDate: "2026-01-12",
    roundType: "pre_seed",
    roundAmountUsd: 1_400_000,
    totalInvestmentUsd: 1_400_000,
    investors: ["Initialized Capital"],
    headcountTotal: 5,
    hqCity: "Berlin",
    hqCountry: "Germany",
    yearFounded: "2025",
    thesisAlignment: 88,
    thesisRationale:
      "Same wedge (CI-first eval), but a non-US team going after the EU compliance angle — Stitch isn't there yet.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 84,
    signals: ["pre-seed cheque", "team of 5", "no Tier-1 syndicate yet"],
  }),
  cp({
    crustdataCompanyId: 202,
    mirroredFromCompanyId: 101,
    mirroredFromName: "Stitch AI",
    fundId: "a16z",
    name: "Promptkit",
    primaryDomain: "promptkit.io",
    description: "Open-source eval harness with hosted runs.",
    fundingDate: "2025-11-08",
    roundType: "seed",
    roundAmountUsd: 3_500_000,
    totalInvestmentUsd: 3_500_000,
    investors: ["Bloomberg Beta", "Essence VC"],
    headcountTotal: 11,
    hqCity: "San Francisco",
    hqCountry: "United States",
    yearFounded: "2024",
    thesisAlignment: 78,
    thesisRationale: "Adjacent — open-source flywheel matters; a16z thesis tilts CI-side, this is more notebook-first.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 70,
  }),
  cp({
    crustdataCompanyId: 203,
    mirroredFromCompanyId: 102,
    mirroredFromName: "Helix Bio",
    fundId: "founders-fund",
    name: "Cryolab AI",
    primaryDomain: "cryolab.ai",
    description: "Cryo-EM data co-op + generative antibody design.",
    fundingDate: "2026-02-25",
    roundType: "seed",
    roundAmountUsd: 6_000_000,
    totalInvestmentUsd: 6_000_000,
    investors: ["Civilization Ventures"],
    headcountTotal: 8,
    hqCity: "Boston",
    hqCountry: "United States",
    yearFounded: "2025",
    thesisAlignment: 91,
    thesisRationale:
      "Mirrors the closed-loop wet-lab + generative thesis exactly, but at seed and with a data-co-op moat angle.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 80,
    signals: ["seed round", "wet-lab partnership signal", "<10 heads"],
  }),
  cp({
    crustdataCompanyId: 204,
    mirroredFromCompanyId: 102,
    mirroredFromName: "Helix Bio",
    fundId: "founders-fund",
    name: "Antifold",
    primaryDomain: "antifold.bio",
    description: "Open-source antibody design models with paid hosted inference.",
    fundingDate: "2025-09-30",
    roundType: "pre_seed",
    roundAmountUsd: 800_000,
    totalInvestmentUsd: 800_000,
    investors: ["Pillar VC"],
    headcountTotal: 4,
    hqCity: "Cambridge",
    hqCountry: "United Kingdom",
    yearFounded: "2024",
    thesisAlignment: 64,
    thesisRationale: "Sequence-only model — close to Helix's red flag, but team has wet-lab access via partnership.",
    timingMatch: false,
    llmRedFlag: "No in-house wet lab — lukewarm on differentiation.",
    valuationScore: 88,
  }),
  cp({
    crustdataCompanyId: 205,
    mirroredFromCompanyId: 103,
    mirroredFromName: "Tessera Robotics",
    fundId: "spc",
    name: "Polyarm",
    primaryDomain: "polyarm.co",
    description: "Dual-arm cell sold as monthly leasing to job shops.",
    fundingDate: "2026-02-10",
    roundType: "pre_seed",
    roundAmountUsd: 2_200_000,
    totalInvestmentUsd: 2_200_000,
    investors: ["Tuesday Capital", "Anorak Ventures"],
    headcountTotal: 6,
    hqCity: "Pittsburgh",
    hqCountry: "United States",
    yearFounded: "2025",
    thesisAlignment: 90,
    thesisRationale: "Same SMB-first hypothesis, leasing GTM resonates with capital-constrained shops.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 82,
  }),
  cp({
    crustdataCompanyId: 206,
    mirroredFromCompanyId: 103,
    mirroredFromName: "Tessera Robotics",
    fundId: "spc",
    name: "Loophand",
    primaryDomain: "loophand.io",
    description: "Teach-by-demo controllers retrofitting existing UR cobots.",
    fundingDate: "2026-03-08",
    roundType: "pre_seed",
    roundAmountUsd: 1_700_000,
    totalInvestmentUsd: 1_700_000,
    investors: ["Compound", "Arc Search"],
    headcountTotal: 4,
    hqCity: "Toronto",
    hqCountry: "Canada",
    yearFounded: "2025",
    thesisAlignment: 81,
    thesisRationale: "Retrofit angle is even more capital-light; thesis-aligned.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 86,
  }),
  cp({
    crustdataCompanyId: 207,
    mirroredFromCompanyId: 104,
    mirroredFromName: "PorterRoad",
    fundId: "yc",
    name: "Chillship",
    primaryDomain: "chillship.app",
    description: "Free telematics for refrigerated trucks; revenue from broker spread.",
    fundingDate: "2026-01-22",
    roundType: "pre_seed",
    roundAmountUsd: 1_100_000,
    totalInvestmentUsd: 1_100_000,
    investors: ["Liquid 2 Ventures"],
    headcountTotal: 5,
    hqCity: "Atlanta",
    hqCountry: "United States",
    yearFounded: "2025",
    thesisAlignment: 87,
    thesisRationale: "Same exact wedge as PorterRoad. Cheaper and earlier; deserves a real cheque.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 87,
  }),
  cp({
    crustdataCompanyId: 208,
    mirroredFromCompanyId: 104,
    mirroredFromName: "PorterRoad",
    fundId: "yc",
    name: "Boxhaul",
    primaryDomain: "boxhaul.com",
    description: "Asset-light dry-van brokerage with AI dispatch.",
    fundingDate: "2025-12-15",
    roundType: "seed",
    roundAmountUsd: 4_400_000,
    totalInvestmentUsd: 4_400_000,
    investors: ["Greylock", "Bedrock"],
    headcountTotal: 12,
    hqCity: "Chicago",
    hqCountry: "United States",
    yearFounded: "2024",
    thesisAlignment: 55,
    thesisRationale: "Adjacent but dry-van not cold-chain; misses the wedge specificity.",
    timingMatch: false,
    llmRedFlag: null,
    valuationScore: 65,
  }),
  cp({
    crustdataCompanyId: 209,
    mirroredFromCompanyId: 105,
    mirroredFromName: "Morwenna",
    fundId: "founders-fund",
    name: "Tideturbine",
    primaryDomain: "tideturbine.eu",
    description: "Estuary-class tidal stream generators for behind-the-meter loads.",
    fundingDate: "2026-02-05",
    roundType: "seed",
    roundAmountUsd: 5_500_000,
    totalInvestmentUsd: 5_500_000,
    investors: ["Carbon13", "Fifty Years"],
    headcountTotal: 9,
    hqCity: "Edinburgh",
    hqCountry: "United Kingdom",
    yearFounded: "2024",
    thesisAlignment: 86,
    thesisRationale: "Same target market and estuary thesis, with a behind-the-meter pilot already signed.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 83,
  }),
  cp({
    crustdataCompanyId: 210,
    mirroredFromCompanyId: 106,
    mirroredFromName: "Kindly Labs",
    fundId: "yc",
    name: "Solera Health",
    primaryDomain: "solera.health",
    description: "Voice agent for psych intake — DEA-compliant audit trail.",
    fundingDate: "2026-03-01",
    roundType: "pre_seed",
    roundAmountUsd: 1_900_000,
    totalInvestmentUsd: 1_900_000,
    investors: ["Goodwater Capital"],
    headcountTotal: 6,
    hqCity: "Austin",
    hqCountry: "United States",
    yearFounded: "2025",
    thesisAlignment: 84,
    thesisRationale: "Same intake wedge with a stronger compliance angle for controlled-substance prescribers.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 85,
  }),
  cp({
    crustdataCompanyId: 211,
    mirroredFromCompanyId: 106,
    mirroredFromName: "Kindly Labs",
    fundId: "yc",
    name: "Calmwave",
    primaryDomain: "calmwave.app",
    description: "Voice AI scheduling for teletherapy clinics.",
    fundingDate: "2026-02-12",
    roundType: "seed",
    roundAmountUsd: 3_100_000,
    totalInvestmentUsd: 3_100_000,
    investors: ["Floodgate"],
    headcountTotal: 8,
    hqCity: "Los Angeles",
    hqCountry: "United States",
    yearFounded: "2024",
    thesisAlignment: 71,
    thesisRationale: "Adjacent — scheduling, not full intake. Lower clinical risk but smaller wedge.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 72,
  }),
  cp({
    crustdataCompanyId: 212,
    mirroredFromCompanyId: 101,
    mirroredFromName: "Stitch AI",
    fundId: "a16z",
    name: "Trustlens",
    primaryDomain: "trustlens.dev",
    description: "Eval and red-teaming for production agentic apps.",
    fundingDate: "2026-03-12",
    roundType: "pre_seed",
    roundAmountUsd: 1_800_000,
    totalInvestmentUsd: 1_800_000,
    investors: ["Susa Ventures"],
    headcountTotal: 4,
    hqCity: "London",
    hqCountry: "United Kingdom",
    yearFounded: "2025",
    thesisAlignment: 76,
    thesisRationale: "Production-side angle complements Stitch's CI-side; thesis still aligned.",
    timingMatch: true,
    llmRedFlag: null,
    valuationScore: 80,
  }),
];

const traction: TractionScore[] = counterparts.map((c, idx) => {
  const variants = [
    { hc: 78, hv: 88, web: 60, sr: 70, sigs: [
      { label: "Headcount growth (90d)", value: "+3 → 5 (+66%)", c: "high" as const },
      { label: "Open roles", value: "4 (2 GTM)", c: "high" as const },
      { label: "Senior hire", value: "Ex-Stripe staff eng", c: "high" as const },
      { label: "Web traffic", value: "12k MAU est.", c: "medium" as const },
    ] },
    { hc: 60, hv: 65, web: 55, sr: 50, sigs: [
      { label: "Headcount growth (90d)", value: "+2 (+22%)", c: "medium" as const },
      { label: "Open roles", value: "3", c: "medium" as const },
      { label: "Web traffic", value: "8k MAU", c: "low" as const },
    ] },
    { hc: 90, hv: 72, web: 78, sr: 80, sigs: [
      { label: "Headcount growth (90d)", value: "+4 (+100%)", c: "high" as const },
      { label: "Senior hire", value: "Ex-Boston Dynamics PM", c: "high" as const },
      { label: "Open roles", value: "5 (2 robotics eng)", c: "high" as const },
      { label: "Web traffic", value: "rapid month-over-month growth", c: "medium" as const },
    ] },
    { hc: 40, hv: 30, web: 30, sr: 20, sigs: [
      { label: "Headcount growth (90d)", value: "flat", c: "low" as const },
      { label: "Open roles", value: "1", c: "medium" as const },
      { label: "Web traffic", value: "no signal", c: "low" as const },
    ] },
  ];
  const v = variants[idx % variants.length];
  return {
    crustdataCompanyId: c.crustdataCompanyId,
    headcountMomentum: v.hc,
    hiringVelocity: v.hv,
    webTrafficScore: v.web,
    seniorHireSignal: v.sr,
    composite: Math.round((v.hc + v.hv + v.web + v.sr) / 4),
    signals: v.sigs.map((s) => ({ label: s.label, value: s.value, confidence: s.c })),
  };
});

const riskFlags: RiskFlag[] = counterparts.map((c) => {
  if (c.crustdataCompanyId === 204) return { crustdataCompanyId: 204, flags: ["No syndicate disclosed", "Last round >12 months old"], totalPenalty: 10 };
  if (c.crustdataCompanyId === 208) return { crustdataCompanyId: 208, flags: ["Overfunded for stage"], totalPenalty: 5 };
  if (c.crustdataCompanyId === 211) return { crustdataCompanyId: 211, flags: [], totalPenalty: 0 };
  return { crustdataCompanyId: c.crustdataCompanyId, flags: [], totalPenalty: 0 };
});

function makeFounder(name: string, archetype: FounderProfile["archetype"], composite: number, headline: string, highlights: string[]): FounderProfile {
  return {
    name,
    title: "Co-founder & CEO",
    headline,
    linkedinUrl: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "-")}`,
    rawSignals: {
      priorFounder: archetype === "repeat-operator",
      bigTechAlum: archetype === "technical-builder" || archetype === "repeat-operator",
      domainExperienceYears: archetype === "domain-expert" ? 9 : archetype === "repeat-operator" ? 6 : 3,
      repeatCofounderPair: archetype === "repeat-operator",
      topUniversity: true,
      socialPresence: true,
      recentlyChangedJob: true,
    },
    archetype,
    composite,
    highlights,
    dossierHeadline: headline,
    caveats: [],
  };
}

const founders: CompanyFounderScore[] = [
  {
    crustdataCompanyId: 201,
    composite: 78,
    averageScore: 76,
    hasRepeatOperator: true,
    founders: [
      makeFounder("Lena Brandt", "repeat-operator", 82, "Repeat founder; sold previous DevTools company to GitLab.", ["Ex-GitLab director (acquired)", "Built GitLab CI's flake detection"]),
      makeFounder("Yusuf Eren", "technical-builder", 70, "Ex-Datadog senior eng; led the synthetic-tests team.", ["6 yrs Datadog observability", "Open-source maintainer"]),
    ],
  },
  {
    crustdataCompanyId: 203,
    composite: 84,
    averageScore: 84,
    hasRepeatOperator: true,
    founders: [
      makeFounder("Anika Patel", "domain-expert", 88, "MIT cryo-EM lab → DeepMind protein team.", ["First-author on AlphaFold-3 follow-up", "8 yrs structural biology"]),
      makeFounder("Marco Russo", "repeat-operator", 80, "Repeat bio-AI founder; previous co. acquired by Recursion.", ["Acquired by Recursion 2023", "Ex-Genentech ML lead"]),
    ],
  },
  {
    crustdataCompanyId: 205,
    composite: 80,
    averageScore: 79,
    hasRepeatOperator: false,
    founders: [
      makeFounder("Priya Aiyar", "technical-builder", 81, "CMU robotics PhD; built bimanual stack at Toyota Research.", ["TRI bimanual policies", "3 robotics patents"]),
      makeFounder("Diego Cano", "domain-expert", 77, "10 yrs running a job-shop in Pittsburgh; lived the buyer pain.", ["Ran a 14-person fab shop", "Customer #0 of his own product"]),
    ],
  },
  {
    crustdataCompanyId: 207,
    composite: 73,
    averageScore: 73,
    hasRepeatOperator: false,
    founders: [
      makeFounder("Brandon Lee", "domain-expert", 75, "Ex-Convoy ops lead with 4 yrs in cold-chain dispatch.", ["Built Convoy refrigerated unit", "Knows the broker pain personally"]),
      makeFounder("Maya Singh", "technical-builder", 71, "Ex-Doordash logistics ML engineer.", ["Doordash routing ML"]),
    ],
  },
  {
    crustdataCompanyId: 209,
    composite: 76,
    averageScore: 76,
    hasRepeatOperator: false,
    founders: [
      makeFounder("Dr. Aileen MacLeod", "domain-expert", 80, "12 yrs marine engineering at Wave Energy Scotland.", ["Wave Energy Scotland CTO", "5 patents on turbine blades"]),
      makeFounder("Tom Rivera", "technical-builder", 72, "Ex-SpaceX structures; left to do climate hardware.", ["Falcon 9 structures team"]),
    ],
  },
  {
    crustdataCompanyId: 210,
    composite: 79,
    averageScore: 78,
    hasRepeatOperator: true,
    founders: [
      makeFounder("Dr. Naomi Wexler", "repeat-operator", 85, "Psychiatrist + repeat founder (sold prev. EHR co. to athenahealth).", ["athenahealth acquisition", "Practiced psychiatrist for 8 yrs"]),
      makeFounder("Sam Okonkwo", "technical-builder", 72, "Ex-Anthropic safety researcher.", ["Anthropic safety team", "Voice ML at Apple"]),
    ],
  },
  {
    crustdataCompanyId: 206,
    composite: 70,
    averageScore: 70,
    hasRepeatOperator: false,
    founders: [
      makeFounder("Erin Walsh", "technical-builder", 72, "Ex-Universal Robots applications engineer.", ["UR applications team"]),
    ],
  },
  {
    crustdataCompanyId: 202,
    composite: 65,
    averageScore: 65,
    hasRepeatOperator: false,
    founders: [
      makeFounder("Hugo Tanaka", "first-time-founder", 64, "First-time founder; ex-Hugging Face research engineer.", ["HF eval team", "Maintains popular OSS lib"]),
    ],
  },
];

// Compose scores
function buildEntries(): { entries: PortfolioEntry[]; summary: PortfolioSummary } {
  const fundConfigBudget = 500_000;
  const reservesHeld = fundConfigBudget * 0.2;
  const investable = fundConfigBudget - reservesHeld;

  const scored = counterparts.map((c) => {
    const tr = traction.find((t) => t.crustdataCompanyId === c.crustdataCompanyId)!;
    const f = founders.find((x) => x.crustdataCompanyId === c.crustdataCompanyId);
    const r = riskFlags.find((x) => x.crustdataCompanyId === c.crustdataCompanyId)!;
    const founderScore = f?.composite ?? 55;
    const composite =
      c.thesisAlignment * 0.32 +
      founderScore * 0.26 +
      tr.composite * 0.18 +
      c.valuationProxy.score * 0.16 +
      85 * 0.08 -
      r.totalPenalty;
    return { c, tr, f, r, founderScore, composite };
  });

  scored.sort((a, b) => b.composite - a.composite);

  // Top 6 invest, next 4 watch, rest skip
  const investBudgetTop = investable * 0.7;
  const investBudgetSpray = investable * 0.3;
  const investCount = 6;
  const convictionCount = 3;
  const sprayCount = investCount - convictionCount;

  const entries: PortfolioEntry[] = scored.map((row, idx) => {
    const status: PortfolioEntry["status"] = idx < investCount ? "invest" : idx < investCount + 4 ? "watch" : "skip";
    let cheque = 0;
    if (status === "invest") {
      if (idx < convictionCount) {
        cheque = Math.round(investBudgetTop / convictionCount);
      } else {
        cheque = Math.round(investBudgetSpray / sprayCount);
      }
    }
    const thesis = theses.find((t) => t.crustdataCompanyId === row.c.mirroredFromCompanyId);
    return {
      crustdataCompanyId: row.c.crustdataCompanyId,
      name: row.c.name,
      primaryDomain: row.c.primaryDomain,
      fundId: row.c.fundId,
      mirroredFromName: row.c.mirroredFromName,
      thesisOneLiner: thesis?.thesisOneLiner ?? "",
      thesisCluster: thesis ? theses.indexOf(thesis) : 0,
      stage: row.c.roundType,
      hqCountry: row.c.hqCountry,
      scores: {
        thesisAlignment: row.c.thesisAlignment,
        founderScore: row.founderScore,
        tractionScore: row.tr.composite,
        valuationProxy: row.c.valuationProxy.score,
        dataConfidence: 85,
        riskFlagCount: row.r.flags.length,
        composite: row.composite,
      },
      status,
      chequeUsd: cheque,
      allocationRationale:
        status === "invest"
          ? idx < convictionCount
            ? "Conviction cheque — top-quartile composite, repeat-operator on team, cleaner thesis fit than the mirrored deal."
            : "Spray cheque — strong thesis fit, smaller reserve to maintain power-law diversification."
          : status === "watch"
            ? "Composite in 50–64 band; revisit after next funding signal."
            : "Composite below 50 — wedge or risk profile not yet credible.",
    };
  });

  const investEntries = entries.filter((e) => e.status === "invest");
  const totalDeployed = investEntries.reduce((sum, e) => sum + e.chequeUsd, 0);

  const byThesisCluster = theses.map((t, idx) => {
    const inCluster = investEntries.filter((e) => e.thesisCluster === idx);
    return {
      clusterId: idx,
      count: inCluster.length,
      capitalShare: inCluster.reduce((s, e) => s + e.chequeUsd, 0) / Math.max(1, totalDeployed),
      thesisLabel: t.thesisOneLiner,
    };
  });

  const byGeo: Record<string, number> = {};
  const byStage: Record<string, number> = {};
  for (const e of investEntries) {
    const country = e.hqCountry ?? "Unknown";
    byGeo[country] = (byGeo[country] ?? 0) + e.chequeUsd / Math.max(1, totalDeployed);
    const stage = e.stage ?? "unknown";
    byStage[stage] = (byStage[stage] ?? 0) + e.chequeUsd / Math.max(1, totalDeployed);
  }

  const summary: PortfolioSummary = {
    entries,
    totalDeployed,
    reservesHeld,
    byStatus: {
      invest: entries.filter((e) => e.status === "invest").length,
      watch: entries.filter((e) => e.status === "watch").length,
      skip: entries.filter((e) => e.status === "skip").length,
    },
    byThesisCluster,
    byGeo,
    byStage,
    warnings: [],
  };

  return { entries, summary };
}

const { summary } = buildEntries();

const apiCalls: ApiCallSnapshot[] = [
  { endpoint: "/screener/company/search", description: "a16z recent investments", durationMs: 612, cached: false, estimatedCredits: 1.0, resultCount: 5 },
  { endpoint: "/screener/company/enrich", description: "Mirrored deal batch enrichment (6 companies)", durationMs: 845, cached: false, estimatedCredits: 1.2, resultCount: 6 },
  { endpoint: "/web/enrich/live", description: "Fetch ycombinator.com/companies?batch=W26", durationMs: 1290, cached: false, estimatedCredits: 0.5 },
  { endpoint: "/web/enrich/live", description: "Fetch southparkcommons.com/founder-fellowship", durationMs: 1880, cached: true, estimatedCredits: 0 },
  { endpoint: "/screener/company/search", description: "Counterparts for Stitch AI thesis", durationMs: 740, cached: false, estimatedCredits: 1.0, resultCount: 28 },
  { endpoint: "/screener/company/search", description: "Counterparts for Helix Bio thesis", durationMs: 690, cached: false, estimatedCredits: 1.0, resultCount: 22 },
  { endpoint: "/screener/company/search", description: "Counterparts for Tessera Robotics thesis", durationMs: 720, cached: false, estimatedCredits: 1.0, resultCount: 18 },
  { endpoint: "/screener/company/search", description: "Counterparts for PorterRoad thesis", durationMs: 705, cached: false, estimatedCredits: 1.0, resultCount: 24 },
  { endpoint: "/screener/company/search", description: "Counterparts for Morwenna thesis", durationMs: 660, cached: false, estimatedCredits: 1.0, resultCount: 11 },
  { endpoint: "/screener/company/search", description: "Counterparts for Kindly Labs thesis", durationMs: 670, cached: false, estimatedCredits: 1.0, resultCount: 19 },
  { endpoint: "/screener/company/enrich", description: "Counterpart enrichment batch (12)", durationMs: 1240, cached: false, estimatedCredits: 2.4, resultCount: 12 },
  { endpoint: "/screener/person/enrich", description: "Founder enrichment batch (15)", durationMs: 1830, cached: false, estimatedCredits: 1.5, resultCount: 15 },
];

const reasoning: ReasoningEntry[] = [
  { step: "step2", companyName: "Stitch AI", rationale: "Enrich shows hires from GitLab CI + Datadog observability. Combined with the round investor pattern (a16z + Lux), the implicit bet is on an infra-side LLM eval product, not consumer prompts." },
  { step: "step2", companyName: "Helix Bio", rationale: "Cryo-EM job postings + ARCH on the cap table point to a wet-lab-first positioning. Sequence-only models are flagged as anti-thesis." },
  { step: "step2", companyName: "Tessera Robotics", rationale: "SPC fellowship cohort + Lux co-investor. Headcount mostly applied robotics, no humanoid signals → SMB-first thesis." },
  { step: "step3", companyName: "Snapeval", rationale: "Open-source eval harness with CI-first positioning out of Berlin. Tiny team but exact wedge match. Strongest counterpart for Stitch." },
  { step: "step3", companyName: "Cryolab AI", rationale: "Data-co-op moat is a credible variation on Helix's wet-lab thesis; seed cheque size lets us mirror conviction at 1/4 the valuation." },
  { step: "step3", companyName: "Antifold", rationale: "Sequence-only — flagged as anti-thesis per Helix's red-flag list. Kept on watchlist only." },
  { step: "step5", companyName: "Cryolab AI", rationale: "Anika Patel: cryo-EM PhD + DeepMind protein team. Marco Russo: prior bio-AI exit to Recursion. Repeat-operator + domain-expert pairing — top decile founder team for this thesis." },
  { step: "step5", companyName: "Snapeval", rationale: "Lena Brandt previously sold a DevTools co. to GitLab and personally built CI flake detection — directly the wedge. Repeat operator with deep domain context." },
];

const record: RunRecord = {
  runId: "demo-2026-04-19",
  startedAt: "2026-04-19T09:00:00.000Z",
  completedAt: "2026-04-19T09:01:42.000Z",
  config: {
    fundSize: 500_000,
    targetPortfolioSize: 25,
    blockedGeos: ["CN", "RU"],
    blockedSectors: [],
    maxChequeSize: 25_000,
    minStage: "pre_seed",
    maxStage: "series_a",
    fundsToMirror: ["yc", "a16z", "spc", "founders-fund"],
  },
  deals,
  theses,
  counterparts,
  traction,
  riskFlags,
  founders,
  portfolio: summary,
  apiCalls,
  reasoning,
  totalCredits: apiCalls.reduce((s, a) => s + a.estimatedCredits, 0),
  notes: ["Demo fixture generated by scripts/generate-demo-fixture.ts"],
};

async function main() {
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(record, null, 2), "utf8");
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
