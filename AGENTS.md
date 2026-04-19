# AGENTS.md

## Purpose

This file is the working reference for implementation agents on the MirrorVC project.
It is not a replacement for the main plan or the Crustdata docs. It is the practical
guide that explains:

- what we are building
- which documents are authoritative
- which engineering constraints are non-negotiable
- how to make decisions when the plan and the real API behavior diverge

Keep this file updated as the codebase becomes real.

## Project Summary

MirrorVC is an AI-native venture sourcing tool.

The product mirrors thesis-driven funds such as Y Combinator, Andreessen Horowitz,
South Park Commons, Founders Fund, and Khosla Ventures, then finds earlier and
cheaper-stage counterparts in the same market thesis.

The app is designed for a hackathon demo, so the implementation must optimize for:

- live transparency
- auditability
- predictable runtime under Crustdata rate limits
- a strong 90-second demo story

## Source Of Truth

Use the following order of precedence when making implementation decisions:

1. [Main Build Plan.md](/Users/yash/Documents/ContextCon/contextcon-context-pookies-main/Main%20Build%20Plan.md)
2. The Crustdata docs in [docs](/Users/yash/Documents/ContextCon/contextcon-context-pookies-main/docs)
3. This file, `AGENTS.md`
4. [Rough-plan-v1.md](/Users/yash/Documents/ContextCon/contextcon-context-pookies-main/Rough-plan-v1.md) for historical context only

Important:

- `Main Build Plan.md` is the current implementation spec, even if some heading text
  still says `v2`.
- `Rough-plan-v1.md` should not override the main build plan.
- If real Crustdata behavior differs from the prose plan, prefer documented live
  behavior from the starter docs and API reference, then update the code and note
  the discrepancy clearly.

## Product Boundaries

### What MirrorVC is

- A deterministic pipeline with selective AI reasoning
- A sourcing and ranking tool
- A transparency-first demo product
- A tool that uses Crustdata as the data backbone

### What MirrorVC is not

- A free-form autonomous investing agent
- A private valuation engine
- A full portfolio management platform
- A multi-user production SaaS in v1
- A third-party scraping system

## Core Product Flow

The product pipeline has six stages:

1. Fund Watcher
   - Step 1a uses Crustdata company search on `funding.investors`
   - Step 1b uses Crustdata web search and web fetch on fund portfolio pages
2. Thesis Extractor
   - enrich mirrored companies and distill the market belief
3. Counterpart Finder
   - find earlier-stage companies in the same thesis
4. Traction And Risk Scorer
   - quantify growth signals and penalize obvious risk flags
5. Founder Scorer
   - score founders with mostly deterministic rules plus AI summarization
6. Portfolio Builder
   - rank, classify, and allocate capital under diversification constraints

This is a deterministic system first.
OpenAI should only be used where synthesis or structured extraction adds real value.

## Technical Direction

Target stack:

- Next.js 15
- App Router
- TypeScript
- Node runtime, not Edge, because disk caching is required
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Vercel AI SDK with `@ai-sdk/openai`
- Zod
- `p-queue`

The codebase should grow toward this shape:

```text
app/
  page.tsx
  run/page.tsx
  portfolio/page.tsx
  dossier/[id]/page.tsx
  api/run/route.ts
  api/dossier/[id]/route.ts
lib/
  crustdata/
  funds/
  pipeline/
  openai/
  scoring/
  fixtures/
components/
.cache/
```

## Non-Negotiable Engineering Rules

### 1. Crustdata is the system backbone

All core sourcing, enrichment, and portfolio logic should be built around Crustdata.

Allowed:

- `/company/search`
- `/company/enrich`
- `/company/identify`
- `/company/search/autocomplete`
- `/person/enrich`
- `/person/search`
- `/person/autocomplete`
- `/web/search/live`
- `/web/enrich/live`

Not allowed for v1:

- direct third-party scraping infrastructure
- Cheerio-based scraping as the primary ingestion path
- headless browser workflows unless explicitly approved later

### 2. Respect the 15 rpm limit

Every Crustdata request must run through one shared queue with:

- `intervalCap: 15`
- `interval: 60_000`

Do not add ad hoc `fetch` calls outside the central client.

### 3. No runtime writes to source files

Runtime-discovered data belongs in `.cache`, never in `lib/` or `app/`.

Examples:

- good: `.cache/funds/{fundId}.json`
- good: `.cache/company/...`
- bad: mutating `lib/funds/registry.ts` at runtime
- bad: writing learned aliases back into tracked source files

### 4. Deterministic first, AI second

If a problem can be solved reliably with deterministic code, do that first.

Use OpenAI for:

- extracting company lists from HTML
- thesis distillation
- counterpart reranking
- founder narrative synthesis

Do not use OpenAI where a deterministic rule is simpler, cheaper, and more explainable.

### 5. Every important output should be auditable

Where possible, the UI should be able to explain:

- which source produced the signal
- which API call produced the field
- what score inputs were used
- which heuristic or model generated the conclusion

## Fund Configuration Rules

Fund metadata is product configuration, not transport logic.

Use:

- `lib/funds/registry.ts` for static curated fund config
- `lib/funds/types.ts` for fund-related types
- `lib/funds/extractors/` for optional fund-specific extractors
- `.cache/funds/` for runtime discoveries

Each fund config should include:

- display name
- aliases
- portfolio candidate URLs
- discovery query
- freshness policy
- extractor hint
- site domain or equivalent search-site field for web discovery

### Freshness policy

There are two fund freshness models:

- `cohort`
  - for YC and SPC style cohort pages
  - freshness is determined by cohort label matching
- `rolling`
  - for evergreen portfolio pages such as a16z, Founders Fund, and Khosla
  - freshness is determined by Crustdata funding date, not the page itself

This distinction matters. Do not treat evergreen portfolio pages as fresh signals by default.

## Rate And Cost Strategy

The runtime must stay demo-safe.

Design principles:

- cap everything through one `lib/pipeline/limits.ts`
- overfetch only where the plan explicitly says to
- batch enrich and identify calls wherever possible
- avoid repeated autocomplete calls in Step 3
- prefer static maps and runtime caches before live resolution

Expected controls:

- `fundsToMirror`
- `dealsPerFund`
- `totalMirroredDeals`
- `marketKeywordsPerThesis`
- `counterpartsSearchedPerDeal`
- `counterpartsKeptPerDeal`
- `totalCounterparts`
- `foundersPerCompany`
- `webFetchPerRun`

If a feature threatens the call budget, simplify it before adding it.

## Step-Specific Guidance

### Step 1a: structured fund watcher

- Resolve indexed investor names with autocomplete, then cache the result
- Search on `funding.investors`
- Filter by recent `funding.last_fundraise_date`
- Keep only the strongest recent deals per fund

### Step 1b: portfolio page watcher

- Try curated portfolio URLs first
- Use Crustdata web search only as fallback discovery
- If Step 1b fails for a fund, surface an explicit UI event
- Never silently degrade without telling the user

### Step 2: thesis extraction

- Keep output intentionally narrow
- Prefer short, discriminating noun phrases
- Optimize for a cheap downstream Step 3

### Step 3: counterpart finder

- Use three-tier keyword resolution:
  - static map
  - runtime cache
  - bounded autocomplete fallback
- One search call per mirrored deal
- One rerank call per mirrored deal
- Do not explode into per-keyword or per-candidate API fan-out

### Step 4: traction and risk

- Favor explainable heuristics over fancy scoring
- Any low-confidence metric should be marked as such in the UI

### Step 5: founder scoring

- Deterministic rubric first
- AI synthesis second
- Missing founder data should degrade gracefully, not crash the pipeline

### Step 6: portfolio builder

- Use clear weighted math
- Enforce diversification deterministically
- Use structured tag clustering, not embeddings, in v1

## Known Crustdata Gotchas

These are important enough to remember while coding:

- `headcount.total` vs `headcount.latest_count`
  - normalize to `total`
- enrich endpoints may return either a top-level array or a documented wrapper
  - normalize internally
- `locations.hq_country` is used in search
- `locations.country` appears in autocomplete contexts
- `funding.last_fundraise_date` behaves like a string ISO date in filters
- person enrich often returns `200` with empty `matches`
- company identify expects exactly one identifier type per request
  - do not mix `domains` and `names` in one call
- company search autocomplete should be treated as `suggestions[].value`
  - do not assume suggestion counts exist

Treat these as client-layer normalization responsibilities.

## UX Priorities

The hackathon demo matters as much as the backend.

The app should make a judge understand three things quickly:

1. what MirrorVC is doing
2. why each company was selected
3. that the data is real and auditable

This means the following UI pieces are high priority:

- live stepper
- StepCard stream
- API Call Inspector
- Reasoning Panel
- Fund Flow Sankey
- final portfolio table
- dossier view with provenance
- demo replay mode

If there is ever a tradeoff between a fancy extra feature and the transparency UI,
choose transparency UI.

## Implementation Order

Build in this order unless there is a strong reason not to:

1. scaffold the Next.js app and dependencies
2. implement the Crustdata client, schemas, queue, and cache
3. add `lib/pipeline/limits.ts`
4. add `lib/funds/registry.ts`, `types.ts`, and any extractor stubs
5. seed `lib/fixtures/keywordIndustryMap.ts`
6. smoke test Step 1a
7. smoke test Step 1b
8. build SSE orchestration
9. build Step 2 through Step 6
10. build the `/run` and `/portfolio` views
11. add demo replay and fallbacks
12. polish and pitch assets

Do not start with cosmetics before the pipeline and rate-limited client exist.

## Definition Of Done For V1

V1 is good enough when:

- the full six-step pipeline runs end-to-end
- the runtime stays within the planned Crustdata call budget
- the UI shows live progress and reasoning
- the output portfolio is auditable
- the dossier explains every major score
- demo replay works reliably
- obvious API failure paths degrade gracefully

## How To Work With This File

Update `AGENTS.md` when any of these change:

- source-of-truth document locations
- architecture shape
- data flow rules
- rate-limit strategy
- caching strategy
- implementation order
- critical API caveats

This file should stay short enough to be read quickly, but complete enough that
an agent can start useful work without rereading every planning thread.
