---
url: "https://docs.crustdata.com/person-docs/search"
title: "Person Search - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/person-docs/search#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/person-docs/search)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Person

Person Search

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

- [Your first search: find a person by name](https://docs.crustdata.com/person-docs/search#your-first-search-find-a-person-by-name)
- [Understanding the response](https://docs.crustdata.com/person-docs/search#understanding-the-response)
- [Combine filters with and](https://docs.crustdata.com/person-docs/search#combine-filters-with-and)
- [Search by employer and title](https://docs.crustdata.com/person-docs/search#search-by-employer-and-title)
- [How the operators work](https://docs.crustdata.com/person-docs/search#how-the-operators-work)
- [Exclude specific titles](https://docs.crustdata.com/person-docs/search#exclude-specific-titles)
- [Search within a geographic radius](https://docs.crustdata.com/person-docs/search#search-within-a-geographic-radius)
- [How geo\_distance works](https://docs.crustdata.com/person-docs/search#how-geo_distance-works)
- [Search by country](https://docs.crustdata.com/person-docs/search#search-by-country)
- [Paginate through results](https://docs.crustdata.com/person-docs/search#paginate-through-results)
- [Sort results](https://docs.crustdata.com/person-docs/search#sort-results)
- [Exclude specific people from results](https://docs.crustdata.com/person-docs/search#exclude-specific-people-from-results)
- [Preview mode](https://docs.crustdata.com/person-docs/search#preview-mode)
- [Filter operator reference](https://docs.crustdata.com/person-docs/search#filter-operator-reference)
- [Searchable fields](https://docs.crustdata.com/person-docs/search#searchable-fields)
- [Response fields](https://docs.crustdata.com/person-docs/search#response-fields)
- [Request parameter reference](https://docs.crustdata.com/person-docs/search#request-parameter-reference)
- [Errors](https://docs.crustdata.com/person-docs/search#errors)
- [No results](https://docs.crustdata.com/person-docs/search#no-results)
- [API reference summary](https://docs.crustdata.com/person-docs/search#api-reference-summary)
- [What to do next](https://docs.crustdata.com/person-docs/search#what-to-do-next)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Person](https://docs.crustdata.com/person-docs/quickstart)

# Person Search

Copy page

Learn how to search for people using the Person Search API, from simple name lookups to advanced multi-filter queries.

Copy page

The Person Search API lets you find professionals by name, title, company, location, and more. This page walks you through the API step by step, starting with the simplest possible request and building up to advanced queries.Every request goes to the same endpoint:

```
POST https://api.crustdata.com/person/search
```

Replace `YOUR_API_KEY` in each example with your actual API key. All
requests require the `x-api-version: 2025-11-01` header.

**Pricing:**`0.03 credits per result returned`.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#your-first-search-find-a-person-by-name)  Your first search: find a person by name

The simplest search finds a person by their exact name. You pass a single filter with the `=` operator.

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
      "field": "basic_profile.name",
      "type": "=",
      "value": "Abhilash Chowdhary"
    },
    "limit": 1
  }'
```

Response trimmed for clarity.

### [​](https://docs.crustdata.com/person-docs/search\#understanding-the-response)  Understanding the response

Every search response has three fields:

- **`profiles`** — an array of matching people. Each profile contains identity fields, education, profile handles, and contact availability flags for the fields you requested.
- **`total_count`** — how many people match your filters across the full database. Here, 8 people named “Abhilash Chowdhary” exist.
- **`next_cursor`** — a pagination token. Pass it in the next request to get the next page of results. `null` means there are no more pages.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#combine-filters-with-and)  Combine filters with `and`

Real searches need more than one criterion. Wrap multiple conditions inside an `op: "and"` group to require all of them.This search finds Co-Founders located in San Francisco. The `(.)` operator does a regex/contains match instead of an exact match.

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
        {\
          "field": "experience.employment_details.title",\
          "type": "(.)",\
          "value": "Co-Founder"\
        },\
        {\
          "field": "basic_profile.location.full_location",\
          "type": "(.)",\
          "value": "San Francisco"\
        }\
      ]
    },
    "limit": 2
  }'
```

Response trimmed for clarity.

The key difference from the first example: instead of a single `filters` object, you now have a group with `op: "and"` and a `conditions` array. Every condition must match for a profile to be included.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#search-by-employer-and-title)  Search by employer and title

This is the most common pattern for sales and recruiting: find people with a specific title at a specific company. This search finds VPs, Directors, and Heads of department at Retool.

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
        {\
          "field": "experience.employment_details.company_name",\
          "type": "in",\
          "value": ["Retool"]\
        },\
        {\
          "field": "experience.employment_details.title",\
          "type": "(.)",\
          "value": "VP|Director|Head of"\
        }\
      ]
    },
    "limit": 1
  }'
```

Response trimmed for clarity.

### [​](https://docs.crustdata.com/person-docs/search\#how-the-operators-work)  How the operators work

There are two different operators at play here:

- **`in`** on `experience.employment_details.company_name` checks if the person has worked at any of the listed companies (current or past). Pass an array even for a single company. To search only current employers, use `experience.employment_details.current.company_name` instead.
- **`(.)`** on `experience.employment_details.title` does a regex match. The pipe `|` means “or”, so `VP|Director|Head of` matches any title containing “VP”, “Director”, or “Head of”. To search only current titles, use `experience.employment_details.current.title` instead.

The `experience.employment_details.company_name` field includes **all** employers (current and past). If you see someone whose current role is at a different company, it means they previously worked at your target company.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#exclude-specific-titles)  Exclude specific titles

Sometimes you want everyone at a company _except_ certain roles. Use the `not_in` operator to exclude titles.This search finds people at OpenAI or Retool but excludes interns and students.

Request

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
        {\
          "field": "experience.employment_details.company_name",\
          "type": "in",\
          "value": ["OpenAI", "Retool"]\
        },\
        {\
          "field": "experience.employment_details.title",\
          "type": "not_in",\
          "value": ["Intern", "Student"]\
        }\
      ]
    },
    "limit": 2
  }'
```

The `not_in` operator removes any profile where one of the listed values appears in their title history. This is useful for cleaning up results in recruiting or sales workflows.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#search-within-a-geographic-radius)  Search within a geographic radius

The `geo_distance` filter finds people within a specific distance of a city. This is powerful for territory-based sales or local recruiting.This search finds CTOs within 10 miles of San Francisco.

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
        {\
          "field": "professional_network.location.raw",\
          "type": "geo_distance",\
          "value": {\
            "location": "San Francisco",\
            "distance": 10,\
            "unit": "mi"\
          }\
        },\
        {\
          "field": "experience.employment_details.current.title",\
          "type": "(.)",\
          "value": "CTO|Chief Technology"\
        }\
      ]
    },
    "limit": 1
  }'
```

Response trimmed for clarity.

### [​](https://docs.crustdata.com/person-docs/search\#how-geo_distance-works)  How geo\_distance works

The `geo_distance` filter uses the `professional_network.location.raw` field. The `value` is an object with three fields:

| Field | Required | Description |
| --- | --- | --- |
| `location` | Yes | City name or region (e.g., “San Francisco”, “London”, “New York”) |
| `distance` | Yes | Radius from the center point |
| `unit` | No | Distance unit: `mi`, `km`, `m`, `ft`. Defaults to `km` |

* * *

## [​](https://docs.crustdata.com/person-docs/search\#search-by-country)  Search by country

For broader geographic targeting, filter by country directly.

Request

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "basic_profile.location.country",
      "type": "=",
      "value": "United States"
    },
    "limit": 2
  }'
```

This returns all people located in the United States. With 125M+ matching profiles, you will want to combine this with title or employer filters to narrow results.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#paginate-through-results)  Paginate through results

When your search matches more profiles than your `limit`, use cursor-based pagination to walk through all pages.**First page:** send your normal search request.

First page

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "experience.employment_details.company_name",
      "type": "in",
      "value": ["Retool"]
    },
    "limit": 100
  }'
```

**Next page:** take the `next_cursor` value from the response and pass it in your next request. Keep the same `filters` and `limit`.

Next page

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "experience.employment_details.company_name",
      "type": "in",
      "value": ["Retool"]
    },
    "limit": 100,
    "cursor": "PASTE_NEXT_CURSOR_VALUE_HERE"
  }'
```

Continue until `next_cursor` is `null`, which means you have reached the last page.

Always include `sorts` when paginating to ensure stable ordering across
pages.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#sort-results)  Sort results

Use the `sorts` parameter to order results by a specific field. This is important for stable pagination.

Sort by connections (descending)

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "experience.employment_details.current.title",
      "type": "=",
      "value": "CEO"
    },
    "sorts": [{"field": "professional_network.connections", "order": "desc"}],
    "limit": 5,
    "fields": ["basic_profile.name", "professional_network.connections"]
  }'
```

Valid sortable fields include: `crustdata_person_id`, `basic_profile.name`, `professional_network.connections`, `experience.employment_details.start_date`, `experience.employment_details.company_id`, `metadata.updated_at`.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#exclude-specific-people-from-results)  Exclude specific people from results

Use `post_processing` to remove known profiles from results. This is useful when re-running searches and you want to skip people you have already contacted.

Exclude specific people

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "experience.employment_details.title",
      "type": "(.)",
      "value": "Founder"
    },
    "limit": 5,
    "post_processing": {
      "exclude_names": ["Ali Kashani"],
      "exclude_profiles": ["https://www.linkedin.com/in/alikashani"]
    }
  }'
```

You can exclude by name, by profile URL, or both.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#preview-mode)  Preview mode

[**Preview mode** \\
\\
Preview search is a premium feature. Book a demo to enable it for your\\
account.](https://crustdata.com/demo)

If preview access is enabled for your account, use `preview: true` to get lightweight results before running a full search. Preview responses keep the same top-level shape but may return fewer profile fields.

**Current platform behavior:** if preview is not enabled for your account,
the API returns `400 invalid_request` with the message `error: PersonDB       preview feature is not available for your account.`

Preview search

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "filters": {
      "field": "experience.employment_details.title",
      "type": "(.)",
      "value": "Founder"
    },
    "preview": true,
    "limit": 2
  }'
```

* * *

## [​](https://docs.crustdata.com/person-docs/search\#filter-operator-reference)  Filter operator reference

| Operator | Meaning | Example use |
| --- | --- | --- |
| `=` | Exact match | `basic_profile.name` = “David Hsu” |
| `!=` | Not equal | Exclude a specific country |
| `>` / `<` | Greater/less than | Numeric comparisons |
| `in` | Value is in list | `experience.employment_details.company_name` in \[“Retool”, “OpenAI”\] |
| `not_in` | Value is not in list | Exclude titles like “Intern” |
| `(.)` | Regex/contains match | Title contains “VP\|Director” |
| `geo_distance` | Within radius of location | People near San Francisco |

## [​](https://docs.crustdata.com/person-docs/search\#searchable-fields)  Searchable fields

- Some returned fields use a different filter path. For example, the returned `basic_profile.current_title` is searched with `experience.employment_details.current.title`.
- Contact availability flags such as `contact.has_business_email` are response-only convenience fields. For search filters, use `experience.employment_details.current.business_email_verified`, `experience.employment_details.past.business_email_verified`, or `experience.employment_details.business_email_verified`.
- `social_handles.professional_network_identifier.profile_url` is returned in search results but is rejected as a search filter. Use [Person Enrich](https://docs.crustdata.com/person-docs/enrichment) for direct profile URL lookups.
- Some searchable fields, such as `certifications.*` and `honors.title`, may not appear in the response summary below.

| Field family | Common searchable fields | Best for |
| --- | --- | --- |
| Identity and bio | `basic_profile.name`, `basic_profile.first_name`, `basic_profile.last_name`, `basic_profile.headline`, `basic_profile.summary`, `basic_profile.languages` | Name, headline, and keyword lookups |
| Location | `basic_profile.location.city`, `basic_profile.location.state`, `basic_profile.location.country`, `basic_profile.location.continent`, `basic_profile.location.full_location`, `professional_network.location.raw` | Geographic targeting and radius search |
| Network metadata | `professional_network.connections`, `professional_network.open_to_cards`, `professional_network.metadata.last_scraped_source` | Network reach and status filters |
| Skills | `skills.professional_network_skills` | Skill-based prospecting |
| Experience across all roles | `experience.employment_details.company_name`, `experience.employment_details.title`, `experience.employment_details.description`, `experience.employment_details.seniority_level`, `experience.employment_details.function_category`, `experience.employment_details.start_date`, `experience.employment_details.end_date`, `experience.employment_details.location` | Current + past role history |
| Current role | `experience.employment_details.current.company_name`, `experience.employment_details.current.title`, `experience.employment_details.current.seniority_level`, `experience.employment_details.current.function_category`, `experience.employment_details.current.start_date`, `experience.employment_details.current.name`, `experience.employment_details.current.years_at_company_raw` | Current-title and current-company targeting |
| Past role | `experience.employment_details.past.company_name`, `experience.employment_details.past.title`, `experience.employment_details.past.seniority_level`, `experience.employment_details.past.function_category`, `experience.employment_details.past.start_date`, `experience.employment_details.past.name`, `experience.employment_details.past.years_at_company_raw` | Alumni and prior-role searches |
| Company context in experience | `experience.employment_details.company_website_domain`, `experience.employment_details.company_headcount_latest`, `experience.employment_details.company_headcount_range`, `experience.employment_details.company_industries`, `experience.employment_details.company_professional_network_industry`, `experience.employment_details.company_type`, `experience.employment_details.company_headquarters_country`, `experience.employment_details.company_hq_location` | Company-based segmentation |
| Education | `education.schools.school`, `education.schools.degree`, `education.schools.field_of_study` | School, degree, and field-of-study filters |
| Certifications and honors | `certifications.name`, `certifications.issuing_organization`, `certifications.issue_date`, `certifications.expiration_date`, `honors.title` | Credential and honors targeting |
| Flags and recency | `recently_changed_jobs`, `years_of_experience_raw`, `metadata.updated_at` | Recency and experience filters |

## [​](https://docs.crustdata.com/person-docs/search\#response-fields)  Response fields

Each profile in the response can include these sections, depending on `fields`. This table summarizes returned sections only. It is not a complete filter reference.

| Section | Key fields | Description |
| --- | --- | --- |
| `basic_profile` | `name`, `headline`, `current_title`, `location`, `summary` | Identity and location |
| `experience` | `employment_details.current`, `employment_details.past` | Full work history |
| `education` | `schools` | Education background |
| `skills` | `professional_network_skills` | Listed skills |
| `contact` | `has_business_email`, `has_personal_email`, `has_phone_number` | Contact availability flags |
| `social_handles` | `professional_network_identifier.profile_url`, `dev_platform_identifier.profile_url`, `twitter_identifier.slug` | Available profile handles |
| `professional_network` | `connections`, `profile_picture_permalink` | Network metadata |

* * *

## [​](https://docs.crustdata.com/person-docs/search\#request-parameter-reference)  Request parameter reference

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `filters` | object | Yes | — | Filter condition or condition group. See [operators](https://docs.crustdata.com/person-docs/search#filter-operator-reference) above. |
| `fields` | string\[\] | No | All | Dot-path fields to return (e.g., `["basic_profile.name", "experience.employment_details.current.title"]`). |
| `sorts` | array | No | `[]` | Sort specifications as an array of `{ field, order }` objects. Use `asc` or `desc` for `order`. Required for stable pagination. |
| `limit` | integer | No | 20 | Max profiles per page (1–1000). |
| `count` | integer | No | — | Alias for `limit`. |
| `cursor` | string | No | `null` | Pagination cursor from previous response’s `next_cursor`. |
| `post_processing` | object | No | — | `exclude_profiles` (URL array) and `exclude_names` (name array). |
| `preview` | boolean | No | `false` | Premium feature — return lightweight results (faster, lower cost). |
| `return_query` | boolean | No | `false` | Debug flag accepted by the API. **Current platform behavior:** the response does not include a top-level `query` field. |

## [​](https://docs.crustdata.com/person-docs/search\#errors)  Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid request — unsupported field, wrong operator, malformed filters, or preview not enabled for your account. |
| `401` | Invalid or missing API key. |
| `403` | Permission denied or insufficient credits. |
| `500` | Internal server error. Retry with exponential backoff. |

### [​](https://docs.crustdata.com/person-docs/search\#no-results)  No results

When no people match the filters, the API returns `200` with an empty `profiles` array:

```
{
    "profiles": [],
    "next_cursor": null,
    "total_count": 0
}
```

**Action:** Broaden filters or check field values with [Autocomplete](https://docs.crustdata.com/person-docs/autocomplete).

* * *

## [​](https://docs.crustdata.com/person-docs/search\#api-reference-summary)  API reference summary

| Detail | Value |
| --- | --- |
| **Endpoint** | `POST /person/search` |
| **Auth** | Bearer token + `x-api-version: 2025-11-01` |
| **Response** | `{ "profiles": [...], "next_cursor": "...", "total_count": N }` |
| **Pagination** | Cursor-based. Pass `next_cursor` as `cursor`. Stop when `next_cursor` is `null`. |
| **Errors** | `400`, `401`, `403`, `500` |

See the [full API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) for the complete OpenAPI schema.

* * *

## [​](https://docs.crustdata.com/person-docs/search\#what-to-do-next)  What to do next

- **Enrich a profile** — once you have a profile URL from search, use [Person Enrich](https://docs.crustdata.com/person-docs/enrichment) to get the full cached profile.
- **Discover filter values** — use [Person Autocomplete](https://docs.crustdata.com/person-docs/autocomplete) to find exact indexed values for search filters.
- **See more examples** — browse [Person Examples](https://docs.crustdata.com/person-docs/examples) for ready-to-copy workflow patterns.
- **Read the quickstart** — see [Person APIs](https://docs.crustdata.com/person-docs/quickstart) for a high-level guide to the core person endpoints.
- **Check the API reference** — see the [OpenAPI spec](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) for the full schema.

Was this page helpful?

YesNo

[Person APIs\\
\\
Previous](https://docs.crustdata.com/person-docs/quickstart) [Person Enrichment\\
\\
Next](https://docs.crustdata.com/person-docs/enrichment)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.