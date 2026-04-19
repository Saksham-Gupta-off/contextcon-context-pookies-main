---
url: "https://docs.crustdata.com/company-docs/autocomplete"
title: "Company Autocomplete - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/company-docs/autocomplete#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/company-docs/autocomplete)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company

Company Autocomplete

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

- [When to use autocomplete](https://docs.crustdata.com/company-docs/autocomplete#when-to-use-autocomplete)
- [Your first autocomplete request: discover industry values](https://docs.crustdata.com/company-docs/autocomplete#your-first-autocomplete-request-discover-industry-values)
- [Understanding the response](https://docs.crustdata.com/company-docs/autocomplete#understanding-the-response)
- [Request fields](https://docs.crustdata.com/company-docs/autocomplete#request-fields)
- [Autocomplete company names](https://docs.crustdata.com/company-docs/autocomplete#autocomplete-company-names)
- [Get the most common values for a field](https://docs.crustdata.com/company-docs/autocomplete#get-the-most-common-values-for-a-field)
- [Narrow suggestions with filters](https://docs.crustdata.com/company-docs/autocomplete#narrow-suggestions-with-filters)
- [Supported filter operators](https://docs.crustdata.com/company-docs/autocomplete#supported-filter-operators)
- [Common fields to autocomplete](https://docs.crustdata.com/company-docs/autocomplete#common-fields-to-autocomplete)
- [Use autocomplete with Company Search](https://docs.crustdata.com/company-docs/autocomplete#use-autocomplete-with-company-search)
- [Common errors and edge cases](https://docs.crustdata.com/company-docs/autocomplete#common-errors-and-edge-cases)
- [API reference summary](https://docs.crustdata.com/company-docs/autocomplete#api-reference-summary)
- [What to do next](https://docs.crustdata.com/company-docs/autocomplete#what-to-do-next)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Company](https://docs.crustdata.com/company-docs/quickstart)

# Company Autocomplete

Copy page

Learn how to discover valid field values for Company Search filters using the Company Autocomplete API.

Copy page

**Use this when** you need to discover valid filter values before building a Company Search query — for example, finding the exact industry label or country code the API expects.The Company Autocomplete API helps you discover the exact field values the indexed Company Search API expects. Use it before you build filters for industries, geographies, company types, funding stages, and more.Every request goes to the same endpoint:

```
POST https://api.crustdata.com/company/search/autocomplete
```

Replace `YOUR_API_KEY` in each example with your actual API key. All
requests require the `x-api-version: 2025-11-01` header.

**Pricing:**`Free`.

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#when-to-use-autocomplete)  When to use autocomplete

Use this endpoint when you want to:

- Build filter dropdowns or typeahead inputs in your product.
- Validate the exact values a Company Search filter expects.
- Explore the dataset vocabulary for a field before writing search queries.

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#your-first-autocomplete-request-discover-industry-values)  Your first autocomplete request: discover industry values

Start with the field you want to query and a partial search string. Here, `tech` returns matching values from `basic_info.industries`.

Request

Response

```
curl --request POST \
	--url https://api.crustdata.com/company/search/autocomplete \
	--header 'authorization: Bearer YOUR_API_KEY' \
	--header 'content-type: application/json' \
	--header 'x-api-version: 2025-11-01' \
	--data '{
		"field": "basic_info.industries",
		"query": "tech",
		"limit": 5
	}'
```

### [​](https://docs.crustdata.com/company-docs/autocomplete\#understanding-the-response)  Understanding the response

Autocomplete returns an object with one key:

- **`suggestions`**— an array of matching values, sorted by relevance. Each suggestion contains:

  - **`value`** — the exact field value to reuse in a Company Search filter.

Use the returned `value` exactly as-is in your next search request. This avoids empty results caused by typos, casing differences, or unsupported variants.When `query` is non-empty, suggestions are ranked by match relevance. When `query` is an empty string, suggestions are ranked by frequency.

### [​](https://docs.crustdata.com/company-docs/autocomplete\#request-fields)  Request fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `field` | string | Yes | Searchable company field to autocomplete, such as `basic_info.industries`, `taxonomy.professional_network_industry`, or `locations.country`. |
| `query` | string | Yes | Partial text to match. Use `""` to get the most common values. |
| `limit` | integer | No | Maximum suggestions to return. Default: `20`. Max: `100`. |
| `filters` | object | No | Optional condition or nested `and`/`or` group to narrow the suggestion pool. |

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#autocomplete-company-names)  Autocomplete company names

Use `basic_info.name` to surface company names matching a partial string.

Request

Response

```
curl --request POST \
	--url https://api.crustdata.com/company/search/autocomplete \
	--header 'authorization: Bearer YOUR_API_KEY' \
	--header 'content-type: application/json' \
	--header 'x-api-version: 2025-11-01' \
	--data '{
		"field": "basic_info.name",
		"query": "hub",
		"limit": 5
	}'
```

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#get-the-most-common-values-for-a-field)  Get the most common values for a field

Use an empty string for `query` when you want the most frequent values instead of a text match. This is useful when you are exploring a field for the first time.

Request

Response

```
curl --request POST \
	--url https://api.crustdata.com/company/search/autocomplete \
	--header 'authorization: Bearer YOUR_API_KEY' \
	--header 'content-type: application/json' \
	--header 'x-api-version: 2025-11-01' \
	--data '{
		"field": "locations.country",
		"query": "",
		"limit": 10
	}'
```

Suggestions are ranked by frequency, so you can quickly see the most common values in the dataset.

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#narrow-suggestions-with-filters)  Narrow suggestions with filters

Autocomplete can scope results to a subset of companies. The `filters` field accepts either:

- a single condition with `field`, `type`, and `value`
- a logical group with `op` and `conditions`

This example returns industry suggestions only for US-based companies.

Request

Response

```
curl --request POST \
	--url https://api.crustdata.com/company/search/autocomplete \
	--header 'authorization: Bearer YOUR_API_KEY' \
	--header 'content-type: application/json' \
	--header 'x-api-version: 2025-11-01' \
	--data '{
		"field": "basic_info.industries",
		"query": "",
		"limit": 5,
		"filters": {
			"field": "locations.country",
			"type": "=",
			"value": "USA"
		}
	}'
```

Use indexed values in `filters`. For example, `locations.country` uses
ISO-3 codes such as `USA`, `GBR`, and `CAN`.

You can also use nested `and`/`or` groups. Filter values can be strings, numbers, or booleans, and array values can contain strings or numbers — pass numeric values as numbers rather than strings where the underlying field is numeric.

```
curl --request POST \
  --url https://api.crustdata.com/company/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "taxonomy.professional_network_industry",
    "query": "",
    "limit": 5,
    "filters": {
      "op": "and",
      "conditions": [\
        { "field": "locations.country", "type": "=", "value": "USA" },\
        { "field": "headcount.latest_count", "type": ">", "value": 100 }\
      ]
    }
  }'
```

### [​](https://docs.crustdata.com/company-docs/autocomplete\#supported-filter-operators)  Supported filter operators

`=`, `!=`, `<`, `=<`, `>`, `=>`, `in`, `not_in`, `contains`.

### [​](https://docs.crustdata.com/company-docs/autocomplete\#common-fields-to-autocomplete)  Common fields to autocomplete

| Field | Why you would use it |
| --- | --- |
| `basic_info.industries` | Find exact industry labels before building industry filters. |
| `basic_info.name` | Surface company names matching a partial string. |
| `taxonomy.professional_network_industry` | Match primary industry values used in company search. |
| `locations.country` | Discover country values used by the indexed dataset. |
| `basic_info.company_type` | Explore company type labels used in the dataset. |
| `funding.last_round_type` | Find valid funding stage labels before filtering by recent financing data. |
| `headcount.latest_count` | Explore employee-count buckets used by autocomplete filters. |
| `followers.latest_count` | Explore follower-count buckets used by autocomplete filters. |

For the full set of supported fields, see the `field` parameter on the [API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction).

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#use-autocomplete-with-company-search)  Use autocomplete with Company Search

A common workflow looks like this:

1. Call Autocomplete with a partial query.
2. Copy the exact `value` from the response.
3. Use that value in [Company Search](https://docs.crustdata.com/company-docs/search).

For example, if autocomplete returns `Technology, Information and Media`, use that exact string in a search filter instead of guessing another variant.

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#common-errors-and-edge-cases)  Common errors and edge cases

If no values match your query, the API returns an empty array:

```
{
    "suggestions": []
}
```

If you send an unsupported field name, the API returns a `400` with the list of valid fields:

```
{
    "error": {
        "type": "invalid_request",
        "message": "Field 'invalid_field' is not valid for autocomplete. Available fields are: basic_info.company_type, basic_info.employee_count_range, basic_info.industries, basic_info.markets, basic_info.name, basic_info.primary_domain, ...",
        "metadata": []
    }
}
```

If that happens, double-check the field path against the supported list and use a field that is available in the indexed Company Search schema.

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#api-reference-summary)  API reference summary

| Detail | Value |
| --- | --- |
| **Endpoint** | `POST /company/search/autocomplete` |
| **Auth** | Bearer token + `x-api-version: 2025-11-01` |
| **Required params** | `field`, `query` |
| **Optional params** | `limit` (default: 20, max: 100), `filters` |
| **Response** | `{ "suggestions": [{ "value": "..." }] }` |
| **Empty result** | `200` with `"suggestions": []` |
| **Errors** | `400` (unsupported field), `401` (bad auth), `500` (server error) |

For pricing, see [Pricing](https://docs.crustdata.com/general/pricing). For rate-limit guidance, see
[Rate limits](https://docs.crustdata.com/general/rate-limits).See the [full API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) for the complete OpenAPI schema.

* * *

## [​](https://docs.crustdata.com/company-docs/autocomplete\#what-to-do-next)  What to do next

- **[Company Search](https://docs.crustdata.com/company-docs/search)** — use the discovered value in a structured company search.
- **[Company Enrich](https://docs.crustdata.com/company-docs/enrichment)** — enrich a company after you find it.
- **[Company examples](https://docs.crustdata.com/company-docs/examples)** — browse ready-to-copy request patterns.

Was this page helpful?

YesNo

[Company Identify\\
\\
Previous](https://docs.crustdata.com/company-docs/identify) [Company Examples\\
\\
Next](https://docs.crustdata.com/company-docs/examples)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.