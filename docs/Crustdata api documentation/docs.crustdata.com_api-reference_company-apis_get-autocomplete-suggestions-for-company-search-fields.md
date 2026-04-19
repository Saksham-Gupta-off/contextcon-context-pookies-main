---
url: "https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields"
title: "Autocomplete - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company API

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

autocomplete\_industries

```
curl --request POST \
  --url https://api.crustdata.com/company/search/autocomplete \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "field": "basic_info.industries",
  "query": "tech",
  "limit": 5
}
'
```

200

400

401

500

```
{
  "suggestions": [\
    {\
      "value": "Technology, Information and Media"\
    },\
    {\
      "value": "Technology, Information and Internet"\
    },\
    {\
      "value": "Information Technology & Services"\
    },\
    {\
      "value": "Biotechnology Research"\
    },\
    {\
      "value": "Technical and Vocational Training"\
    }\
  ]
}
```

[Company API](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only)

# Autocomplete

Copy page

Returns field value suggestions with document counts for company search fields.
Useful for discovering valid filter values before building search queries.
Accepts field names from the /company/search response schema using dot notation.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

company

/

search

/

autocomplete

Try it

cURL

autocomplete\_industries

```
curl --request POST \
  --url https://api.crustdata.com/company/search/autocomplete \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "field": "basic_info.industries",
  "query": "tech",
  "limit": 5
}
'
```

200

400

401

500

```
{
  "suggestions": [\
    {\
      "value": "Technology, Information and Media"\
    },\
    {\
      "value": "Technology, Information and Internet"\
    },\
    {\
      "value": "Information Technology & Services"\
    },\
    {\
      "value": "Biotechnology Research"\
    },\
    {\
      "value": "Technical and Vocational Training"\
    }\
  ]
}
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields#authorization-authorization)

Authorization

string

header

required

API key passed as a Bearer token in the Authorization header.

#### Headers

[​](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields#parameter-x-api-version)

x-api-version

string

required

API version to use. Must match a supported version (e.g., "2025-11-01").

Example:

`"2025-11-01"`

#### Body

application/json

Field name, query text, and optional filters for autocomplete

Request body for autocomplete suggestions on company search fields.

[​](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields#body-field)

field

string

required

The dataset API field name to get suggestions for. Valid fields include: basic\_info.name, basic\_info.primary\_domain, basic\_info.website, basic\_info.professional\_network\_url, basic\_info.professional\_network\_id, basic\_info.company\_type, basic\_info.year\_founded, basic\_info.employee\_count\_range, basic\_info.markets, basic\_info.industries, revenue.estimated.lower\_bound\_usd, revenue.estimated.upper\_bound\_usd, revenue.acquisition\_status, funding.total\_investment\_usd, funding.last\_round\_type, funding.last\_fundraise\_date, funding.investors, headcount.latest\_count, headcount.largest\_headcount\_country, locations.country, locations.state, locations.city, taxonomy.professional\_network\_industry, taxonomy.professional\_network\_specialities, taxonomy.categories, followers.latest\_count, social\_profiles.crunchbase.url, social\_profiles.twitter\_url

Example:

`"taxonomy.professional_network_industry"`

[​](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields#body-query)

query

string

required

The search query text (can be empty to get top values by frequency)

Example:

`"tech"`

[​](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields#body-limit)

limit

integer

default:20

Maximum number of suggestions to return

Required range: `1 <= x <= 100`

[​](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields#body-filters)

filters

object

Optional filters to narrow down suggestions

- Option 1

- Option 2


Showchild attributes

Example:

```json
{
  "field": "locations.country",
  "type": "=",
  "value": "USA"
}
```

#### Response

200

application/json

Autocomplete suggestions with document counts

Response with autocomplete suggestions for a company search field.

[​](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields#response-suggestions)

suggestions

object\[\]

required

Showchild attributes

Was this page helpful?

YesNo

[Enrich Companies\\
\\
Previous](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment) [Search People\\
\\
Next](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.