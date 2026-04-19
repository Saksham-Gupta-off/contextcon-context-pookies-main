---
url: "https://docs.crustdata.com/company-docs/examples"
title: "Company Examples - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/company-docs/examples#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/company-docs/examples)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company

Company Examples

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

- [Workflow 1: Autocomplete → Search → Enrich](https://docs.crustdata.com/company-docs/examples#workflow-1-autocomplete-%E2%86%92-search-%E2%86%92-enrich)
- [Step 1: Discover valid industry values](https://docs.crustdata.com/company-docs/examples#step-1-discover-valid-industry-values)
- [Step 2: Search for matching companies](https://docs.crustdata.com/company-docs/examples#step-2-search-for-matching-companies)
- [Step 3: Enrich the top matches](https://docs.crustdata.com/company-docs/examples#step-3-enrich-the-top-matches)
- [Workflow 2: Inbound domain → Identify → Search for similar companies](https://docs.crustdata.com/company-docs/examples#workflow-2-inbound-domain-%E2%86%92-identify-%E2%86%92-search-for-similar-companies)
- [Step 1: Identify the inbound company](https://docs.crustdata.com/company-docs/examples#step-1-identify-the-inbound-company)
- [Step 2: Search for similar companies](https://docs.crustdata.com/company-docs/examples#step-2-search-for-similar-companies)
- [Error handling patterns](https://docs.crustdata.com/company-docs/examples#error-handling-patterns)
- [Invalid request (400)](https://docs.crustdata.com/company-docs/examples#invalid-request-400)
- [Invalid API key (401)](https://docs.crustdata.com/company-docs/examples#invalid-api-key-401)
- [No match (Enrich/Identify)](https://docs.crustdata.com/company-docs/examples#no-match-enrich%2Fidentify)
- [Partial batch failure (Enrich)](https://docs.crustdata.com/company-docs/examples#partial-batch-failure-enrich)
- [Server error (500)](https://docs.crustdata.com/company-docs/examples#server-error-500)
- [Retry decision table](https://docs.crustdata.com/company-docs/examples#retry-decision-table)
- [Workflow 3: Paginated search with stable sorting](https://docs.crustdata.com/company-docs/examples#workflow-3-paginated-search-with-stable-sorting)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Company](https://docs.crustdata.com/company-docs/quickstart)

# Company Examples

Copy page

End-to-end Company API workflow examples with requests, responses, extraction steps, and failure handling.

Copy page

Use this page for complete, ready-to-copy workflow examples that chain multiple Company API calls together. Each workflow shows the request, the expected response, what to extract, and how to handle failures.For individual endpoint examples, see:

- [Search examples](https://docs.crustdata.com/company-docs/search#your-first-search-find-a-company-by-domain)
- [Autocomplete examples](https://docs.crustdata.com/company-docs/autocomplete#your-first-autocomplete-request-discover-industry-values)
- [Enrich examples](https://docs.crustdata.com/company-docs/enrichment#your-first-enrichment-look-up-a-company-by-domain)
- [Identify examples](https://docs.crustdata.com/company-docs/identify#identify-by-domain)

* * *

## [​](https://docs.crustdata.com/company-docs/examples\#workflow-1-autocomplete-%E2%86%92-search-%E2%86%92-enrich)  Workflow 1: Autocomplete → Search → Enrich

**Goal:** Find US-based software companies and get full profiles for the top matches.**Why this workflow:** You do not know the exact industry value the Search API expects. Autocomplete discovers it, Search finds matching companies, and Enrich fills in the details.

### [​](https://docs.crustdata.com/company-docs/examples\#step-1-discover-valid-industry-values)  Step 1: Discover valid industry values

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{"field": "basic_info.industries", "query": "software", "limit": 3}'
```

**Extract:** Take `suggestions[0].value` → `"Software Development"`. Use this exact string in your Search filter.**If empty:** If `suggestions` is `[]`, your query did not match any indexed values. Try a broader term (e.g., `"tech"` instead of `"software engineering"`).

### [​](https://docs.crustdata.com/company-docs/examples\#step-2-search-for-matching-companies)  Step 2: Search for matching companies

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
        {"field": "basic_info.industries", "type": "in", "value": ["Software Development"]},\
        {"field": "locations.hq_country", "type": "=", "value": "USA"}\
      ]
    },
    "sorts": [{"column": "headcount.total", "order": "desc"}],
    "limit": 3,
    "fields": ["crustdata_company_id", "basic_info.name", "basic_info.primary_domain", "headcount.total"]
  }'
```

**Extract:** Take `companies[].crustdata_company_id` values → `[12345, 67890, 628895]`. Pass these to Enrich.**If empty:** If `companies` is `[]`, no companies matched your filters. Broaden your conditions or use [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) to check that your filter values are valid.**To get more results:** Pass `next_cursor` as `cursor` in the next request. Stop paginating when `next_cursor` is `null`.

### [​](https://docs.crustdata.com/company-docs/examples\#step-3-enrich-the-top-matches)  Step 3: Enrich the top matches

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "crustdata_company_ids": [12345, 67890, 628895],
    "fields": ["basic_info", "headcount", "funding", "hiring"]
  }'
```

**Extract:** Each item in `results` corresponds to one input ID. Access the profile via `results[i].matches[0].company_data`.**If a match is empty:** If `matches` is `[]` for an identifier, that company was not found. The request still succeeds (`200 OK`) for the other identifiers.

* * *

## [​](https://docs.crustdata.com/company-docs/examples\#workflow-2-inbound-domain-%E2%86%92-identify-%E2%86%92-search-for-similar-companies)  Workflow 2: Inbound domain → Identify → Search for similar companies

**Goal:** An inbound lead arrives from `retool.com`. Find similar companies for prospecting.**Why this workflow:** [Identify](https://docs.crustdata.com/company-docs/identify) resolves the domain to a company record, then Search finds similar companies based on the identified company’s industry and size.

### [​](https://docs.crustdata.com/company-docs/examples\#step-1-identify-the-inbound-company)  Step 1: Identify the inbound company

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/company/identify \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{"domains": ["retool.com"]}'
```

**Extract:** Take `results[0].matches[0].company_data.basic_info.industries[0]` → `"Software Development"` and `employee_count_range` → `"201-500"`.

### [​](https://docs.crustdata.com/company-docs/examples\#step-2-search-for-similar-companies)  Step 2: Search for similar companies

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
        {"field": "basic_info.industries", "type": "in", "value": ["Software Development"]},\
        {"field": "headcount.total", "type": ">", "value": 200},\
        {"field": "headcount.total", "type": "<", "value": 1000}\
      ]
    },
    "sorts": [{"column": "headcount.total", "order": "desc"}],
    "limit": 10,
    "fields": ["crustdata_company_id", "basic_info.name", "basic_info.primary_domain", "headcount.total"]
  }'
```

**Extract:** Take `companies[].crustdata_company_id` values and pass them to [Enrich](https://docs.crustdata.com/company-docs/enrichment) for full profiles of promising matches.**If empty:** If `companies` is `[]`, broaden your filters (e.g., wider headcount range or more industries). Use [Autocomplete](https://docs.crustdata.com/company-docs/autocomplete) to verify valid filter values.

* * *

## [​](https://docs.crustdata.com/company-docs/examples\#error-handling-patterns)  Error handling patterns

All Company API endpoints return structured errors. Here are the patterns to handle:

### [​](https://docs.crustdata.com/company-docs/examples\#invalid-request-400)  Invalid request (400)

Search — invalid field name

Enrich — missing identifier

Autocomplete — invalid field

```
{
    "error": {
        "type": "invalid_request",
        "message": "Unsupported columns in conditions: ['nonexistent_field']",
        "metadata": []
    }
}
```

**Action:** Fix the request. Do not retry `400` errors — they indicate a malformed request.

### [​](https://docs.crustdata.com/company-docs/examples\#invalid-api-key-401)  Invalid API key (401)

```
{ "message": "Invalid API key in request" }
```

**Action:** Check your API key. The `401` response uses a different shape than other errors.

### [​](https://docs.crustdata.com/company-docs/examples\#no-match-enrich/identify)  No match (Enrich/Identify)

When no company matches, `matches` is empty but the request succeeds:

```
{
    "results": [\
        {\
            "matched_on": "nonexistent-domain.com",\
            "match_type": "domain",\
            "matches": []\
        }\
    ]
}
```

**Action:** Try a different identifier type or check for typos. Do not retry — the company may not be in the database.

The OpenAPI spec also defines `404` for Enrich and Identify. Current
platform behavior returns `200` with empty `matches`. Handle both.

### [​](https://docs.crustdata.com/company-docs/examples\#partial-batch-failure-enrich)  Partial batch failure (Enrich)

When enriching multiple identifiers, some may match and others may not. The request succeeds with `200`:

```
{
    "results": [\
        {\
            "matched_on": "hubspot.com",\
            "match_type": "domain",\
            "matches": [\
                {\
                    "confidence_score": 1.0,\
                    "company_data": {\
                        "basic_info": {\
                            "name": "HubSpot",\
                            "primary_domain": "hubspot.com"\
                        }\
                    }\
                }\
            ]\
        },\
        {\
            "matched_on": "nonexistent-domain.com",\
            "match_type": "domain",\
            "matches": []\
        }\
    ]
}
```

**Action:** Iterate over `results`. For each entry, check `matches.length > 0` before accessing `company_data`. Log or retry unmatched identifiers separately.

### [​](https://docs.crustdata.com/company-docs/examples\#server-error-500)  Server error (500)

```
{
    "error": {
        "type": "internal_error",
        "message": "An unexpected error occurred",
        "metadata": []
    }
}
```

**Action:** Retry with exponential backoff: wait 1s, then 2s, then 4s. Stop after 3 retries. If the error persists, contact support.

### [​](https://docs.crustdata.com/company-docs/examples\#retry-decision-table)  Retry decision table

| Status | Retry? | Action |
| --- | --- | --- |
| `400` | No | Fix the request |
| `401` | No | Check API key |
| `403` | No | Check permissions or credits |
| `404` | No | Try different identifier |
| `500` | Yes | Exponential backoff (1s, 2s, 4s) |
| Rate limit | Yes | Wait 60 seconds, then retry |

* * *

## [​](https://docs.crustdata.com/company-docs/examples\#workflow-3-paginated-search-with-stable-sorting)  Workflow 3: Paginated search with stable sorting

**Goal:** Page through all mid-size US software companies using cursor-based pagination.**Why this workflow:** Large result sets require pagination. Always include `sorts` for stable ordering across pages.

First page

Next page (use next\_cursor)

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
        {"field": "basic_info.industries", "type": "in", "value": ["Software Development"]},\
        {"field": "headcount.total", "type": ">", "value": 200},\
        {"field": "headcount.total", "type": "<", "value": 1000},\
        {"field": "locations.hq_country", "type": "=", "value": "USA"}\
      ]
    },
    "sorts": [{"column": "crustdata_company_id", "order": "asc"}],
    "limit": 100,
    "fields": ["crustdata_company_id", "basic_info.name", "basic_info.primary_domain"]
  }'
```

**Pagination loop logic:**

1. Send the first request without `cursor`.
2. Extract `next_cursor` from the response.
3. If `next_cursor` is `null`, stop — you have all results.
4. Otherwise, pass `next_cursor` as `cursor` in the next request. Keep `filters`, `sorts`, `limit`, and `fields` the same.
5. Repeat until `next_cursor` is `null`.

Always include `sorts` when paginating. Without `sorts`, result ordering is
not guaranteed and pages may contain duplicates or gaps.

Was this page helpful?

YesNo

[Company Autocomplete\\
\\
Previous](https://docs.crustdata.com/company-docs/autocomplete) [Person APIs\\
\\
Next](https://docs.crustdata.com/person-docs/quickstart)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.