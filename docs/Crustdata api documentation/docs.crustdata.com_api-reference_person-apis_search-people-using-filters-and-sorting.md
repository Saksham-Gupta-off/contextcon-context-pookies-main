---
url: "https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting"
title: "Search People - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/person-apis/search-people-using-filters-and-sorting)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Person API

Search People

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

search\_by\_title

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "filters": {
    "field": "experience.employment_details.current.title",
    "type": "=",
    "value": "CEO"
  },
  "limit": 1
}
'
```

200

search\_by\_title\_response

```
{
  "profiles": [\
    {\
      "basic_profile": {\
        "name": "Nithin Kamath"\
      },\
      "experience": {\
        "employment_details": {\
          "current": [\
            {\
              "title": "CEO"\
            },\
            {\
              "title": "Founder & CEO"\
            }\
          ]\
        }\
      }\
    }\
  ],
  "next_cursor": "H4sIACIdzWkC...",
  "total_count": 1105055
}
```

[Person API](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting)

# Search People

Copy page

Search the Crustdata person database using flexible filter conditions, sorting, and cursor-based pagination.
Supports filtering on hundreds of fields including job title, company, location, seniority, industry, education, and more.
Use compound conditions with AND/OR logic to build complex queries. Results can be sorted and paginated using cursors.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

person

/

search

Try it

cURL

search\_by\_title

```
curl --request POST \
  --url https://api.crustdata.com/person/search \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "filters": {
    "field": "experience.employment_details.current.title",
    "type": "=",
    "value": "CEO"
  },
  "limit": 1
}
'
```

200

search\_by\_title\_response

```
{
  "profiles": [\
    {\
      "basic_profile": {\
        "name": "Nithin Kamath"\
      },\
      "experience": {\
        "employment_details": {\
          "current": [\
            {\
              "title": "CEO"\
            },\
            {\
              "title": "Founder & CEO"\
            }\
          ]\
        }\
      }\
    }\
  ],
  "next_cursor": "H4sIACIdzWkC...",
  "total_count": 1105055
}
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#authorization-authorization)

Authorization

string

header

required

API key passed as a Bearer token in the Authorization header.

#### Headers

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#parameter-x-api-version)

x-api-version

string

required

API version to use. Must match a supported version (e.g., "2025-11-01").

Example:

`"2025-11-01"`

#### Body

application/json

Search filters, sorting, pagination, and field selection options.

Request body for /person/search. Use filters (optionally grouped with and/or), sorts, limit, and cursor pagination.

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#body-filters)

filters

object

required

Filter criteria — a single `PersonSearchCondition` or an and/or `PersonSearchConditionGroup`.

- Option 1

- Option 2


Showchild attributes

Example:

```json
{
  "field": "experience.employment_details.current.title",
  "type": "=",
  "value": "CEO"
}
```

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#body-sorts)

sorts

object\[\]

Sort directives applied to matched people in order.

Showchild attributes

Example:

```json
[\
  {\
    "field": "crustdata_person_id",\
    "order": "asc"\
  }\
]
```

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#body-limit)

limit

integer

default:20

Required range: `1 <= x <= 1000`

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#body-count)

count

integer

Alias for limit.

Required range: `1 <= x <= 1000`

Example:

`20`

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#body-cursor-one-of-0)

cursor

string \| null

Pagination cursor from a previous response's `next_cursor`. Omit on the first page.

Example:

`"H4sIACIdzWkC..."`

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#body-post-processing)

post\_processing

object

Post-processing options applied to search results (e.g., exclusions).

Showchild attributes

Example:

```json
{
  "exclude_profiles": ["https://www.linkedin.com/in/jane-doe"],
  "exclude_names": ["Jane Doe"]
}
```

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#body-return-query)

return\_query

boolean

default:false

Debug flag - include search query in response

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#body-preview)

preview

boolean

default:false

Preview mode - return only basic fields for faster response

#### Response

200

application/json

People matching the search criteria

Paginated response from the person search endpoint containing matched profiles and pagination metadata.

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#response-profiles)

profiles

object\[\]

required

Array of person profiles matching the search criteria

Showchild attributes

Example:

```json
[]
```

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#response-next-cursor-one-of-0)

next\_cursor

string \| null

Opaque cursor string for fetching the next page of results. Pass this value as the cursor parameter in subsequent requests. Null when no more results are available.

Example:

`"H4sIACIdzWkC_xWMMQ7DIAwAv..."`

[​](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting#response-total-count-one-of-0)

total\_count

integer \| null

Total number of profiles matching the search criteria across all pages

Example:

`1105055`

Was this page helpful?

YesNo

[Autocomplete\\
\\
Previous](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields) [Enrich People\\
\\
Next](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.