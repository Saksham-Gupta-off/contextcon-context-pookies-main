import type { FounderProfile } from "@/lib/pipeline/types";

const TOP_TECH_COMPANIES = new Set(
  [
    "google",
    "alphabet",
    "apple",
    "meta",
    "facebook",
    "microsoft",
    "amazon",
    "aws",
    "stripe",
    "anthropic",
    "openai",
    "nvidia",
    "tesla",
    "spacex",
    "uber",
    "airbnb",
    "snowflake",
    "databricks",
    "palantir",
    "linkedin",
    "salesforce",
    "shopify",
    "atlassian",
    "twilio",
    "github",
    "deepmind",
    "y combinator",
    "ramp",
    "scale ai",
    "figma",
    "notion",
    "vercel",
    "cloudflare",
    "datadog",
    "robinhood",
    "coinbase",
    "doordash",
    "instacart",
    "zoom",
    "slack",
    "dropbox",
    "pinterest",
    "twitter",
    "x corp",
  ].map((s) => s.toLowerCase()),
);

const TOP_UNIVERSITIES = new Set(
  [
    "stanford",
    "stanford university",
    "mit",
    "massachusetts institute of technology",
    "harvard",
    "harvard university",
    "uc berkeley",
    "university of california, berkeley",
    "carnegie mellon",
    "carnegie mellon university",
    "princeton",
    "yale",
    "caltech",
    "california institute of technology",
    "eth zurich",
    "iit",
    "indian institute of technology",
    "oxford",
    "university of oxford",
    "cambridge",
    "university of cambridge",
    "imperial college london",
    "tsinghua",
    "national university of singapore",
    "uc san diego",
    "university of pennsylvania",
    "wharton",
    "columbia",
    "northwestern",
    "uiuc",
    "university of michigan",
    "georgia tech",
    "georgia institute of technology",
  ].map((s) => s.toLowerCase()),
);

const FOUNDER_TITLE_TOKENS = ["founder", "co-founder", "cofounder", "ceo", "cto", "cpo"];

function isLikelyFounderTitle(title: string | undefined) {
  if (!title) return false;
  const lower = title.toLowerCase();
  return FOUNDER_TITLE_TOKENS.some((token) => lower.includes(token));
}

function isBigTech(companyName: string | undefined) {
  if (!companyName) return false;
  const lower = companyName.toLowerCase();
  for (const tech of TOP_TECH_COMPANIES) {
    if (lower.includes(tech)) return true;
  }
  return false;
}

function isTopUniversity(school: string | undefined) {
  if (!school) return false;
  const lower = school.toLowerCase();
  for (const u of TOP_UNIVERSITIES) {
    if (lower.includes(u)) return true;
  }
  return false;
}

function yearsFrom(startDate: string | undefined) {
  if (!startDate) return 0;
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return 0;
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

export type FounderRawInput = {
  name: string;
  title?: string;
  headline?: string;
  linkedinUrl?: string;
  twitterSlug?: string;
  followers?: number | null;
  joinedDate?: string;
  recentlyChangedJob?: boolean | null;
  pastExperience: Array<{ company: string; title?: string; startDate?: string; endDate?: string }>;
  schools: Array<{ name?: string; degree?: string }>;
  crustdataPersonId?: number;
};

export function deriveRawSignals(
  input: FounderRawInput,
  cofounderEmployers: Set<string>,
) {
  const priorFounder = input.pastExperience.some((exp) => isLikelyFounderTitle(exp.title));
  const bigTechAlum = input.pastExperience.some((exp) => isBigTech(exp.company));
  const topUniversity = input.schools.some((school) => isTopUniversity(school.name));

  const earliestStart = input.pastExperience
    .map((exp) => yearsFrom(exp.startDate))
    .filter((y) => y > 0)
    .reduce((max, y) => (y > max ? y : max), 0);

  const myEmployers = new Set(
    input.pastExperience
      .map((exp) => exp.company?.toLowerCase().trim())
      .filter((s): s is string => Boolean(s)),
  );

  const repeatCofounderPair =
    cofounderEmployers.size > 0 &&
    [...cofounderEmployers].some((employer) => myEmployers.has(employer));

  const socialPresence =
    Boolean(input.twitterSlug) || (input.followers ?? 0) >= 1000;

  return {
    priorFounder,
    bigTechAlum,
    domainExperienceYears: Math.round(earliestStart),
    repeatCofounderPair,
    topUniversity,
    socialPresence,
    recentlyChangedJob: Boolean(input.recentlyChangedJob),
  };
}

export function deterministicFounderScore(
  signals: FounderProfile["rawSignals"],
) {
  let score = 30;
  if (signals.priorFounder) score += 25;
  if (signals.bigTechAlum) score += 15;
  if (signals.topUniversity) score += 10;
  if (signals.socialPresence) score += 5;
  if (signals.repeatCofounderPair) score += 10;
  if (signals.domainExperienceYears >= 5) score += 10;
  else if (signals.domainExperienceYears >= 3) score += 5;
  if (signals.recentlyChangedJob) score += 3;

  return Math.min(100, score);
}

export function inferArchetype(
  signals: FounderProfile["rawSignals"],
): FounderProfile["archetype"] {
  if (signals.priorFounder) return "repeat-operator";
  if (signals.domainExperienceYears >= 6 && signals.bigTechAlum) return "domain-expert";
  if (signals.bigTechAlum || signals.topUniversity) return "technical-builder";
  if (signals.domainExperienceYears < 3 && !signals.bigTechAlum) return "first-time-founder";
  return "unknown";
}

export function buildCofounderEmployerSet(
  founders: FounderRawInput[],
): Set<string>[] {
  // For each founder, return the union of all OTHER founders' past employer sets
  const employerLists = founders.map(
    (f) =>
      new Set(
        f.pastExperience
          .map((exp) => exp.company?.toLowerCase().trim())
          .filter((s): s is string => Boolean(s)),
      ),
  );

  return employerLists.map((_, idx) => {
    const union = new Set<string>();
    employerLists.forEach((list, otherIdx) => {
      if (otherIdx === idx) return;
      list.forEach((value) => union.add(value));
    });
    return union;
  });
}

export { isLikelyFounderTitle };
