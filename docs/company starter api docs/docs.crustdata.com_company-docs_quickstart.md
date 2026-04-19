---
url: "https://docs.crustdata.com/company-docs/quickstart"
title: "Company APIs - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/company-docs/quickstart#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/company-docs/quickstart)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company

Company APIs

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

- [At a glance](https://docs.crustdata.com/company-docs/quickstart#at-a-glance)
- [Before you start](https://docs.crustdata.com/company-docs/quickstart#before-you-start)
- [Quickstart: enrich a company from a domain](https://docs.crustdata.com/company-docs/quickstart#quickstart-enrich-a-company-from-a-domain)
- [Which API should you start with?](https://docs.crustdata.com/company-docs/quickstart#which-api-should-you-start-with)
- [Common workflows](https://docs.crustdata.com/company-docs/quickstart#common-workflows)
- [Error handling](https://docs.crustdata.com/company-docs/quickstart#error-handling)
- [Terminology reference](https://docs.crustdata.com/company-docs/quickstart#terminology-reference)
- [Company ID fields](https://docs.crustdata.com/company-docs/quickstart#company-id-fields)
- [Common footguns](https://docs.crustdata.com/company-docs/quickstart#common-footguns)
- [Shared guidance](https://docs.crustdata.com/company-docs/quickstart#shared-guidance)
- [Next steps](https://docs.crustdata.com/company-docs/quickstart#next-steps)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Company](https://docs.crustdata.com/company-docs/quickstart)

# Company APIs

Copy page

Find, enrich, and analyze company records with the Crustdata Company APIs.

Copy page

The Company APIs help you answer practical business questions: Which companies match your target market? What does this company look like before outreach? What are the valid filter values for my search?There are four core endpoints, each designed for a different step in your workflow.

| API | What it does | Best for |
| --- | --- | --- |
| [Search](https://docs.crustdata.com/company-docs/search) | Find companies matching structured filters | Building lists, market scans, segmentation |
| [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) | Discover valid field values for search filters | Building filter dropdowns, validating filter inputs |
| [Enrich](https://docs.crustdata.com/company-docs/enrichment) | Get a detailed company profile from a known identifier | Research, scoring, personalization |
| [Identify](https://docs.crustdata.com/company-docs/identify) | Resolve a company from partial info (name, domain, URL, ID) | CRM deduplication, lead routing, entity resolution |

## [​](https://docs.crustdata.com/company-docs/quickstart\#at-a-glance)  At a glance

|  | Search | Autocomplete | Enrich | Identify |
| --- | --- | --- | --- | --- |
| **Endpoint** | `/company/search` | `/company/search/autocomplete` | `/company/enrich` | `/company/identify` |
| **Data source** | Crustdata indexed | Crustdata indexed | Crustdata indexed | Crustdata indexed |
| **Purpose** | Find companies by filters | Discover valid filter values | Get full company profile | Match partial info to a company |
| **Filter syntax** | `{ "field": "dotpath", "type": "op", "value": ... }` | Optional `filters` param | N/A | N/A |
| **Pagination** | Cursor-based | — | — | — |
| **Field selection** | `fields` = dot-paths or sections | — | `fields` = dot-paths or sections | `fields` = dot-paths or sections |
| **Error codes** | `400`, `401`, `403`, `500` | `400`, `401`, `500` | `400`, `401`, `403`, `500` | `400`, `401`, `403`, `500` |

* * *

## [​](https://docs.crustdata.com/company-docs/quickstart\#before-you-start)  Before you start

You need:

- A Crustdata API key
- A terminal with `curl` (or any HTTP client)
- The required header: `x-api-version: 2025-11-01`

All requests use **Bearer token authentication** and require the API version header:

```
--header 'authorization: Bearer YOUR_API_KEY'
--header 'x-api-version: 2025-11-01'
```

Replace `YOUR_API_KEY` in each example with your actual API key.

**Convention used in these docs:** Information labeled “OpenAPI contract”
reflects the formal API specification. Information labeled “Current platform
behavior” (such as rate limits, credit costs, and max page ranges) describes
observed behavior that may change. See the [API\\
reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) for the formal OpenAPI
spec.

* * *

## [​](https://docs.crustdata.com/company-docs/quickstart\#quickstart-enrich-a-company-from-a-domain)  Quickstart: enrich a company from a domain

The fastest way to get started is to enrich a company from its website domain. This single request returns the full company profile.

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

Response trimmed for clarity. The full response includes headcount, funding,
hiring, competitors, and more.

The response is an object with a `results` array — one entry per identifier you submitted:

- **`matched_on`** — the input you sent (`retool.com`).
- **`match_type`** — which identifier type was used (`domain`, `name`, `crustdata_company_id`, or `professional_network_profile_url`).
- **`confidence_score`** — how confident the match is (`1.0` = exact match).
- **`company_data`** — the full company profile, including `basic_info`, `headcount`, `funding`, `locations`, `taxonomy`, and more.

* * *

## [​](https://docs.crustdata.com/company-docs/quickstart\#which-api-should-you-start-with)  Which API should you start with?

| If you want to… | Start with |
| --- | --- |
| Build a target account list by geography, industry, or funding | [Search](https://docs.crustdata.com/company-docs/search) |
| Discover valid filter values before building search queries | [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) |
| Get richer context for scoring, prioritization, or diligence | [Enrich](https://docs.crustdata.com/company-docs/enrichment) |

## [​](https://docs.crustdata.com/company-docs/quickstart\#common-workflows)  Common workflows

1. **Discovery** — Start with [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) to find valid filter values, then [Search](https://docs.crustdata.com/company-docs/search) to build your list, then [Enrich](https://docs.crustdata.com/company-docs/enrichment) the top matches for full profiles.
2. **Data cleanup** — Use [Enrich](https://docs.crustdata.com/company-docs/enrichment) with a domain to resolve ambiguous records from CRM imports.
3. **Lead routing** — [Enrich](https://docs.crustdata.com/company-docs/enrichment) incoming domains to get a stable company ID and industry, then [Search](https://docs.crustdata.com/company-docs/search) for similar companies.

* * *

## [​](https://docs.crustdata.com/company-docs/quickstart\#error-handling)  Error handling

All Company API endpoints return structured errors. The exact status codes vary by endpoint:

| Status | Meaning | Applies to |
| --- | --- | --- |
| `400` | Invalid request (bad field, wrong operator, malformed filters) | All endpoints |
| `401` | Invalid or missing API key | All endpoints |
| `403` | Permission denied or insufficient credits | Search, Enrich, Identify |
| `500` | Internal server error | All endpoints |

Error response format:

```
{
    "error": {
        "type": "invalid_request",
        "message": "Unsupported columns in conditions: ['nonexistent_field']",
        "metadata": []
    }
}
```

For `401`, the format is simpler: `{"message": "Invalid API key in request"}`.

* * *

## [​](https://docs.crustdata.com/company-docs/quickstart\#terminology-reference)  Terminology reference

These are the most common terms used across the Company APIs:

| You say | API request field | Used in |
| --- | --- | --- |
| Company domain | `domains` | Enrich, Identify |
| Company name | `names` | Enrich, Identify |
| Company ID | `crustdata_company_ids` | Enrich, Identify |
| HQ country | `locations.hq_country` (ISO3: `"USA"`, `"GBR"`) | Search |
| Industry | `taxonomy.professional_network_industry` or `basic_info.industries` | Search |
| Employee count | `headcount.total` | Search |
| Total funding | `funding.total_investment_usd` | Search |

Search uses ISO3 country codes (`"USA"`, `"GBR"`). Use
[Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) to discover exact values for
indexed Search filters.

### [​](https://docs.crustdata.com/company-docs/quickstart\#company-id-fields)  Company ID fields

The company data model includes two ID fields:

| Field | Meaning | When to use |
| --- | --- | --- |
| `crustdata_company_id` | Stable Crustdata company identifier. Appears at the top level of search results and inside `company_data`. | Use this for Search → Enrich workflows. Pass it in `crustdata_company_ids` when calling Enrich. |
| `basic_info.company_id` | Internal source company identifier. May match `crustdata_company_id` but is not guaranteed to. | Generally, prefer `crustdata_company_id` for cross-API workflows. |

* * *

## [​](https://docs.crustdata.com/company-docs/quickstart\#common-footguns)  Common footguns

| Mistake | Fix |
| --- | --- |
| Using `"United States"` in Search | Search uses ISO3 codes: `"USA"`, `"GBR"`. Use [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) to discover exact values. |
| Using `>=` or `<=` operators in Search | Use `=>` and `=<` instead. |
| Mixing identifier types in Enrich | Send one type per request: `domains`, `names`, `crustdata_company_ids`, or `professional_network_profile_urls`. |
| Confusing Search `fields` with Enrich `fields` | Search `fields` are dot-path response fields (e.g., `basic_info.name`). Enrich `fields` are section groups (e.g., `basic_info`). |
| Omitting `fields` in Search | Returns all fields per company — very large payloads. Always specify `fields` in production. |

## [​](https://docs.crustdata.com/company-docs/quickstart\#shared-guidance)  Shared guidance

Use the endpoint pages for request/response details and no-match behavior.
For pricing, see [Pricing](https://docs.crustdata.com/general/pricing). For rate-limit guidance, see
[Rate limits](https://docs.crustdata.com/general/rate-limits).

* * *

## [​](https://docs.crustdata.com/company-docs/quickstart\#next-steps)  Next steps

- [Company Search](https://docs.crustdata.com/company-docs/search) — find companies by domain, industry, funding, headcount, and more.
- [Company Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) — discover valid filter values before building queries.
- [Company Enrich](https://docs.crustdata.com/company-docs/enrichment) — get detailed profiles with headcount, funding, hiring, and competitors.
- [Company Identify](https://docs.crustdata.com/company-docs/identify) — resolve partial company info to a known entity.
- [Company Examples](https://docs.crustdata.com/company-docs/examples) — ready-to-copy patterns for common use cases.

Was this page helpful?

YesNo

[Rate limits\\
\\
Previous](https://docs.crustdata.com/general/rate-limits) [Company Search\\
\\
Next](https://docs.crustdata.com/company-docs/search)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.