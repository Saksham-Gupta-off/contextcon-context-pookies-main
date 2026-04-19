---
url: "https://docs.crustdata.com/person-docs/examples"
title: "Person Examples - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/person-docs/examples#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/person-docs/examples)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Person

Person Examples

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

- [Workflow 1: Autocomplete → Search → Enrich](https://docs.crustdata.com/person-docs/examples#workflow-1-autocomplete-%E2%86%92-search-%E2%86%92-enrich)
- [Step 1: Discover valid title values](https://docs.crustdata.com/person-docs/examples#step-1-discover-valid-title-values)
- [Step 2: Search for matching people](https://docs.crustdata.com/person-docs/examples#step-2-search-for-matching-people)
- [Step 3: Enrich the top match](https://docs.crustdata.com/person-docs/examples#step-3-enrich-the-top-match)
- [Workflow 2: Business email → Enrich](https://docs.crustdata.com/person-docs/examples#workflow-2-business-email-%E2%86%92-enrich)
- [Step 1: Enrich the email](https://docs.crustdata.com/person-docs/examples#step-1-enrich-the-email)
- [Error handling patterns](https://docs.crustdata.com/person-docs/examples#error-handling-patterns)
- [Invalid request (400)](https://docs.crustdata.com/person-docs/examples#invalid-request-400)
- [Invalid API key (401)](https://docs.crustdata.com/person-docs/examples#invalid-api-key-401)
- [No match (Enrich)](https://docs.crustdata.com/person-docs/examples#no-match-enrich)
- [Retry decision table](https://docs.crustdata.com/person-docs/examples#retry-decision-table)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Person](https://docs.crustdata.com/person-docs/quickstart)

# Person Examples

Copy page

End-to-end Person API workflow examples with requests, responses, extraction steps, and failure handling.

Copy page

Use this page for complete workflow examples that chain multiple Person API calls together.For single-endpoint requests and parameter details, use these pages:

- [Person Search](https://docs.crustdata.com/person-docs/search) — name lookup, title filters, exclusions, geographic filters, pagination, and preview mode.
- [Person Enrichment](https://docs.crustdata.com/person-docs/enrichment) — profile URL enrichment, business email lookup, batch enrichment, refresh flags, and field selection.

* * *

## [​](https://docs.crustdata.com/person-docs/examples\#workflow-1-autocomplete-%E2%86%92-search-%E2%86%92-enrich)  Workflow 1: Autocomplete → Search → Enrich

**Goal:** Find VPs of Sales at mid-size software companies and get their full profiles.**Why this workflow:** You don’t know the exact title value the Search API expects. Autocomplete discovers it, Search finds matching people, and Enrich fills in the details.

### [​](https://docs.crustdata.com/person-docs/examples\#step-1-discover-valid-title-values)  Step 1: Discover valid title values

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{"field": "experience.employment_details.current.title", "query": "VP Sales", "limit": 3}'
```

**Extract:** Take `suggestions[0].value` → `"VP Sales"`. Use this exact string in your Search filter.**If empty:** Try a broader query (e.g., `"VP"` instead of `"VP Sales"`).

### [​](https://docs.crustdata.com/person-docs/examples\#step-2-search-for-matching-people)  Step 2: Search for matching people

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "op": "and",
      "conditions": [\
        {"field": "experience.employment_details.current.title", "type": "in", "value": ["VP Sales", "VP of Sales"]},\
        {"field": "experience.employment_details.current.company_headcount_range", "type": "in", "value": ["51-200", "201-500"]}\
      ]
    },
    "limit": 3,
    "fields": ["basic_profile.name", "experience.employment_details.current.title", "experience.employment_details.current.company_name", "social_handles.professional_network_identifier.profile_url"]
  }'
```

**Extract:** Take `social_handles.professional_network_identifier.profile_url` → `"https://www.linkedin.com/in/janesmith"`. Pass the profile URL to Enrich.**If empty:** Broaden filters or check values with [Autocomplete](https://docs.crustdata.com/person-docs/autocomplete).

### [​](https://docs.crustdata.com/person-docs/examples\#step-3-enrich-the-top-match)  Step 3: Enrich the top match

Request

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{"professional_network_profile_urls": ["https://www.linkedin.com/in/janesmith"]}'
```

**Result:** Full person profile with employment history, education, skills, contact info, and more.

* * *

## [​](https://docs.crustdata.com/person-docs/examples\#workflow-2-business-email-%E2%86%92-enrich)  Workflow 2: Business email → Enrich

**Goal:** An inbound lead submits a business email. Enrich it directly to get the person’s full profile.

### [​](https://docs.crustdata.com/person-docs/examples\#step-1-enrich-the-email)  Step 1: Enrich the email

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{"business_emails": ["abhilash@crustdata.com"]}'
```

**Extract:** If `matches[0].confidence_score >= 0.8`, the person is confirmed and you already have the enrich response. Continue with any follow-up processing you need.**If no match:**`matches` will be `[]`. The email may not be in the database. Try a different identifier or check for typos.

* * *

## [​](https://docs.crustdata.com/person-docs/examples\#error-handling-patterns)  Error handling patterns

### [​](https://docs.crustdata.com/person-docs/examples\#invalid-request-400)  Invalid request (400)

```
{
    "error": {
        "type": "invalid_request",
        "message": "Unsupported filter field: 'current_title'. Supported fields: ['basic_profile.name', 'basic_profile.headline', ...]",
        "metadata": []
    }
}
```

**Action:** Fix the request. Do not retry `400` errors.

### [​](https://docs.crustdata.com/person-docs/examples\#invalid-api-key-401)  Invalid API key (401)

```
{ "message": "Invalid API key in request" }
```

**Action:** Check your API key. The `401` response uses a simpler shape.

### [​](https://docs.crustdata.com/person-docs/examples\#no-match-enrich)  No match (Enrich)

```
[\
    {\
        "matched_on": "nonexistent@example.com",\
        "match_type": "business_email",\
        "matches": []\
    }\
]
```

**Action:** Try a different identifier or check for typos. Do not retry.

### [​](https://docs.crustdata.com/person-docs/examples\#retry-decision-table)  Retry decision table

| Status | Retry? | Action |
| --- | --- | --- |
| `400` | No | Fix the request |
| `401` | No | Check API key |
| `403` | No | Check permissions or credits |
| `404` | No | Profile not found |
| `500` | Yes | Exponential backoff (1s, 2s, 4s) |

Was this page helpful?

YesNo

[Person Autocomplete\\
\\
Previous](https://docs.crustdata.com/person-docs/autocomplete) [Jobs Search API\\
\\
Next](https://docs.crustdata.com/job-docs/quickstart)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.