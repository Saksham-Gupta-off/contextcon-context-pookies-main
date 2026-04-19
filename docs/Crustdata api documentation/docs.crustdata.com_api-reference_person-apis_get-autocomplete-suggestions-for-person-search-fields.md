---
url: "https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields"
title: "Autocomplete - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Person API

Autocomplete

[Documentation](https://docs.crustdata.com/general/introduction) [API reference](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction)

##### API Reference

- [API Introduction](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction)

##### Company API

- [POST\\
\\
Search Companies](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only)
- [POST\\
\\
Identify Companies](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url)
- [POST\\
\\
Enrich Companies](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment)
- [POST\\
\\
Autocomplete](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields)

##### Person API

- [POST\\
\\
Search People](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting)
- [POST\\
\\
Enrich People](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset)
- [POST\\
\\
Autocomplete](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields)

##### Web API

- [POST\\
\\
Search](https://docs.crustdata.com/api-reference/web-apis/web-search)
- [POST\\
\\
Fetch](https://docs.crustdata.com/api-reference/web-apis/web-fetch)

##### Job API

- [POST\\
\\
Search Jobs](https://docs.crustdata.com/api-reference/job-apis/search-the-indexed-job-dataset)

close

cURL

title\_query

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "field": "experience.employment_details.current.title",
  "query": "VP",
  "limit": 5
}
'
```

200

title\_query

```
{
  "suggestions": [\
    {\
      "value": "VP"\
    },\
    {\
      "value": "VP of Sales"\
    },\
    {\
      "value": "vp"\
    },\
    {\
      "value": "VP Sales"\
    },\
    {\
      "value": "VP Operations"\
    }\
  ]
}
```

[Person API](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting)

# Autocomplete

Copy page

Return ranked field-value suggestions for any supported person
search field. Use this endpoint to discover the exact indexed values that
`/person/search` filters expect — feed the suggestion `value` back into a search filter
verbatim to retrieve the matching profiles.

Pass a partial `query` string for type-ahead behaviour, or pass an empty `query` to
retrieve the most common values for the field by frequency. An optional `filters` scope
lets you compute autocomplete results against a subset of the dataset (for example, top
job titles among current Google employees in the United States).

The top-level `field` must be one of the supported autocomplete fields — an allowlisted
subset of the field names used by `/person/search`, not every field exposed in its
request and response schemas. Sending an unsupported field returns a 400 whose error
message lists every accepted field.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

person

/

search

/

autocomplete

Try it

cURL

title\_query

```
curl --request POST \
  --url https://api.crustdata.com/person/search/autocomplete \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "field": "experience.employment_details.current.title",
  "query": "VP",
  "limit": 5
}
'
```

200

title\_query

```
{
  "suggestions": [\
    {\
      "value": "VP"\
    },\
    {\
      "value": "VP of Sales"\
    },\
    {\
      "value": "vp"\
    },\
    {\
      "value": "VP Sales"\
    },\
    {\
      "value": "VP Operations"\
    }\
  ]
}
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields#authorization-authorization)

Authorization

string

header

required

API key passed as a Bearer token in the Authorization header.

#### Headers

[​](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields#parameter-x-api-version)

x-api-version

string

required

API version to use. Must match a supported version (e.g., "2025-11-01").

Example:

`"2025-11-01"`

#### Body

application/json

Specify the dataset field to autocomplete, the partial `query` text to match against, an optional `limit` (1-100, default 20), and an optional `filters` scope that narrows the population the suggestions are computed against.

Request body for autocomplete suggestions on person search fields.

[​](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields#body-field)

field

string

required

The dataset API field name to get suggestions for. Valid fields include: basic\_profile.name, basic\_profile.headline, basic\_profile.languages, basic\_profile.location, basic\_profile.location.raw, basic\_profile.location.city, basic\_profile.location.state, basic\_profile.location.country, basic\_profile.location.continent, professional\_network.location, professional\_network.location.raw, professional\_network.location.city, professional\_network.location.state, professional\_network.location.country, professional\_network.location.continent, skills.professional\_network\_skills, experience.employment\_details.current.name, experience.employment\_details.current.title, experience.employment\_details.current.seniority\_level, experience.employment\_details.current.function\_category, experience.employment\_details.current.company\_industries, experience.employment\_details.current.company\_type, experience.employment\_details.current.company\_hq\_location, experience.employment\_details.current.company\_website\_domain, experience.employment\_details.past.name, experience.employment\_details.past.title, education.schools.school, education.schools.degree, education.schools.field\_of\_study, certifications.name, certifications.issuing\_organization, honors.title, social\_handles.twitter\_identifier.slug

Example:

`"basic_profile.location.city"`

[​](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields#body-query)

query

string

required

The search query text (can be empty to get top values by frequency)

Example:

`"VP"`

[​](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields#body-limit)

limit

integer

default:20

Maximum number of suggestions to return

Required range: `1 <= x <= 100`

[​](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields#body-filters)

filters

object

Optional filters to narrow down suggestions. Filter field names use the same dataset API field names.

- Option 1

- Option 2


Showchild attributes

Example:

```json
{
  "field": "experience.employment_details.current.company_name",
  "type": "=",
  "value": "Retool"
}
```

#### Response

200

application/json

Ranked autocomplete suggestions for the requested person search field.

Response with autocomplete suggestions for a person search field.

[​](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields#response-suggestions)

suggestions

object\[\]

required

Showchild attributes

Was this page helpful?

YesNo

[Enrich People\\
\\
Previous](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset) [Search\\
\\
Next](https://docs.crustdata.com/api-reference/web-apis/web-search)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.