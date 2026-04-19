---
url: "https://docs.crustdata.com/company-docs/search"
title: "Company Search - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/company-docs/search#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/company-docs/search)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company

Company Search

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

- [Request body](https://docs.crustdata.com/company-docs/search#request-body)
- [Response body](https://docs.crustdata.com/company-docs/search#response-body)
- [Rate limits and credits](https://docs.crustdata.com/company-docs/search#rate-limits-and-credits)
- [Your first search: find a company by domain](https://docs.crustdata.com/company-docs/search#your-first-search-find-a-company-by-domain)
- [Understanding the response](https://docs.crustdata.com/company-docs/search#understanding-the-response)
- [How to interpret results](https://docs.crustdata.com/company-docs/search#how-to-interpret-results)
- [Controlling which fields come back](https://docs.crustdata.com/company-docs/search#controlling-which-fields-come-back)
- [Combine filters with and](https://docs.crustdata.com/company-docs/search#combine-filters-with-and)
- [Use or and nested logic](https://docs.crustdata.com/company-docs/search#use-or-and-nested-logic)
- [Find well-funded companies in a country](https://docs.crustdata.com/company-docs/search#find-well-funded-companies-in-a-country)
- [How sorts work](https://docs.crustdata.com/company-docs/search#how-sorts-work)
- [Find recently founded companies](https://docs.crustdata.com/company-docs/search#find-recently-founded-companies)
- [Paginate through results](https://docs.crustdata.com/company-docs/search#paginate-through-results)
- [Filter operator reference](https://docs.crustdata.com/company-docs/search#filter-operator-reference)
- [Searchable fields](https://docs.crustdata.com/company-docs/search#searchable-fields)
- [Response fields](https://docs.crustdata.com/company-docs/search#response-fields)
- [Validation rules](https://docs.crustdata.com/company-docs/search#validation-rules)
- [Errors](https://docs.crustdata.com/company-docs/search#errors)
- [API reference summary](https://docs.crustdata.com/company-docs/search#api-reference-summary)
- [What to do next](https://docs.crustdata.com/company-docs/search#what-to-do-next)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Company](https://docs.crustdata.com/company-docs/quickstart)

# Company Search

Copy page

Learn how to search for companies using structured filters, from simple domain lookups to advanced multi-filter queries with sorting and pagination.

Copy page

**Use this when** you want to explore a market, build a target account list, or segment companies by criteria like geography, industry, funding, or headcount.The Company Search API lets you find companies by domain, country, industry, funding, headcount, and more. This page walks you through the API step by step, starting with the simplest possible request and building up to advanced queries.Every request goes to the same endpoint:

```
POST https://api.crustdata.com/company/search
```

Replace `YOUR_API_KEY` in each example with your actual API key. All
requests require the `x-api-version: 2025-11-01` header.

### [​](https://docs.crustdata.com/company-docs/search\#request-body)  Request body

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `filters` | object | No | — | A single filter condition or a nested `and`/`or` group. Omit to match all companies. |
| `fields` | string\[\] | No | all fields | Dot-path fields to include in each company object. Always specify in production. |
| `sorts` | object\[\] | No | — | Sort rules. Each has `column` (field path) and `order` (`asc` or `desc`). |
| `limit` | integer | No | `20` | Companies per page. Max: `1000`. |
| `cursor` | string | No | — | Pagination cursor from a previous response. |

### [​](https://docs.crustdata.com/company-docs/search\#response-body)  Response body

| Field | Type | Description |
| --- | --- | --- |
| `companies` | array | Matching company records with requested `fields`. |
| `next_cursor` | string or null | Cursor for the next page. `null` when no more pages. |
| `total_count` | integer or null | Total matching companies (may be `null` for broad queries). |

### [​](https://docs.crustdata.com/company-docs/search\#rate-limits-and-credits)  Rate limits and credits

**Current platform behavior** — not specified in the OpenAPI contract:

**Pricing:**`0.03 credits per result returned`. A
request with no results does not consume credits.

- **Rate limit:** 15 requests per minute.

Search results are intentionally lightweight so you can explore and segment
companies at a low credit cost. When you need the full company profile, use
[Company Enrich](https://docs.crustdata.com/company-docs/enrichment).

* * *

## [​](https://docs.crustdata.com/company-docs/search\#your-first-search-find-a-company-by-domain)  Your first search: find a company by domain

The simplest search finds a company by its exact primary domain. You pass a single filter with the `=` operator.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "basic_info.primary_domain",
      "type": "=",
      "value": "retool.com"
    },
    "limit": 1,
    "fields": [\
      "crustdata_company_id",\
      "basic_info.name",\
      "basic_info.primary_domain",\
      "basic_info.year_founded",\
      "headcount.total",\
      "locations.hq_country",\
      "funding.total_investment_usd"\
    ]
  }'
```

### [​](https://docs.crustdata.com/company-docs/search\#understanding-the-response)  Understanding the response

Every search response has three fields:

- **`companies`** — an array of matching company records. Each record contains the fields you requested in `fields`.
- **`next_cursor`** — a pagination token. Pass it in the next request to get the next page. `null` means there are no more pages.
- **`total_count`** — how many companies match your filters across the full database (may be `null` for very broad queries).

### [​](https://docs.crustdata.com/company-docs/search\#how-to-interpret-results)  How to interpret results

- **`next_cursor` is `null`:** You have reached the last page. No more results.
- **`total_count` is `null`:** The exact count is too expensive to compute for this query. Use `next_cursor` to determine if more pages exist.
- **Empty `companies` array:** No companies matched your filters. Broaden your filters or check values with [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete).

### [​](https://docs.crustdata.com/company-docs/search\#controlling-which-fields-come-back)  Controlling which fields come back

The `fields` parameter lets you pick exactly which fields to include. This keeps your responses small and focused. If you omit `fields`, the API returns all available fields for each company.

* * *

## [​](https://docs.crustdata.com/company-docs/search\#combine-filters-with-and)  Combine filters with `and`

Real searches need more than one criterion. Wrap multiple conditions inside an `op: "and"` group to require all of them.This search finds software development companies headquartered in the USA, sorted by headcount (largest first).

Request

Response

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
          "field": "taxonomy.professional_network_industry",\
          "type": "=",\
          "value": "Software Development"\
        },\
        {\
          "field": "locations.hq_country",\
          "type": "in",\
          "value": ["USA"]\
        }\
      ]
    },
    "sorts": [{"column": "headcount.total", "order": "desc"}],
    "limit": 2,
    "fields": [\
      "crustdata_company_id",\
      "basic_info.name",\
      "basic_info.primary_domain",\
      "headcount.total",\
      "locations.hq_country"\
    ]
  }'
```

Response trimmed for clarity.

The key difference from the first example: instead of a single `filters` object, you now have a group with `op: "and"` and a `conditions` array. Every condition must match for a company to be included.

* * *

## [​](https://docs.crustdata.com/company-docs/search\#use-or-and-nested-logic)  Use `or` and nested logic

Use `op: "or"` when a company should match **any** condition. You can also nest `and`/`or` groups for complex queries.This search finds companies that are either in the software development
industry or have over $5M in total investment, AND are headquartered in the
USA.

Request

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
          "op": "or",\
          "conditions": [\
            {\
              "field": "taxonomy.professional_network_industry",\
              "type": "=",\
              "value": "Software Development"\
            },\
            {\
              "field": "funding.total_investment_usd",\
              "type": ">",\
              "value": 5000000\
            }\
          ]\
        },\
        {\
          "field": "locations.hq_country",\
          "type": "=",\
          "value": "USA"\
        }\
      ]
    },
    "sorts": [{"column": "headcount.total", "order": "desc"}],
    "limit": 2,
    "fields": [\
      "crustdata_company_id",\
      "basic_info.name",\
      "headcount.total",\
      "taxonomy.professional_network_industry",\
      "funding.total_investment_usd"\
    ]
  }'
```

The outer `and` requires both conditions: the inner `or` matches either
software development companies or well-funded companies, and the outer
condition restricts to US-headquartered companies.

* * *

## [​](https://docs.crustdata.com/company-docs/search\#find-well-funded-companies-in-a-country)  Find well-funded companies in a country

This is a common pattern for sales and investor research: find companies in a specific market with significant funding. This search finds US-based companies with over $10M in total investment, sorted by funding (highest first).

Request

Response

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
          "field": "locations.hq_country",\
          "type": "in",\
          "value": ["USA"]\
        },\
        {\
          "field": "funding.total_investment_usd",\
          "type": ">",\
          "value": 10000000\
        }\
      ]
    },
    "sorts": [{"column": "funding.total_investment_usd", "order": "desc"}],
    "limit": 2,
    "fields": [\
      "crustdata_company_id",\
      "basic_info.name",\
      "basic_info.primary_domain",\
      "locations.hq_country",\
      "funding.total_investment_usd",\
      "headcount.total"\
    ]
  }'
```

Response trimmed for clarity.

### [​](https://docs.crustdata.com/company-docs/search\#how-sorts-work)  How sorts work

The `sorts` parameter orders your results. Each sort rule needs:

- **`column`** — a dot-path field (e.g., `funding.total_investment_usd`, `headcount.total`, `basic_info.name`).
- **`order`** — either `asc` (ascending) or `desc` (descending).

You can provide multiple sort rules. The API applies them in order.

* * *

## [​](https://docs.crustdata.com/company-docs/search\#find-recently-founded-companies)  Find recently founded companies

Use comparison operators like `>` and `<` on numeric or date fields. This search finds companies founded after 2020, sorted by headcount.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "basic_info.year_founded",
      "type": ">",
      "value": 2020
    },
    "sorts": [{"column": "headcount.total", "order": "desc"}],
    "limit": 2,
    "fields": [\
      "crustdata_company_id",\
      "basic_info.name",\
      "basic_info.year_founded",\
      "headcount.total",\
      "locations.hq_country"\
    ]
  }'
```

Response trimmed for clarity.

* * *

## [​](https://docs.crustdata.com/company-docs/search\#paginate-through-results)  Paginate through results

When your search matches more companies than your `limit`, use cursor-based pagination to walk through all pages.**First page:** send your normal search request.

First page

```
curl --request POST \
  --url https://api.crustdata.com/company/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "locations.hq_country",
      "type": "in",
      "value": ["USA"]
    },
    "sorts": [{"column": "crustdata_company_id", "order": "asc"}],
    "limit": 100,
    "fields": [\
      "crustdata_company_id",\
      "basic_info.name",\
      "basic_info.primary_domain"\
    ]
  }'
```

**Next page:** take the `next_cursor` value from the response and pass it in your next request. Keep the same `filters`, `sorts`, `limit`, and `fields`.

Next page

```
curl --request POST \
  --url https://api.crustdata.com/company/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "locations.hq_country",
      "type": "in",
      "value": ["USA"]
    },
    "sorts": [{"column": "crustdata_company_id", "order": "asc"}],
    "limit": 100,
    "fields": [\
      "crustdata_company_id",\
      "basic_info.name",\
      "basic_info.primary_domain"\
    ],
    "cursor": "PASTE_NEXT_CURSOR_VALUE_HERE"
  }'
```

Continue until `next_cursor` is `null`, which means you have reached the last page.

* * *

## [​](https://docs.crustdata.com/company-docs/search\#filter-operator-reference)  Filter operator reference

| Operator | Meaning | Example value | Notes |
| --- | --- | --- | --- |
| `=` | Exact match | `"retool.com"` | Case-insensitive for text fields |
| `!=` | Not equal | `"acquired"` |  |
| `>` | Greater than | `2020` | Numbers and date strings |
| `<` | Less than | `10000` | Numbers and date strings |
| `=>` | Greater than or equal | `"2024-01-01"` | **Not**`>=` |
| `=<` | Less than or equal | `50000000` | **Not**`<=` |
| `in` | Value is in list | `["USA", "GBR"]` | Case-sensitive. Matches if **any** array element matches **any** list value. |
| `not_in` | Value is not in list | `["acquired"]` |  |
| `is_null` | Field is null | — | No `value` needed |
| `is_not_null` | Field is not null | — | No `value` needed |
| `(.)` | Fuzzy text search | `"openai"` | Tolerates typos, matches word variants |
| `[.]` | Exact token match | `"Software Development"` | No typos allowed, requires exact tokens |

The operators `>=` and `<=` are **not supported**. Use `=>` and `=<` instead.

## [​](https://docs.crustdata.com/company-docs/search\#searchable-fields)  Searchable fields

These are common fields that can be used in the `field` key of a filter condition. Some indexed filter fields are search-only and are not returned in the response payload. For the full schema, see the [API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction).

| Field | Type | Sortable | Description |
| --- | --- | --- | --- |
| `crustdata_company_id` | integer | Yes | Crustdata company ID |
| `metadata.growth_calculation_date` | datetime | Yes | Anchor date for growth metrics |
| `basic_info.company_id` | integer | Yes | Internal source company ID |
| `basic_info.name` | string | Yes | Company name |
| `basic_info.primary_domain` | string | Yes | Primary website domain |
| `basic_info.website` | string | No | Full website URL |
| `basic_info.professional_network_url` | string | No | Company profile URL |
| `basic_info.professional_network_id` | string | No | Company profile ID |
| `basic_info.company_type` | string | No | e.g., `"Privately Held"`, `"Public Company"` |
| `basic_info.year_founded` | string | Yes | Year founded (string, e.g., `"2017"`) |
| `basic_info.employee_count_range` | string | Yes | e.g., `"201-500"` |
| `basic_info.markets` | string\[\] | No | Market tags |
| `basic_info.industries` | string\[\] | No | Industry tags |
| `revenue.estimated.lower_bound_usd` | integer | Yes | Revenue lower bound (USD) |
| `revenue.estimated.upper_bound_usd` | integer | Yes | Revenue upper bound (USD) |
| `revenue.acquisition_status` | string | No | e.g., `"acquired"` |
| `funding.total_investment_usd` | number | Yes | Total disclosed funding (USD) |
| `funding.last_round_amount_usd` | number | Yes | Last funding round amount (USD) |
| `funding.last_fundraise_date` | date | Yes | Last funding date |
| `funding.last_round_type` | string | No | e.g., `"series_a"`, `"series_b"` |
| `funding.investors` | string\[\] | No | Investor names |
| `funding.tracxn_investors` | string\[\] | No | Indexed investor names for filtering only |
| `headcount.total` | integer | Yes | Total employee count |
| `roles.distribution` | object | No | Employee counts per role |
| `roles.growth_6m` | object | No | 6-month role growth |
| `roles.growth_yoy` | object | No | Year-over-year role growth |
| `locations.hq_country` | string | Yes | HQ country (ISO3: `"USA"`, `"GBR"`) |
| `locations.largest_headcount_country` | string | Yes | Country with most employees |
| `locations.headquarters` | string | No | Full HQ location string |
| `taxonomy.professional_network_industry` | string | No | Primary industry label |
| `taxonomy.categories` | string\[\] | No | Category tags |
| `followers.count` | integer | Yes | Follower count |
| `followers.mom_percent` | number | No | Month-over-month follower growth % |
| `followers.qoq_percent` | number | No | Quarter-over-quarter follower growth % |
| `followers.six_months_growth_percent` | number | No | 6-month follower growth % |
| `followers.yoy_percent` | number | No | Year-over-year follower growth % |
| `competitors.company_ids` | integer\[\] | No | Competitor Crustdata IDs |
| `competitors.websites` | string\[\] | No | Competitor domains |

Use [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) to discover exact values for
fields like `basic_info.industries`,
`taxonomy.professional_network_industry`, `locations.hq_country`,
`basic_info.company_type`, and `funding.last_round_type`.

## [​](https://docs.crustdata.com/company-docs/search\#response-fields)  Response fields

Each company in the response can include these sections (depending on `fields`):

| Section | Key fields | Description |
| --- | --- | --- |
| `basic_info` | `name`, `primary_domain`, `website`, `professional_network_url`, `year_founded` | Core identity and profile |
| `headcount` | `total` | Employee footprint |
| `funding` | `total_investment_usd`, `last_round_amount_usd`, `investors` | Funding and investor data |
| `locations` | `hq_country`, `hq_state`, `hq_city` | Headquarters location |
| `taxonomy` | `professional_network_industry`, `categories`, `professional_network_specialities` | Industry and category tags |
| `revenue` | `estimated`, `public_markets`, `acquisition_status` | Revenue and market data |
| `hiring` | `openings_count`, `openings_growth_percent` | Hiring demand |
| `followers` | `count`, `mom_percent`, `yoy_percent` | Social follower metrics |
| `social_profiles` | `twitter_url` | Third-party profile links |

* * *

## [​](https://docs.crustdata.com/company-docs/search\#validation-rules)  Validation rules

Default/max limits and pagination behavior reflect current platform
behavior. See the [API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction)
for the formal OpenAPI contract.

| Rule | Behavior |
| --- | --- |
| `filters` is optional | Omitting filters matches all companies. Always use filters in production to control cost. |
| `fields` is optional | Omitting returns all fields (large payload). Always specify in production. |
| `limit` range | 1–1000. Default: 20. |
| `sorts` with pagination | Always include `sorts` when paginating to ensure stable result ordering. |
| `cursor` must match query | Changing `filters`, `sorts`, or `fields` between pages invalidates the cursor. |

## [​](https://docs.crustdata.com/company-docs/search\#errors)  Errors

Common error responses for Search:

400 — Unsupported field

```
{
    "error": {
        "type": "invalid_request",
        "message": "Unsupported columns in conditions: ['nonexistent_field']",
        "metadata": []
    }
}
```

400 — Invalid operator

```
{
    "error": {
        "type": "invalid_request",
        "message": "'filters.type' must be one of the supported operators. Got '>='.",
        "metadata": []
    }
}
```

Use `=>` for greater-than-or-equal and `=<` for less-than-or-equal. The operators `>=` and `<=` are not supported.

401 — Invalid API key

```
{
    "message": "Invalid API key in request"
}
```

* * *

## [​](https://docs.crustdata.com/company-docs/search\#api-reference-summary)  API reference summary

| Detail | Value |
| --- | --- |
| **Endpoint** | `POST /company/search` |
| **Auth** | Bearer token + `x-api-version: 2025-11-01` |
| **Request** | `filters` (condition or group), `fields`, `sorts`, `limit`, `cursor` |
| **Response** | `{ companies, next_cursor, total_count }` |
| **Pagination** | Cursor-based. Pass `next_cursor` in `cursor`. `null` = last page. |
| **Empty result** | `200` with `"companies": []` |
| **Errors** | `400` (bad field/operator), `401` (bad auth), `403` (permission/credits), `500` (server error) |

See the [full API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) for the complete OpenAPI schema.

* * *

## [​](https://docs.crustdata.com/company-docs/search\#what-to-do-next)  What to do next

- **Enrich a company** — use [Company Enrich](https://docs.crustdata.com/company-docs/enrichment) to get a detailed profile for a known company.
- **Discover filter values** — use [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) to find valid values before building search filters.
- **See more examples** — browse [company examples](https://docs.crustdata.com/company-docs/examples) for ready-to-copy patterns.

Was this page helpful?

YesNo

[Company APIs\\
\\
Previous](https://docs.crustdata.com/company-docs/quickstart) [Company Enrich\\
\\
Next](https://docs.crustdata.com/company-docs/enrichment)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.