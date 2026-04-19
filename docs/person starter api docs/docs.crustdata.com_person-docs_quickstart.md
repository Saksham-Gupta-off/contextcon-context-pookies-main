---
url: "https://docs.crustdata.com/person-docs/quickstart"
title: "Person APIs - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/person-docs/quickstart#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/person-docs/quickstart)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Person

Person APIs

[Documentation](https://docs.crustdata.com/general/introduction) [API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction)

##### Documentation

- [Introduction](https://docs.crustdata.com/general/introduction)
- [Pricing](https://docs.crustdata.com/general/pricing)
- [Rate limits](https://docs.crustdata.com/general/rate-limits)

##### Products

- Company

- Person

  - [Quickstart](https://docs.crustdata.com/person-docs/quickstart)
  - [Search](https://docs.crustdata.com/person-docs/search)
  - [Enrichment](https://docs.crustdata.com/person-docs/enrichment)
  - [Autocomplete](https://docs.crustdata.com/person-docs/autocomplete)
  - [Examples](https://docs.crustdata.com/person-docs/examples)
- Job


close

On this page

- [Enterprise live endpoints](https://docs.crustdata.com/person-docs/quickstart#enterprise-live-endpoints)
- [At a glance](https://docs.crustdata.com/person-docs/quickstart#at-a-glance)
- [Before you start](https://docs.crustdata.com/person-docs/quickstart#before-you-start)
- [Quickstart: enrich a person from a profile URL](https://docs.crustdata.com/person-docs/quickstart#quickstart-enrich-a-person-from-a-profile-url)
- [Which API should you start with?](https://docs.crustdata.com/person-docs/quickstart#which-api-should-you-start-with)
- [Common workflows](https://docs.crustdata.com/person-docs/quickstart#common-workflows)
- [Error handling](https://docs.crustdata.com/person-docs/quickstart#error-handling)
- [No-match behavior](https://docs.crustdata.com/person-docs/quickstart#no-match-behavior)
- [Retry guidance](https://docs.crustdata.com/person-docs/quickstart#retry-guidance)
- [Terminology reference](https://docs.crustdata.com/person-docs/quickstart#terminology-reference)
- [Common footguns](https://docs.crustdata.com/person-docs/quickstart#common-footguns)
- [Next steps](https://docs.crustdata.com/person-docs/quickstart#next-steps)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Person](https://docs.crustdata.com/person-docs/quickstart)

# Person APIs

Copy page

Find, enrich, and analyze people with the Crustdata Person APIs.

Copy page

The Person APIs help you answer practical questions about people: Who are the decision-makers at a target company? What does this person’s professional background look like? Can I find people by name, title, location, or employer? Can I enrich a person from a profile URL or business email?Start with the indexed endpoints for most workflows, then use the live endpoints when you need fresh results from the web.

| API | What it does | Best for |
| --- | --- | --- |
| [Search](https://docs.crustdata.com/person-docs/search) | Find people matching structured filters | Prospecting, talent sourcing, market mapping |
| [Enrich](https://docs.crustdata.com/person-docs/enrichment) | Get a detailed profile from a profile URL or email | Outreach prep, due diligence, profile building |
| [Autocomplete](https://docs.crustdata.com/person-docs/autocomplete) | Discover valid field values for search filters | Building filter dropdowns, validating filter inputs |

### [​](https://docs.crustdata.com/person-docs/quickstart\#enterprise-live-endpoints)  Enterprise live endpoints

| API | What it does | Access |
| --- | --- | --- |
| [Live Search 🔒](https://crustdata.com/demo) | Search people in real time from the web | Book a demo |
| [Live Enrich 🔒](https://crustdata.com/demo) | Fetch a fresh person profile from the web | Book a demo |

## [​](https://docs.crustdata.com/person-docs/quickstart\#at-a-glance)  At a glance

|  | Search | Autocomplete | Enrich |
| --- | --- | --- | --- |
| **Endpoint** | `/person/search` | `/person/search/autocomplete` | `/person/enrich` |
| **Data source** | Crustdata indexed | Crustdata indexed | Crustdata indexed |
| **Purpose** | Find people by filters | Discover valid filter values | Get full person profile |
| **Filter syntax** | `{ "field": "dotpath", "type": "op", "value": ... }` | Optional `filters` param | N/A |
| **Pagination** | Cursor-based | — | — |
| **Field selection** | `fields` = dot-paths | — | `fields` = dot-paths or section groups |
| **Error codes** | `400`, `401`, `403`, `500` | `400`, `401`, `500` | `400`, `401`, `403`, `404`, `500` |

* * *

## [​](https://docs.crustdata.com/person-docs/quickstart\#before-you-start)  Before you start

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

## [​](https://docs.crustdata.com/person-docs/quickstart\#quickstart-enrich-a-person-from-a-profile-url)  Quickstart: enrich a person from a profile URL

The fastest way to get started is to enrich a person from their profile URL. This single request returns the full person profile from the Crustdata cache.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "professional_network_profile_urls": [\
      "https://www.linkedin.com/in/abhilashchowdhary"\
    ]
  }'
```

Response trimmed for clarity. The full response can include employment
history, education, skills, contact data, and developer platform profiles.

The response is an array — one entry per identifier you submitted:

- **`matched_on`** — the input you sent (for example, `https://www.linkedin.com/in/abhilashchowdhary`).
- **`match_type`** — which identifier type was used (`professional_network_profile_url` or `business_email`).
- **`confidence_score`** — how confident the match is (`1.0` = exact match).
- **`person_data`** — the full person profile, including `basic_profile`, `experience`, `education`, `skills`, `contact`, `social_handles`, and more.

* * *

## [​](https://docs.crustdata.com/person-docs/quickstart\#which-api-should-you-start-with)  Which API should you start with?

| If you want to… | Start with |
| --- | --- |
| Find people by name, title, company, or location | [Search](https://docs.crustdata.com/person-docs/search) |
| Get full profile details for a known profile URL | [Enrich](https://docs.crustdata.com/person-docs/enrichment) |
| Reverse-lookup a person from a business email | [Enrich](https://docs.crustdata.com/person-docs/enrichment) |
| Discover valid filter values before building search queries | [Autocomplete](https://docs.crustdata.com/person-docs/autocomplete) |
| Build a list of decision-makers at target companies | [Search](https://docs.crustdata.com/person-docs/search) |
| Search people in real time from the web | [Live Search 🔒](https://crustdata.com/demo) |
| Fetch fresh profile data from the web | [Live Enrich 🔒](https://crustdata.com/demo) |

## [​](https://docs.crustdata.com/person-docs/quickstart\#common-workflows)  Common workflows

1. **Discovery** — Start with [Autocomplete](https://docs.crustdata.com/person-docs/autocomplete) to find valid filter values (e.g., title variations), then [Search](https://docs.crustdata.com/person-docs/search) to build your list, then [Enrich](https://docs.crustdata.com/person-docs/enrichment) the top matches for full profiles.
2. **Data cleanup** — Use [Enrich](https://docs.crustdata.com/person-docs/enrichment) with `business_emails` to resolve person profiles and fill in missing professional context from CRM imports.
3. **Lead routing** — [Enrich](https://docs.crustdata.com/person-docs/enrichment) incoming profile URLs to get a stable person profile, then [Search](https://docs.crustdata.com/person-docs/search) for similar people at the same company or with the same title.

* * *

## [​](https://docs.crustdata.com/person-docs/quickstart\#error-handling)  Error handling

All Person API endpoints return structured errors. The exact status codes vary by endpoint:

| Status | Meaning | Applies to |
| --- | --- | --- |
| `400` | Invalid request (bad field, wrong operator, malformed filters) | All endpoints |
| `401` | Invalid or missing API key | All endpoints |
| `403` | Permission denied or insufficient credits | Search, Enrich |
| `404` | No data found (per spec) | Enrich |
| `500` | Internal server error | All endpoints |

Error response format:

```
{
    "error": {
        "type": "invalid_request",
        "message": "Unsupported filter field: 'current_title'. Supported fields: ['basic_profile.name', 'basic_profile.headline', ...]",
        "metadata": []
    }
}
```

For `401`, the format is simpler: `{"message": "Invalid API key in request"}`.

### [​](https://docs.crustdata.com/person-docs/quickstart\#no-match-behavior)  No-match behavior

| Endpoint | No matches found | Action |
| --- | --- | --- |
| Search | `200` with empty `profiles: []` | Broaden filters or check with Autocomplete |
| Enrich | `200` with empty `matches: []` | Try a different identifier type |
| Autocomplete | `200` with empty `suggestions: []` | Try a broader query |

The OpenAPI spec defines `404` for Enrich, but current behavior typically
returns `200` with empty `matches`. Handle both.

### [​](https://docs.crustdata.com/person-docs/quickstart\#retry-guidance)  Retry guidance

| Status | Retry? | Action |
| --- | --- | --- |
| `400` | No | Fix the request |
| `401` | No | Check API key |
| `403` | No | Check permissions/credits |
| `404` | No | Try different identifier |
| `500` | Yes | Exponential backoff (1s, 2s, 4s) |

* * *

## [​](https://docs.crustdata.com/person-docs/quickstart\#terminology-reference)  Terminology reference

These are the most common terms used across the Person APIs:

| You say | API request field | Used in |
| --- | --- | --- |
| Profile URL | `professional_network_profile_urls` | Enrich |
| Business email | `business_emails` | Enrich |
| Person name | `basic_profile.name` (filter field) | Search, Autocomplete |
| Job title | `experience.employment_details.current.title` (filter field) | Search, Autocomplete |
| Current company | `experience.employment_details.current.company_name` (filter field) | Search, Autocomplete |
| Headline | `basic_profile.headline` (filter field) | Search, Autocomplete |
| Location | `basic_profile.location` (filter field) | Search |

Search uses dot-path field names like
`experience.employment_details.current.title`. Use Autocomplete to discover
exact values for indexed Search filters before you build queries.

* * *

## [​](https://docs.crustdata.com/person-docs/quickstart\#common-footguns)  Common footguns

| Mistake | Fix |
| --- | --- |
| Using `column` in Search filters | The correct key is `field` (e.g., `"field": "basic_profile.name"`). |
| Mixing identifier types in Enrich | Send one type per request: either `professional_network_profile_urls` or `business_emails`. |
| Using `current_title` as a filter field in Search | Use the full dot-path: `experience.employment_details.current.title`. |
| Omitting `fields` in Search | Returns all fields per person — very large payloads. Always specify `fields` in production. |
| Expecting `results` wrapper in Enrich response | Enrich returns a top-level array, not `{ "results": [...] }`. |

* * *

## [​](https://docs.crustdata.com/person-docs/quickstart\#next-steps)  Next steps

- [Person Search](https://docs.crustdata.com/person-docs/search) — find people by name, title, company, location, and more with advanced filters.
- [Person Autocomplete](https://docs.crustdata.com/person-docs/autocomplete) — discover valid filter values before building queries.
- [Person Enrich](https://docs.crustdata.com/person-docs/enrichment) — get detailed profiles from profile URLs or business emails, with batch support.
- [Live Search 🔒](https://crustdata.com/demo) — search people in real time from the web.
- [Live Enrich 🔒](https://crustdata.com/demo) — fetch a fresh person profile from the web.
- [Person Examples](https://docs.crustdata.com/person-docs/examples) — ready-to-copy workflow patterns.

Was this page helpful?

YesNo

[Company Examples\\
\\
Previous](https://docs.crustdata.com/company-docs/examples) [Person Search\\
\\
Next](https://docs.crustdata.com/person-docs/search)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.