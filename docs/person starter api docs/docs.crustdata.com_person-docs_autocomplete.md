---
url: "https://docs.crustdata.com/person-docs/autocomplete"
title: "Person Autocomplete - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/person-docs/autocomplete#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/person-docs/autocomplete)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Person

Person Autocomplete

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

- [At a glance](https://docs.crustdata.com/person-docs/autocomplete#at-a-glance)
- [Guaranteed contract vs current behavior](https://docs.crustdata.com/person-docs/autocomplete#guaranteed-contract-vs-current-behavior)
- [When to use Autocomplete vs Search](https://docs.crustdata.com/person-docs/autocomplete#when-to-use-autocomplete-vs-search)
- [Quick start: discover job title values](https://docs.crustdata.com/person-docs/autocomplete#quick-start-discover-job-title-values)
- [Get the most common values for a field](https://docs.crustdata.com/person-docs/autocomplete#get-the-most-common-values-for-a-field)
- [Narrow suggestions with filters](https://docs.crustdata.com/person-docs/autocomplete#narrow-suggestions-with-filters)
- [Workflow: Autocomplete → Search](https://docs.crustdata.com/person-docs/autocomplete#workflow-autocomplete-%E2%86%92-search)
- [Supported operators](https://docs.crustdata.com/person-docs/autocomplete#supported-operators)
- [Implementation tips for UI builders](https://docs.crustdata.com/person-docs/autocomplete#implementation-tips-for-ui-builders)
- [Common supported fields](https://docs.crustdata.com/person-docs/autocomplete#common-supported-fields)
- [Verify the live list](https://docs.crustdata.com/person-docs/autocomplete#verify-the-live-list)
- [Request parameters](https://docs.crustdata.com/person-docs/autocomplete#request-parameters)
- [AutocompleteFilterCondition](https://docs.crustdata.com/person-docs/autocomplete#autocompletefiltercondition)
- [AutocompleteFilterConditionGroup](https://docs.crustdata.com/person-docs/autocomplete#autocompletefilterconditiongroup)
- [Errors](https://docs.crustdata.com/person-docs/autocomplete#errors)
- [What to do next](https://docs.crustdata.com/person-docs/autocomplete#what-to-do-next)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Person](https://docs.crustdata.com/person-docs/quickstart)

# Person Autocomplete

Copy page

Discover valid field values for Person Search filters using the autocomplete API.

Copy page

**Use this when** you need to discover exact indexed values before building a Person Search query — for filter dropdowns, input validation, dataset exploration, or guided query builders.The Person Autocomplete API returns ranked field-value suggestions so you can feed the result straight into a [Person Search](https://docs.crustdata.com/person-docs/search) filter without guessing at valid values.

This endpoint returns **field values, not person profiles**. It also has
**no pagination or cursor** — the `limit` parameter (max `100`) is the only
way to control result size. For a full list of distinct values you need to
combine Autocomplete with progressively narrower `filters` scopes. To fetch
person records, use [Person Search](https://docs.crustdata.com/person-docs/search) or [Person\\
Enrich](https://docs.crustdata.com/person-docs/enrichment) instead.

**Mental model.** The top-level **`field`** is the field whose values you
want suggested — the autocomplete target. **`filters.field`** is different:
it’s any Person Search filter field you use to narrow the population that
autocomplete runs over. Autocomplete targets come from a fixed allowlist;
filter fields come from the broader Person Search filter vocabulary.

## [​](https://docs.crustdata.com/person-docs/autocomplete\#at-a-glance)  At a glance

| Detail | Value |
| --- | --- |
| **Endpoint** | `POST https://api.crustdata.com/person/search/autocomplete` |
| **Auth** | `Authorization: Bearer YOUR_API_KEY` |
| **API version** | `x-api-version: 2025-11-01` header (required) |
| **Required** | `field` (string) · `query` (string, may be empty) |
| **Optional** | `limit` (integer, 1–100, default 20) · `filters` (single condition or condition group) |
| **Response** | `{ "suggestions": [ { "value": string } ] }` |
| **Errors** | `400` invalid request · `401` unauthorized · `500` internal |
| **Pricing** | Free — see [Pricing](https://docs.crustdata.com/general/pricing#person-apis) for the authoritative list. |

Replace `YOUR_API_KEY` in each example with your actual API key.

Default `rate-limit` is 15 requests per minute. Send an email to
[gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if
needed for your use case.

### [​](https://docs.crustdata.com/person-docs/autocomplete\#guaranteed-contract-vs-current-behavior)  Guaranteed contract vs current behavior

Use this table to separate the parts you can build against with confidence from the observed behavior that may evolve.

| Topic | Kind | What it means |
| --- | --- | --- |
| Endpoint, HTTP method, auth headers | **Contract** | `POST /person/search/autocomplete`, bearer auth, `x-api-version: 2025-11-01`. |
| Request body shape | **Contract** | `field` and `query` required, `limit` and `filters` optional, `filters` uses conditions / condition groups with the documented operators. |
| Response body shape | **Contract** | `{ "suggestions": [ { "value" } ] }`. Empty results return `{"suggestions": []}` with status `200`. |
| Supported operators | **Contract** | `=`, `!=`, `<`, `=<`, `>`, `=>`, `in`, `not_in`, `contains` — see [Supported operators](https://docs.crustdata.com/person-docs/autocomplete#supported-operators). |
| `limit` bounds and default | **Contract** | Minimum `1`, maximum `100`, default `20`. |
| Error status codes | **Contract** | `400` (invalid request), `401` (unauthorized), `500` (internal). |
| Suggestion ranking | Current behavior | Suggestions are ranked by internal frequency within the (optionally filtered) population — the ranking signal is not exposed in the response. |
| Case-insensitive query matching | Current behavior | `"vp"` and `"VP"` currently return the same suggestions. |
| Multi-token query loose matching | Current behavior | A multi-word `query` may return values containing only one of the tokens. |
| Blank-string suggestions | Current behavior | Empty-`query` calls can return `""` as the top suggestion when a field has many empty indexed records. |

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#when-to-use-autocomplete-vs-search)  When to use Autocomplete vs Search

| You want to… | Use |
| --- | --- |
| Discover valid filter values for a field | **Autocomplete** (this page) |
| See the distinct values a field takes, ranked by count | **Autocomplete** with an empty `query` |
| Return actual person profiles matching filters | [**Person Search**](https://docs.crustdata.com/person-docs/search) |
| Build a type-ahead dropdown for a filter UI | **Autocomplete** with a partial `query` |
| Build a live multi-field query that returns full rows | [**Person Search**](https://docs.crustdata.com/person-docs/search) |

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#quick-start-discover-job-title-values)  Quick start: discover job title values

Type-ahead lookup on a single field. Pass the user’s partial input as `query` and cap the dropdown size with `limit`.

curl

Python

Node.js

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "experience.employment_details.current.title",
    "query": "VP",
    "limit": 5
  }'
```

Each suggestion includes:

- **`value`** — the exact **indexed value**: the raw string stored against `field` in Crustdata’s person index. Use it verbatim as a Person Search filter value — two distinct indexed values (for example `"VP"` and `"vp"`) are different filter keys, and substituting one for the other will return different results.

Suggestions are returned ranked by internal frequency within the (optionally filtered) population. The ranking signal itself is not returned in the response.When no values match the `query` (or no values exist within the `filters` scope), the response returns an empty array — not a 404:

No results

```
{
    "suggestions": []
}
```

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#get-the-most-common-values-for-a-field)  Get the most common values for a field

Pass an empty `query` to retrieve the top values for the field by frequency. Useful for seeding filter dropdowns or showing popular options.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "experience.employment_details.current.title",
    "query": "",
    "limit": 5
  }'
```

**Current platform behavior:** empty-query autocomplete can return blank
string values when a field has many empty indexed records. Filter those out
in your UI if you do not want a blank option.

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#narrow-suggestions-with-filters)  Narrow suggestions with filters

Scope the autocomplete to a subset of the dataset with the optional `filters` field. The suggestions are then computed against the filtered population.`filters` accepts either a single `AutocompleteFilterCondition` or a nested `AutocompleteFilterConditionGroup` combined with `and`/`or` logic.

- Single condition

- Condition group (AND/OR)

- Multi-value (in / not\_in)

- Numeric comparison


Use a single `AutocompleteFilterCondition` to filter on one field — for example, top “VP” titles among current Google employees.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "experience.employment_details.current.title",
    "query": "VP",
    "limit": 5,
    "filters": {
      "field": "experience.employment_details.current.company_name",
      "type": "=",
      "value": "Google"
    }
  }'
```

Use an `AutocompleteFilterConditionGroup` to combine multiple conditions with `op: "and"` or `op: "or"` — for example, top titles matching `"engineer"` at Google in the United States.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "experience.employment_details.current.title",
    "query": "engineer",
    "limit": 5,
    "filters": {
      "op": "and",
      "conditions": [\
        {\
          "field": "experience.employment_details.current.company_name",\
          "type": "=",\
          "value": "Google"\
        },\
        {\
          "field": "basic_profile.location.country",\
          "type": "=",\
          "value": "United States"\
        }\
      ]
    }
  }'
```

Groups can be nested — pass another `AutocompleteFilterConditionGroup` inside `conditions` to express arbitrarily complex boolean expressions.

Use `in` or `not_in` to match any value in a list. Pass a JSON **array** for `value` — a comma-separated string will return a 400.Top engineer titles across the United States, United Kingdom, and Canada:

Request (in)

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "experience.employment_details.current.title",
    "query": "Engineer",
    "limit": 5,
    "filters": {
      "field": "basic_profile.location.country",
      "type": "in",
      "value": ["United States", "United Kingdom", "Canada"]
    }
  }'
```

Top seniority levels **excluding** the United States and United Kingdom:

Request (not\_in)

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "experience.employment_details.current.seniority_level",
    "query": "",
    "limit": 5,
    "filters": {
      "field": "basic_profile.location.country",
      "type": "not_in",
      "value": ["United States", "United Kingdom"]
    }
  }'
```

Pass numeric values as JSON numbers. Filter `value` accepts string, number, integer, or boolean scalars; for `in` and `not_in`, use arrays of strings, numbers, or integers that match the underlying field’s type.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "experience.employment_details.current.title",
    "query": "",
    "limit": 3,
    "filters": {
      "field": "experience.employment_details.current.company_headcount_latest",
      "type": ">",
      "value": 10000
    }
  }'
```

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#workflow-autocomplete-%E2%86%92-search)  Workflow: Autocomplete → Search

1

[Navigate to header](https://docs.crustdata.com/person-docs/autocomplete#)

Discover the exact indexed value

Call autocomplete with a partial `query` to find the exact indexed value — for example, `"VP of Sales"`.

2

[Navigate to header](https://docs.crustdata.com/person-docs/autocomplete#)

Feed the value into Person Search

Use the returned `value` verbatim as the filter value in a Person Search request:

```
{
    "filters": {
        "field": "experience.employment_details.current.title",
        "type": "=",
        "value": "VP of Sales"
    }
}
```

This ensures your search uses an exact indexed value instead of a guess.

See [Person Search](https://docs.crustdata.com/person-docs/search) for the full filter grammar.

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#supported-operators)  Supported operators

The `type` field on every `AutocompleteFilterCondition` accepts the same operators as Person Search filters.

The **greater-than-or-equal** operator is `=>` (not `>=`) and **less-than-or-equal** is `=<` (not `<=`). This is intentional — do not mistype them as the more common `<=` and `>=`.

| Operator | `value` shape | Meaning |
| --- | --- | --- |
| `=` | string, number, integer, or boolean | Exact match — the field value equals `value`. |
| `!=` | string, number, integer, or boolean | Not equal — the field value differs from `value`. |
| `<` | number or ISO date string | Less than — numeric or date comparison. |
| `=<` | number or ISO date string | Less than or equal — numeric or date comparison. |
| `>` | number or ISO date string | Greater than — numeric or date comparison. |
| `=>` | number or ISO date string | Greater than or equal — numeric or date comparison. |
| `in` | **array** of strings, numbers, or integers | Membership — field value matches any entry in the array. |
| `not_in` | **array** of strings, numbers, or integers | Negated membership — field value matches none of the entries in the array. |
| `contains` | string | Substring match — field value contains `value`. |

Pass values with the JSON type that matches the underlying field:
`"value": 10000` for numeric fields, `"value": true` for booleans, and
strings for text fields. `in` and `not_in` require a JSON array — a
comma-separated string will return a 400.

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#implementation-tips-for-ui-builders)  Implementation tips for UI builders

- **Debounce** autocomplete calls to avoid one request per keystroke — 150–300 ms on input idle works well for typeahead UIs.
- **Drop blank values.** If `""` is returned as the top suggestion, remove it before rendering the dropdown.
- **Handle casing variants carefully.** Suggestions like `"VP"` and `"vp"` are **distinct indexed values**. Only merge them into a single UI option if you intentionally want normalized grouping — and if you do, preserve the underlying raw values and expand them in the eventual Person Search filter using `in`, for example `{"type": "in", "value": ["VP", "vp"]}`. If the UI needs exact-value selection, keep them as separate options.
- **Cap `limit`.** Most dropdowns need 5–15 options. Lower `limit` reduces payload size and gives faster responses.
- **Cache top-values lookups.** Empty-`query` calls that seed filter dropdowns rarely change — cache them client-side or at the edge.

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#common-supported-fields)  Common supported fields

The top-level `field` in the request (the field whose values you want suggested) must come from a **fixed allowlist** of autocomplete-enabled dataset fields. Not every Person Search field is autocomplete-enabled.The `filters.field` is different: it can be any dataset field that [Person Search](https://docs.crustdata.com/person-docs/search) accepts as a filter, not only the autocomplete allowlist. So you can filter autocomplete results on a broader set of fields than you can autocomplete on directly.

The tables below are a **documented subset** of the autocomplete allowlist.
They cover the fields most useful for building filter dropdowns, but they
are **not exhaustive**. If a field you need is not listed, treat its support
as unknown until you verify it — the safest way to confirm is to call the
endpoint with that field and check whether you get a `400` error. See
[Verify the live list](https://docs.crustdata.com/person-docs/autocomplete#verify-the-live-list) below for the debug-only live
source.

**`company_name` vs `name` for employers (current behavior).** Both
`experience.employment_details.current.company_name` and
`experience.employment_details.current.name` are currently accepted and
return the current employer. Prefer `company_name` for clarity; `name` is an
alternative spelling retained for backwards compatibility and may eventually
be removed.

- Current employment

- Past employment

- Profile & location

- Education, skills & more


| Field | What it discovers |
| --- | --- |
| `experience.employment_details.current.title` | Current job titles |
| `experience.employment_details.current.name` | Current employer names |
| `experience.employment_details.current.seniority_level` | Seniority level buckets |
| `experience.employment_details.current.function_category` | Job function |
| `experience.employment_details.current.company_industries` | Current employer industries |
| `experience.employment_details.current.company_type` | Current employer type |
| `experience.employment_details.current.company_hq_location` | Current employer HQ location |
| `experience.employment_details.current.company_website_domain` | Current employer website domain |

| Field | What it discovers |
| --- | --- |
| `experience.employment_details.past.title` | Past job titles |
| `experience.employment_details.past.name` | Past employer names |

| Field | What it discovers |
| --- | --- |
| `basic_profile.name` | Person names |
| `basic_profile.headline` | Profile headlines |
| `basic_profile.languages` | Spoken languages |
| `basic_profile.location.raw` | Raw location strings |
| `basic_profile.location.city` | Cities |
| `basic_profile.location.state` | States / regions |
| `basic_profile.location.country` | Countries |
| `basic_profile.location.continent` | Continents |
| `professional_network.location.city` | Profile network cities |
| `professional_network.location.state` | Profile network states |
| `professional_network.location.country` | Profile network countries |
| `professional_network.location.continent` | Profile network continents |

| Field | What it discovers |
| --- | --- |
| `education.schools.school` | Schools / universities |
| `education.schools.degree` | Degrees |
| `education.schools.field_of_study` | Fields of study |
| `skills.professional_network_skills` | Skills |
| `certifications.name` | Certification names |
| `certifications.issuing_organization` | Certification issuers |
| `honors.title` | Honors and awards |
| `social_handles.twitter_identifier.slug` | X (Twitter) handle slugs |

### [​](https://docs.crustdata.com/person-docs/autocomplete\#verify-the-live-list)  Verify the live list

**Debug fallback only — do not parse this error message in production**
**code.** The 400 error `message` is a human-readable debugging aid, not a
stable API surface. Its shape, ordering, and field list can change without
notice. Use it during development to confirm whether a specific field is
autocomplete-enabled, then maintain your own allowlist or rely on the
common-fields tables above.

Call the endpoint with a deliberately invalid `field`. The `400` response lists every currently accepted field in its error `message`:

Request

Response (abbreviated)

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "field": "current_title",
    "query": "",
    "limit": 1
  }'
```

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#request-parameters)  Request parameters

**Operator footguns.** Use `=>` for greater-than-or-equal and `=<` for less-than-or-equal — these are **not**`>=` and `<=`. `in` / `not_in` require JSON arrays (not comma-separated strings).

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `field` | string | Yes | Dataset field whose values you want suggested. Must be an **autocomplete-enabled field** — the allowlist is a subset of all Person Search fields. The [common supported fields](https://docs.crustdata.com/person-docs/autocomplete#common-supported-fields) tables cover the most useful subset; the full live allowlist can be verified via the [debug fallback](https://docs.crustdata.com/person-docs/autocomplete#verify-the-live-list). Unsupported fields return `400`. |
| `query` | string | Yes | Partial text to match against indexed values. Pass `""` to retrieve the top values for the field by frequency. |
| `limit` | integer | No | Maximum number of suggestions to return. Minimum `1`, maximum `100`, default `20`. |
| `filters` | object | No | Optional scope for the autocomplete computation. Pass either a single `AutocompleteFilterCondition` or a nested `AutocompleteFilterConditionGroup`. |

### [​](https://docs.crustdata.com/person-docs/autocomplete\#autocompletefiltercondition)  `AutocompleteFilterCondition`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `field` | string | Yes | Dataset field to filter on. Can be any [Person Search](https://docs.crustdata.com/person-docs/search) filter field — **this scope is broader than the autocomplete allowlist** for the top-level `field`. |
| `type` | string (enum) | Yes | One of [the supported operators](https://docs.crustdata.com/person-docs/autocomplete#supported-operators): `=`, `!=`, `<`, `=<`, `>`, `=>`, `in`, `not_in`, `contains`. |
| `value` | string, number, integer, boolean, or array | Yes | Scalar for comparison operators; JSON array of strings/numbers/integers for `in` and `not_in`. Match the JSON type to the underlying field’s type. |

### [​](https://docs.crustdata.com/person-docs/autocomplete\#autocompletefilterconditiongroup)  `AutocompleteFilterConditionGroup`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `op` | string (enum) | Yes | `"and"` or `"or"`. |
| `conditions` | array | Yes | One or more `AutocompleteFilterCondition` items or nested `AutocompleteFilterConditionGroup` items. Must contain at least one. |

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#errors)  Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid request — unsupported `field`, missing required field, a wrong `value` shape (for example a comma string for `in`), or a malformed body. |
| `401` | Unauthorized — the `Authorization` header is missing, malformed, or contains an invalid API key. |
| `500` | Internal server error — retry after a short delay. |

Note: a `query` that matches nothing is **not** an error — the endpoint returns `{"suggestions": []}` with a 200 status. Only use 4xx/5xx handling for actual request or server failures.

400 — Unsupported field

400 — Wrong value shape for in operator

401 — Invalid API key

```
{
    "error": {
        "type": "invalid_request",
        "message": "Field 'current_title' is not valid for autocomplete. Available fields are: basic_profile.headline, ..., experience.employment_details.current.function_category, experience.employment_details.current.title, ..., skills.professional_network_skills, social_handles.twitter_identifier.slug",
        "metadata": []
    }
}
```

* * *

## [​](https://docs.crustdata.com/person-docs/autocomplete\#what-to-do-next)  What to do next

- **Search for people** — use discovered values in [Person Search](https://docs.crustdata.com/person-docs/search).
- **Enrich matches** — use [Person Enrich](https://docs.crustdata.com/person-docs/enrichment) to get full profiles.
- **See more examples** — browse [Person Examples](https://docs.crustdata.com/person-docs/examples).

Was this page helpful?

YesNo

[Person Enrichment\\
\\
Previous](https://docs.crustdata.com/person-docs/enrichment) [Person Examples\\
\\
Next](https://docs.crustdata.com/person-docs/examples)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.