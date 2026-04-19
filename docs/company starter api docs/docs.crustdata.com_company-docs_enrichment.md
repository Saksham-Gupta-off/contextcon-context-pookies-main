---
url: "https://docs.crustdata.com/company-docs/enrichment"
title: "Company Enrich - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/company-docs/enrichment#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/company-docs/enrichment)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company

Company Enrich

[Documentation](https://docs.crustdata.com/general/introduction) [API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction)

##### Documentation

- [Introduction](https://docs.crustdata.com/general/introduction)
- [Pricing](https://docs.crustdata.com/general/pricing)
- [Rate limits](https://docs.crustdata.com/general/rate-limits)

##### Products

- Company

  - [Quickstart](https://docs.crustdata.com/company-docs/quickstart)
  - [Search](https://docs.crustdata.com/company-docs/search)
  - [Enrich](https://docs.crustdata.com/company-docs/enrichment)
  - [Identify](https://docs.crustdata.com/company-docs/identify)
  - [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete)
  - [Examples](https://docs.crustdata.com/company-docs/examples)
- Person

- Job


close

On this page

- [Rate limits and pricing](https://docs.crustdata.com/company-docs/enrichment#rate-limits-and-pricing)
- [Your first enrichment: look up a company by domain](https://docs.crustdata.com/company-docs/enrichment#your-first-enrichment-look-up-a-company-by-domain)
- [Understanding the response](https://docs.crustdata.com/company-docs/enrichment#understanding-the-response)
- [How to interpret results](https://docs.crustdata.com/company-docs/enrichment#how-to-interpret-results)
- [What is inside company\_data?](https://docs.crustdata.com/company-docs/enrichment#what-is-inside-company_data)
- [Enrich by profile URL](https://docs.crustdata.com/company-docs/enrichment#enrich-by-profile-url)
- [Enrich by company name](https://docs.crustdata.com/company-docs/enrichment#enrich-by-company-name)
- [Enrich by company ID](https://docs.crustdata.com/company-docs/enrichment#enrich-by-company-id)
- [Use exact match for stricter domain matching](https://docs.crustdata.com/company-docs/enrichment#use-exact-match-for-stricter-domain-matching)
- [Enrich multiple companies in one request](https://docs.crustdata.com/company-docs/enrichment#enrich-multiple-companies-in-one-request)
- [Multi-company enrich tips](https://docs.crustdata.com/company-docs/enrichment#multi-company-enrich-tips)
- [Choosing the right identifier](https://docs.crustdata.com/company-docs/enrichment#choosing-the-right-identifier)
- [Common workflow: Search then Enrich](https://docs.crustdata.com/company-docs/enrichment#common-workflow-search-then-enrich)
- [Request parameter reference](https://docs.crustdata.com/company-docs/enrichment#request-parameter-reference)
- [Valid fields values](https://docs.crustdata.com/company-docs/enrichment#valid-fields-values)
- [Response fields reference](https://docs.crustdata.com/company-docs/enrichment#response-fields-reference)
- [Validation rules](https://docs.crustdata.com/company-docs/enrichment#validation-rules)
- [Errors](https://docs.crustdata.com/company-docs/enrichment#errors)
- [No-match behavior](https://docs.crustdata.com/company-docs/enrichment#no-match-behavior)
- [API reference summary](https://docs.crustdata.com/company-docs/enrichment#api-reference-summary)
- [What to do next](https://docs.crustdata.com/company-docs/enrichment#what-to-do-next)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Company](https://docs.crustdata.com/company-docs/quickstart)

# Company Enrich

Copy page

Learn how to enrich company records using domains, profile URLs, names, or IDs, including multi-company requests and exact matching.

Copy page

**Use this when** you already know the company and want its full profile — for research, scoring, personalization, or diligence.The Company Enrich API takes an identifier you already have — a website
domain, a profile URL, a company name, or a Crustdata company ID — and
returns a detailed company profile with headcount, funding, industry, hiring,
and more. The same endpoint supports both single-company lookups and
multi-company requests.Every request goes to the same endpoint:

```
POST https://api.crustdata.com/company/enrich
```

Replace `YOUR_API_KEY` in each example with your actual API key. All
requests require the `x-api-version: 2025-11-01` header.

## [​](https://docs.crustdata.com/company-docs/enrichment\#rate-limits-and-pricing)  Rate limits and pricing

**Current platform behavior** — not specified in the OpenAPI contract:

**Pricing:**`2 credits per record`.

- **Rate limit:** 15 requests per minute.

If you only need lightweight discovery, start with
[Company Search](https://docs.crustdata.com/company-docs/search), then enrich the companies you want in
full detail.

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#your-first-enrichment-look-up-a-company-by-domain)  Your first enrichment: look up a company by domain

The simplest enrichment takes a website domain and returns matching company
profiles. Pass the domain in the `domains` array.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "domains": ["retool.com"]
  }'
```

Response trimmed for clarity.

The `year_founded` field is returned as a string. The format may be a full
date (e.g., `2017-01-01`) or a year string (e.g., `2017`) depending on the
data source.

### [​](https://docs.crustdata.com/company-docs/enrichment\#understanding-the-response)  Understanding the response

The Enrich API returns a **top-level array** — one entry per identifier you
submitted. Each entry has three fields:

- **`matched_on`** — the identifier you submitted (the domain, URL, name, or ID).
- **`match_type`** — which identifier type was used. Possible values: `domain`, `name`, `crustdata_company_id`, `professional_network_profile_url`.
- **`matches`** — an array of candidate companies. Each match includes a `confidence_score` and the full `company_data` object.

Domain lookups may return multiple matches if the domain is ambiguous. The
highest `confidence_score` indicates the best match. Use `exact_match: true`
to restrict results to companies whose `primary_domain` exactly matches your
input (see below).

### [​](https://docs.crustdata.com/company-docs/enrichment\#how-to-interpret-results)  How to interpret results

- **Multiple matches:** If `matches` contains more than one entry, check `confidence_score` — the highest score is the best match. Use `primary_domain` to verify.
- **Empty `matches` array:** The identifier did not match any company. Check for typos or try a different identifier type.
- **`confidence_score`:** Higher is better. A score of `1.0` is common for
direct identifier lookups such as profile URLs or company IDs.

### [​](https://docs.crustdata.com/company-docs/enrichment\#what-is-inside-company_data)  What is inside `company_data`?

The enriched `company_data` object contains the following sections:

| Section | Key fields | Description |
| --- | --- | --- |
| `basic_info` | `name`, `primary_domain`, `website`, `professional_network_url`, `year_founded`, `description`, `company_type`, `employee_count_range`, `industries` | Core identity and classification |
| `headcount` | `total`, `by_role_absolute`, `by_role_percent`, `by_region_absolute`, `growth_percent` | Employee footprint and growth |
| `funding` | `total_investment_usd`, `last_round_amount_usd`, `last_fundraise_date`, `last_round_type`, `investors` | Funding and investor data |
| `locations` | `hq_country`, `hq_state`, `hq_city`, `headquarters` | Headquarters location |
| `taxonomy` | `categories`, `professional_network_industry`, `professional_network_specialities` | Industry and classification data |
| `revenue` | `estimated` (`lower_bound_usd`, `upper_bound_usd`), `public_markets`, `acquisition_status` | Revenue estimates and market data |
| `hiring` | `openings_count`, `openings_growth_percent`, `recent_titles_csv` | Hiring demand and open roles |
| `followers` | `count`, `mom_percent`, `qoq_percent`, `yoy_percent` | Audience and follower metrics |
| `seo` | `total_organic_results`, `monthly_organic_clicks`, `monthly_google_ads_budget` | Search visibility metrics |
| `competitors` | `company_ids`, `websites` | Competitor data |
| `social_profiles` | `twitter_url` and other external profile links | External profiles and links |
| `web_traffic` | `domain_traffic` (`monthly_visitors`, traffic sources) | Website traffic and sources |
| `employee_reviews` | `overall_rating`, `culture_and_values_rating`, `work_life_balance_rating`, `review_count` | Employee review data |
| `people` | `decision_makers`, `founders`, `cxos` | Key people at the company |
| `news` | `article_url`, `article_title`, `article_publish_date` | Recent news articles |
| `software_reviews` | `review_count`, `average_rating` | Software review metrics |
| `status` | `state` (`enriching`, `not_found`) | Enrichment processing status |

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#enrich-by-profile-url)  Enrich by profile URL

If you have a company profile URL, pass it in
`professional_network_profile_urls`. This gives you a direct match.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "professional_network_profile_urls": [\
      "https://www.linkedin.com/company/serverobotics"\
    ]
  }'
```

Response trimmed for clarity.

Profile URL lookups are direct matches — they typically return a single match
with high confidence.

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#enrich-by-company-name)  Enrich by company name

You can also enrich by company name. This is useful when you only have a name from a form submission or event badge scan.

Request

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "names": ["Retool"]
  }'
```

Name-based enrichment may return multiple candidates. Check `confidence_score` and `primary_domain` to pick the right match.

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#enrich-by-company-id)  Enrich by company ID

If you already have a Crustdata company ID (from a previous search call), pass it in `crustdata_company_ids` for an exact lookup.

Request

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "crustdata_company_ids": [633593]
  }'
```

Company ID lookups typically return a single exact match, making this the most precise enrichment method.

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#use-exact-match-for-stricter-domain-matching)  Use exact match for stricter domain matching

By default, domain-based enrichment can return multiple candidates.
Set `exact_match: true` to restrict results to companies whose
`primary_domain` exactly matches your input.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "domains": ["cashfree.com"],
    "exact_match": true
  }'
```

Response trimmed for clarity.

With `exact_match: true`, results are limited to records whose
`primary_domain` exactly matches your input. You may still receive multiple
matches when more than one company record shares that same domain.

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#enrich-multiple-companies-in-one-request)  Enrich multiple companies in one request

The same endpoint supports multiple identifiers in a single request, so
multi-company enrich stays on this page rather than as a separate API.

Request

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "crustdata_company_ids": [633593, 628895]
  }'
```

### [​](https://docs.crustdata.com/company-docs/enrichment\#multi-company-enrich-tips)  Multi-company enrich tips

- Submit **one identifier type** per request. Mixing identifier types (e.g., sending both `domains` and `names`) is not supported.
- Each entry in the response corresponds to the input at the same position, so you can match results back to your input list by index.
- If some identifiers fail to match, their `matches` array will be empty, but the request still succeeds for the others.

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#choosing-the-right-identifier)  Choosing the right identifier

Each identifier type has trade-offs in precision and convenience.

|  | Domain | Profile URL | Company Name | Company ID |
| --- | --- | --- | --- | --- |
| **Precision** | High | Highest | Medium | Highest |
| **Best for** | CRM cleanup, inbound leads | Known company profiles | Fuzzy matching | Internal pipelines and search follow-up |
| **Typical matches** | One or more exact-domain candidates | 1 | Multiple candidates | 1 |

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#common-workflow-search-then-enrich)  Common workflow: Search then Enrich

The most powerful pattern combines [Company Search](https://docs.crustdata.com/company-docs/search) with Company Enrich. Search finds companies matching your criteria; Enrich gets the full profile for each match.**Step 1:** Search for well-funded software companies.

```
curl --request POST \
  --url https://api.crustdata.com/company/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "op": "and",
      "conditions": [\
        {\
          "field": "basic_info.industries",\
          "type": "in",\
          "value": ["Software Development"]\
        },\
        {\
          "field": "funding.total_investment_usd",\
          "type": ">",\
          "value": 10000000\
        }\
      ]
    },
    "limit": 5,
    "fields": ["crustdata_company_id", "basic_info.name", "basic_info.primary_domain"]
  }'
```

**Step 2:** Take the `crustdata_company_id` values from the search results and pass them in `crustdata_company_ids` to enrich.

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "crustdata_company_ids": [633593, 628895]
  }'
```

This two-step pattern is the foundation for sales, research, and investment
workflows. Search narrows the universe; Enrich fills in the details. Because
`crustdata_company_ids` is an array, the same endpoint works for one company
or many companies.

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#request-parameter-reference)  Request parameter reference

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `domains` | string\[\] | Exactly one identifier type required | — | Website domains to enrich. |
| `professional_network_profile_urls` | string\[\] | Exactly one identifier type required | — | Company profile URLs to enrich. |
| `names` | string\[\] | Exactly one identifier type required | — | Company names to enrich. |
| `crustdata_company_ids` | integer\[\] | Exactly one identifier type required | — | Crustdata company IDs to enrich. |
| `fields` | string\[\] | No | All | Specific field groups to include in the response. |
| `exact_match` | boolean | No | `null` | Set to `true` to force exact domain matching. |

**Current platform behavior:** Submit exactly one identifier type per
request.

### [​](https://docs.crustdata.com/company-docs/enrichment\#valid-fields-values)  Valid `fields` values

Use the `fields` parameter to limit which sections are returned in `company_data`. If `fields` is omitted, all sections are returned.

| Field group | What it returns |
| --- | --- |
| `basic_info` | Company name, domain, website, profile URL, industry, type, year founded |
| `headcount` | Employee count, role/region breakdowns, growth metrics |
| `funding` | Total funding, last round details, investor list |
| `locations` | HQ country, state, city, full headquarters address |
| `taxonomy` | Industry, category, and speciality fields |
| `revenue` | Revenue estimates (lower/upper bound), public markets, acquisition status |
| `hiring` | Open job count, hiring growth rate, recent job titles |
| `followers` | Follower count, month-over-month/quarter/year growth |
| `seo` | Organic search results, monthly organic clicks, Google Ads budget |
| `competitors` | Competitor company IDs and websites |
| `social_profiles` | External profile links |
| `web_traffic` | Monthly visitors, traffic source breakdown |
| `employee_reviews` | Overall, culture, and work-life balance ratings |
| `people` | Decision makers, founders, C-level executives |
| `news` | Recent article URLs, titles, and publish dates |
| `software_reviews` | Review count and average rating |
| `status` | Enrichment processing state (enriching, not found) |

## [​](https://docs.crustdata.com/company-docs/enrichment\#response-fields-reference)  Response fields reference

The response is a top-level array. Each item in the array contains:

| Field | Type | Description |
| --- | --- | --- |
| `matched_on` | string | The input identifier you submitted |
| `match_type` | string | `domain`, `name`, `crustdata_company_id`, `professional_network_profile_url` |
| `matches` | array | Array of candidate matches (may be empty for no-match) |
| `matches[].confidence_score` | number | How confident the match is. Higher is better. |
| `matches[].company_data` | object | Full enriched company profile (see table above) |

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#validation-rules)  Validation rules

These rules reflect current platform behavior. See the [API\\
reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) for the formal OpenAPI
contract.

| Rule | Behavior |
| --- | --- |
| One identifier type per request | Submit `domains`, `names`, `crustdata_company_ids`, or `professional_network_profile_urls` — not a mix. Mixing types is not supported. |
| `fields` is optional | Omitting returns all sections. Pass section group names to reduce payload. |
| `exact_match` is optional | Default is `null` (auto-detect). Set `true` for strict domain-only matching. |
| Multi-company requests | You can submit multiple values in one identifier array. Each is matched independently. |

## [​](https://docs.crustdata.com/company-docs/enrichment\#errors)  Errors

### [​](https://docs.crustdata.com/company-docs/enrichment\#no-match-behavior)  No-match behavior

When enriching, each identifier is matched independently:

- **Full match:** All identifiers match — each array entry has populated `matches`.
- **Partial match:** Some identifiers match and others do not. Matched identifiers have `company_data`; unmatched identifiers return an empty `matches: []` array.
- **No match:** All identifiers fail to match. Current platform behavior returns `200 OK` with empty `matches: []` for each array entry.

The OpenAPI spec also defines a `404` response for this endpoint. Current
platform behavior returns `200` with empty `matches`, but integrations
should handle both `200` empty-match and `404` cases.

No match — 200 with empty matches

```
[\
    {\
        "matched_on": "nonexistent-domain.com",\
        "match_type": "domain",\
        "matches": []\
    }\
]
```

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#api-reference-summary)  API reference summary

| Detail | Value |
| --- | --- |
| **Endpoint** | `POST /company/enrich` |
| **Auth** | Bearer token + `x-api-version: 2025-11-01` |
| **Request** | One identifier type: `domains`, `names`, `crustdata_company_ids`, or `professional_network_profile_urls`. Optional: `fields`, `exact_match`. |
| **Response** | Top-level array: `[{ matched_on, match_type, matches: [{ confidence_score, company_data }] }]` |
| **No match** | `200` with empty `matches: []` for unmatched identifiers. The OpenAPI spec also defines `404`; handle both. |
| **Errors** | `400` (bad request), `401` (bad auth), `403` (permission/credits), `404` (per spec), `500` (server error) |

See the [full API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) for the complete OpenAPI schema.

* * *

## [​](https://docs.crustdata.com/company-docs/enrichment\#what-to-do-next)  What to do next

- **Search for companies** — use [Company Search](https://docs.crustdata.com/company-docs/search) to find companies by industry, funding, headcount, and more.
- **Discover filter values** — use [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) to find valid values before building search filters.
- **See more examples** — browse [company examples](https://docs.crustdata.com/company-docs/examples) for ready-to-copy patterns.

Was this page helpful?

YesNo

[Company Search\\
\\
Previous](https://docs.crustdata.com/company-docs/search) [Company Identify\\
\\
Next](https://docs.crustdata.com/company-docs/identify)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.