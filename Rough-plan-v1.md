# AI-Native Venture Capitalist
---

## The Thesis

Venture returns follow a power law — a handful of outliers return entire funds. The statistical implication: maximising portfolio size (within capital constraints) and minimising selection bias improves expected returns. The problem is that doing real sourcing at scale is a full-time job for a GP with a team.

**MirrorVC's bet**: Famous thesis-driven funds are doing the hard work of identifying the winning market hypotheses. We don't copy their deals — we find the *second mover in the same thesis* at a cheaper valuation, before the category gets crowded and expensive.

---

## Core Hypothesis

> When Benchmark leads a $15M Series A into a B2B AI observability company, there are likely 3–5 other companies building adjacent products at seed or pre-seed valuations. The thesis is validated. The price hasn't been bid up yet.

---

## System Architecture (Intial Idea) - To be Assessed, finalized based on the Hackathon requirements on what is possible with Crust Data API 

```
┌─────────────────────────────────────────────────────────────┐
│                        AI Native VC                         │
│                                                             │
│  ┌─────────────────┐      ┌──────────────────────────────┐ │
│  │  Fund Watcher   │      │     Portfolio Engine          │ │
│  │                 │      │                              │ │
│  │  · a16z         │─────▶│  Thesis Extractor            │ │
│  │  · YC           │      │  Counterpart Finder          │ │
│  │  · Founders Fund│      │  Valuation Estimator         │ │
│  │  · Khosla       │      │  Founder Scorer              │ │
│  │  · Neo / SPC    │      │  Geo + Sector Filter         │ │
│  └─────────────────┘      │  Allocation Calculator       │ │
│                            └──────────────────────────────┘ │
│                                          │                   │
│         ┌──────────────────────────────────┘                 │
│         ▼                                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Data Sources                          ││
│  │  Crustdata API · YC Companies · TechCrunch · X/Twitter ││
│  │  PitchBook (public signals) · LinkedIn · Crunchbase    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Flow

### Part 1 — Onboarding (2 minutes)

A clean configuration screen where the user sets:

| Parameter | Input Type | Example |
|---|---|---|
| Fund size to deploy | Dollar input | $500,000 |
| Target portfolio size | Slider | 25 companies |
| Funds to mirror | Multi-select | a16z, YC, Founders Fund |
| Blocked geographies | Tag input | China, Russia |
| Blocked sectors | Tag input | Aerospace, Defence |
| Max cheque size | Dollar input | $25,000 |
| Min / Max stage | Dropdown | Pre-seed → Seed |

**Output after onboarding**: A "portfolio constitution" summary card. Show the user their implied cheque size range and a reality check — *"At $500K across 25 companies, your average cheque is $20K. Pre-seed rounds in the US typically accept $10–50K from angels. This is viable."*

> ⚠️ **Blind spot flag**: If fund size is too small for the target portfolio count, the agent should warn the user — not silently proceed.

---

### Part 2 — Portfolio Crafting

The agent runs in 4 sequential steps. Show each step live as it executes.

#### Step 1 · Fund Watcher — "What did the smart money just back?"

The agent queries recent investment announcements from the selected funds.

**Sources (in priority order)**:
1. YC Companies list (public, structured, updated each batch)
2. TechCrunch / Bloomberg / Forbes (web search via agent)
3. Twitter/X — fund partner announcement threads
4. PitchBook public signals (press releases indexed)
5. Crunchbase (funding round data, 30-day lag)

**Output per deal found**:
```
Fund: a16z
Company: Acme AI
Stage: Series A · $18M
Date announced: 2025-01-14  ← freshness check
Market: B2B AI data observability
Thesis: Enterprise LLM output quality monitoring
```

> ⚠️ **Critical — Timing Problem**: The agent must flag the *announcement date* vs *deal date*. If a deal was announced 9 months after close, the window to find counterparts may have narrowed. Flag deals older than 60 days as "stale signal."

---

#### Step 2 · Thesis Extractor — "What is this company actually a bet on?"

The agent distills the *market hypothesis* behind each funded company — not the company itself.

Using an LLM prompt over the deal data:

> *"Given this company's product, market, and investor — what is the underlying thesis? Express it as: 'The belief that [X] will happen, creating a market for [Y].' Keep it to 2 sentences."*

**Example**:
- Company: Acme AI
- Extracted thesis: *"The belief that enterprise LLMs will generate enough incorrect or hallucinated outputs at scale to require dedicated monitoring infrastructure, creating a market for real-time AI output quality tooling."*

This thesis becomes the search vector for counterparts.

---

#### Step 3 · Counterpart Finder — "Who else is betting on this thesis?"

The agent uses the extracted thesis as a search query across Crustdata + web sources to find companies building in the same category.

**Crustdata API calls**:
- Company search by industry keywords + founding date (< 36 months old)
- Headcount filter (< 30 employees = likely pre-Series A)
- Geography filter (apply user's block list)
- Funding stage filter (Pre-seed / Seed preferred)

**Scoring each counterpart on**:
- Thesis alignment (LLM similarity score vs. extracted thesis)
- Stage relative to the mirrored company (earlier = better)
- Geography (US/EU premium; emerging markets = higher risk flag)
- Traction signals: hiring velocity, website traffic growth, GitHub stars (open source)

**"Cheaper valuation" proxy** (since cap tables are private):
- Earlier stage than the mirrored company → implied lower valuation
- Smaller announced round → likely lower valuation
- Non-SF/NYC geography → typically 20–40% valuation discount
- No tier-1 lead investor yet → price not yet bid up

> ⚠️ **Note for judges**: True private valuations are not public. The agent makes *relative valuation estimates* using stage, round size, and geography as proxies — not absolute dollar figures. This is directionally correct for a sourcing tool.

---

#### Step 4 · Founder Scorer — "Should I back this team?"

For each shortlisted counterpart, the agent pulls founder data and scores them.

**Data sources**: LinkedIn (public), Crustdata people data, Twitter/X, GitHub

**Scoring dimensions**:

| Signal | Weight | Rationale |
|---|---|---|
| Prior founder (even failed) | High | Domain experience |
| Big tech / top startup alumni | Medium | Execution capability signal |
| Domain expert (10+ years in sector) | High | Non-consensus insight |
| Repeat cofounder pairing | Medium | Team trust already built |
| Top university (STEM) | Low | Weak signal, but used as tiebreaker |
| Active online presence (builders in public) | Low | Community + distribution instinct |

The agent does **not** use school as a primary filter — it's a tiebreaker only, not a gate. Brilliant dropouts have built billion-dollar companies.

**Output per founder**:
```
Founder: Jane Kim
Score: 82/100
Highlights: 2x founder (prev exit at Stripe), ex-Databricks ML Eng, 
            active on X with 12K ML followers, Stanford CS (tiebreaker only)
```

---

#### Step 5 · Portfolio Builder — Final Output

The agent assembles a ranked shortlist and allocates capital.

**Output**: A portfolio table with:

| Company | Thesis match | Stage | Est. valuation tier | Founder score | Suggested cheque | Status |
|---|---|---|---|---|---|---|
| DataLens AI | 94% | Pre-seed | Low | 82/100 | $20,000 | ✅ Invest |
| ObservAI | 88% | Seed | Medium | 74/100 | $15,000 | ✅ Invest |
| MLWatch | 71% | Seed | Medium | 61/100 | $10,000 | 🟡 Watch |
| AuditBot | 65% | Pre-seed | Low | 48/100 | — | ❌ Skip |

Capital is allocated proportionally to composite score within the user's total fund size.

---


```

---

## Blind Spots & Risks (Acknowledged) - To be reviewed and finalized 

| Risk | Mitigation |
|---|---|
| Private valuations unknowable | Use stage/round/geo as proxy; disclose this clearly in UI |
| Deal announcement lag (6–12mo) | Flag deal freshness; prioritise < 60 days |
| Power law needs 50–200 bets | Show minimum portfolio size recommendation at onboarding |
| Counterpart may have already raised | Add "last funding date" check via Crustdata; flag if > 18mo old |
| No exit signal | V1 scope: entry only. V2 roadmap: follow-on trigger logic |
| Regulatory (investment advisor) | Disclaim: personal portfolio tool, not registered investment advice |
| Founder data incomplete | Degrade gracefully — score on available signals, flag missing data |

---

## What This Is Not

- "Mirroring" does **not** mean copying deals — it means identifying the same *thesis* at a better price.

---