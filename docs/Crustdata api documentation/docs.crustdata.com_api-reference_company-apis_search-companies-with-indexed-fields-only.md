---
url: "https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only"
title: "Search Companies - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/company-apis/search-companies-with-indexed-fields-only)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company API

Search Companies

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

search\_by\_domain

```
curl --request POST \
  --url https://api.crustdata.com/company/search \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "filters": {
    "field": "basic_info.primary_domain",
    "type": "=",
    "value": "hubspot.com"
  },
  "limit": 1,
  "fields": [\
    "basic_info",\
    "headcount",\
    "funding"\
  ]
}
'
```

200

search\_by\_domain\_response

```
{
  "companies": [\
    {\
      "basic_info": {\
        "name": "HubSpot",\
        "primary_domain": "hubspot.com",\
        "website": "https://hubspot.com",\
        "professional_network_url": "https://www.linkedin.com/company/hubspot",\
        "professional_network_id": "68529",\
        "company_type": "Public Company",\
        "year_founded": "2006",\
        "employee_count_range": "5001-10000",\
        "markets": [\
          "NYSE"\
        ],\
        "industries": [\
          "Software Development",\
          "Technology, Information and Internet"\
        ]\
      },\
      "headcount": {\
        "total": 11965\
      },\
      "funding": {\
        "total_investment_usd": 130000000,\
        "last_round_amount_usd": 100000000,\
        "last_fundraise_date": "2021-10-13",\
        "last_round_type": "",\
        "investors": []\
      }\
    }\
  ],
  "next_cursor": "H4sIAJj5zGkC_xXMMQ7CMAxA0...",
  "total_count": 264
}
```

[Company API](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only)

# Search Companies

Copy page

Search the Crustdata company database using filter conditions. Supports complex
AND/OR filter logic, cursor-based pagination, sorting, and field selection.
Only indexed fields are searchable; use /company/enrich for non-indexed fields
like news, people, or web\_traffic.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

company

/

search

Try it

cURL

search\_by\_domain

```
curl --request POST \
  --url https://api.crustdata.com/company/search \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "filters": {
    "field": "basic_info.primary_domain",
    "type": "=",
    "value": "hubspot.com"
  },
  "limit": 1,
  "fields": [\
    "basic_info",\
    "headcount",\
    "funding"\
  ]
}
'
```

200

search\_by\_domain\_response

```
{
  "companies": [\
    {\
      "basic_info": {\
        "name": "HubSpot",\
        "primary_domain": "hubspot.com",\
        "website": "https://hubspot.com",\
        "professional_network_url": "https://www.linkedin.com/company/hubspot",\
        "professional_network_id": "68529",\
        "company_type": "Public Company",\
        "year_founded": "2006",\
        "employee_count_range": "5001-10000",\
        "markets": [\
          "NYSE"\
        ],\
        "industries": [\
          "Software Development",\
          "Technology, Information and Internet"\
        ]\
      },\
      "headcount": {\
        "total": 11965\
      },\
      "funding": {\
        "total_investment_usd": 130000000,\
        "last_round_amount_usd": 100000000,\
        "last_fundraise_date": "2021-10-13",\
        "last_round_type": "",\
        "investors": []\
      }\
    }\
  ],
  "next_cursor": "H4sIAJj5zGkC_xXMMQ7CMAxA0...",
  "total_count": 264
}
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#authorization-authorization)

Authorization

string

header

required

API key passed as a Bearer token in the Authorization header.

#### Headers

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#parameter-x-api-version)

x-api-version

string

required

API version to use. Must match a supported version (e.g., "2025-11-01").

Example:

`"2025-11-01"`

#### Body

application/json

Search filters, pagination, sorting, and field selection

Request body for searching the company database using indexed fields.

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#body-filters)

filters

object

Search filters. Use a single `SearchCondition` or an and/or `SearchConditionGroup`.

- Option 1

- Option 2


Showchild attributes

Example:

```json
{
  "field": "basic_info.primary_domain",
  "type": "=",
  "value": "hubspot.com"
}
```

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#body-cursor)

cursor

string

Pagination cursor from a previous response's `next_cursor`. Omit on the first page.

Example:

`"H4sIAJj5zGkC_xXMMQ7CMAxA0..."`

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#body-limit)

limit

integer

default:20

Required range: `1 <= x <= 1000`

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#body-sorts)

sorts

object\[\]

Sort directives applied to matched companies in order.

Showchild attributes

Example:

```json
[\
  {\
    "column": "headcount.total",\
    "order": "desc"\
  }\
]
```

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#body-fields)

fields

string\[\]

Fields to return in the response. Use dot-notation for nested fields (e.g., "basic\_info.name", "headcount.total"). Only requested fields appear in the response. Valid top-level groups for search: basic\_info, revenue, headcount, funding, hiring, seo, competitors, locations, taxonomy, followers, social\_profiles, software\_reviews, roles, skills, metadata, updated\_at, indexed\_at, crustdata\_company\_id. Fields not in the search index (e.g., news, people, web\_traffic, employee\_reviews) return empty responses for search — use enrich for those.

Example:

```json
["basic_info", "headcount", "funding"]
```

#### Response

200

application/json

Companies matching the search criteria

Paginated response from the /company/search endpoint.

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#response-companies)

companies

object\[\]

required

Showchild attributes

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#response-next-cursor-one-of-0)

next\_cursor

string \| null

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#response-total-count-one-of-0)

total\_count

integer \| null

[​](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only#response-query)

query

object

Was this page helpful?

YesNo

[API Introduction\\
\\
Previous](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) [Identify Companies\\
\\
Next](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.