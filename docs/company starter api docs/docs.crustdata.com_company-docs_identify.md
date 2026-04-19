---
url: "https://docs.crustdata.com/company-docs/identify"
title: "Company Identify - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/company-docs/identify#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/company-docs/identify)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company

Company Identify

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

- [Rate limits and pricing](https://docs.crustdata.com/company-docs/identify#rate-limits-and-pricing)
- [Identify by domain](https://docs.crustdata.com/company-docs/identify#identify-by-domain)
- [Identify by company name](https://docs.crustdata.com/company-docs/identify#identify-by-company-name)
- [Identify by profile URL](https://docs.crustdata.com/company-docs/identify#identify-by-profile-url)
- [Identify by Crustdata company ID](https://docs.crustdata.com/company-docs/identify#identify-by-crustdata-company-id)
- [Identify vs Enrich](https://docs.crustdata.com/company-docs/identify#identify-vs-enrich)
- [Understanding the response](https://docs.crustdata.com/company-docs/identify#understanding-the-response)
- [No-match behavior](https://docs.crustdata.com/company-docs/identify#no-match-behavior)
- [Request parameter reference](https://docs.crustdata.com/company-docs/identify#request-parameter-reference)
- [Errors](https://docs.crustdata.com/company-docs/identify#errors)
- [API reference summary](https://docs.crustdata.com/company-docs/identify#api-reference-summary)
- [What to do next](https://docs.crustdata.com/company-docs/identify#what-to-do-next)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Company](https://docs.crustdata.com/company-docs/quickstart)

# Company Identify

Copy page

Resolve a company from partial information — a name, domain, profile URL, or Crustdata company ID — and get back matched company records ranked by confidence.

Copy page

**Use this when** you have partial company information and need to resolve it to a specific Crustdata company record — for CRM deduplication, lead routing, entity resolution, or pre-enrichment matching.The Company Identify API takes an identifier you have — a website domain, a
profile URL, a company name, or a Crustdata company ID — and returns one or
more matched companies ranked by confidence score. Identify is designed for
entity resolution rather than deep profiling.

This page documents the live Identify response directly. Current platform
behavior returns match metadata plus `company_data.basic_info`. If you need
the broader company sections used in full profiles, see
[Enrich](https://docs.crustdata.com/company-docs/enrichment#what-is-inside-company_data).

Every request goes to the same endpoint:

```
POST https://api.crustdata.com/company/identify
```

Replace `YOUR_API_KEY` in each example with your actual API key. All
requests require the `x-api-version: 2025-11-01` header.

## [​](https://docs.crustdata.com/company-docs/identify\#rate-limits-and-pricing)  Rate limits and pricing

**Pricing:**`Free`.

- **Rate limits:** For current plan-specific limits, see
[Rate limits](https://docs.crustdata.com/general/rate-limits).

Use Identify first when your input is ambiguous. You can resolve the right
company for free, then call [Enrich](https://docs.crustdata.com/company-docs/enrichment) only for the
records you want in full detail.

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#identify-by-domain)  Identify by domain

Pass a website domain in the `domains` array to find the matching company.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/identify \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "domains": ["serverobotics.com"]
  }'
```

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#identify-by-company-name)  Identify by company name

Name-based identification often returns multiple candidates. Check `confidence_score` and `primary_domain` to pick the right match.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/identify \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "names": ["Serve Robotics"]
  }'
```

When multiple matches are returned, use `primary_domain` and
`employee_count_range` to disambiguate. The first match is not always the
right one for name-based lookups.

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#identify-by-profile-url)  Identify by profile URL

Request

```
curl --request POST \
  --url https://api.crustdata.com/company/identify \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "professional_network_profile_urls": [\
      "https://www.linkedin.com/company/mintlify"\
    ]
  }'
```

Profile URL lookups are direct matches — they typically return a single match
with high confidence.

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#identify-by-crustdata-company-id)  Identify by Crustdata company ID

Request

```
curl --request POST \
  --url https://api.crustdata.com/company/identify \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "crustdata_company_ids": [628895]
  }'
```

Company ID lookups return an exact match.

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#identify-vs-enrich)  Identify vs Enrich

|  | Identify | Enrich |
| --- | --- | --- |
| **Endpoint** | `/company/identify` | `/company/enrich` |
| **Pricing** | **Free** | **2 credits per record** |
| **Response** | Match results with `company_data.basic_info` | Full company profile |
| **Best for** | Matching, deduplication, entity resolution | Research, scoring, diligence |
| **Use when** | You need to resolve “which company is this?” | You need detailed company data |

**Common pattern:** Use Identify to resolve ambiguous inputs, then pass the `crustdata_company_id` from the best match into [Enrich](https://docs.crustdata.com/company-docs/enrichment) for the full profile.

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#understanding-the-response)  Understanding the response

**Current platform behavior:** The live Identify endpoint returns a
top-level array, not an object with a `results` wrapper.

The Identify API returns a top-level array — one entry per identifier you
submitted. Each entry has three fields:

- **`matched_on`** — the identifier you submitted (the domain, URL, name, or ID).
- **`match_type`** — which identifier type was used. Values: `domain`, `name`, `crustdata_company_id`, `professional_network_profile_url`.
- **`matches`** — an array of candidate companies ranked by relevance. Each
match includes a `confidence_score` and a `company_data` object. Current
platform behavior returns `basic_info` here.

### [​](https://docs.crustdata.com/company-docs/identify\#no-match-behavior)  No-match behavior

When no company matches the identifier, current platform behavior returns `200` with an empty `matches` array:

```
[\
    {\
        "matched_on": "thisdomaindoesnotexist12345xyz.com",\
        "match_type": "domain",\
        "matches": []\
    }\
]
```

The OpenAPI spec also defines a `404` response for Identify. Current
platform behavior returns `200` with empty `matches`, but integrations
should handle both.

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#request-parameter-reference)  Request parameter reference

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `domains` | string\[\] | Exactly one identifier type required | Website domains to identify. |
| `professional_network_profile_urls` | string\[\] | Exactly one identifier type required | Company profile URLs to identify. |
| `names` | string\[\] | Exactly one identifier type required | Company names to identify. |
| `crustdata_company_ids` | integer\[\] | Exactly one identifier type required | Crustdata company IDs to identify. |
| `exact_match` | boolean | No | Set to `true` for strict domain matching. |

**Current platform behavior:** Submit exactly one identifier type per
request.

**Current platform behavior:**`exact_match: true` enforces strict domain
matching, but it can still return multiple matches when more than one
company record shares that same domain.

The OpenAPI model currently reuses the Enrich request schema, but this page
documents the live Identify behavior. Use [Enrich](https://docs.crustdata.com/company-docs/enrichment)
when you need the broader profile sections.

## [​](https://docs.crustdata.com/company-docs/identify\#errors)  Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid request — missing or multiple identifier types, or malformed input. |
| `401` | Invalid or missing API key. |
| `403` | Permission denied or endpoint unavailable for your account. |
| `404` | No data found. |
| `500` | Internal server error. |

400 — Missing identifier

```
{
    "error": {
        "type": "invalid_request",
        "message": "Exactly one identifier must be provided: crustdata_company_ids, names, domains, or professional_network_profile_urls",
        "metadata": []
    }
}
```

401 — Invalid API key

```
{
    "message": "Invalid API key in request"
}
```

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#api-reference-summary)  API reference summary

| Detail | Value |
| --- | --- |
| **Endpoint** | `POST /company/identify` |
| **Auth** | Bearer token + `x-api-version: 2025-11-01` |
| **Pricing** | Free |
| **Request** | One identifier type: `domains`, `names`, `crustdata_company_ids`, or `professional_network_profile_urls`. Optional: `exact_match`. |
| **Response** | `[{ "matched_on", "match_type", "matches": [{ "confidence_score", "company_data" }] }]` |
| **Errors** | `400` (bad request), `401` (bad auth), `403` (permission), `404` (no match), `500` (server error) |

* * *

## [​](https://docs.crustdata.com/company-docs/identify\#what-to-do-next)  What to do next

- **Get the full profile** — pass the `crustdata_company_id` from Identify into [Enrich](https://docs.crustdata.com/company-docs/enrichment) for detailed company data.
- **Search for similar companies** — use [Company Search](https://docs.crustdata.com/company-docs/search) to find companies matching the same industry or headcount range.
- **See more examples** — browse [Company Examples](https://docs.crustdata.com/company-docs/examples) for ready-to-copy patterns.

Was this page helpful?

YesNo

[Company Enrich\\
\\
Previous](https://docs.crustdata.com/company-docs/enrichment) [Company Autocomplete\\
\\
Next](https://docs.crustdata.com/company-docs/autocomplete)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.