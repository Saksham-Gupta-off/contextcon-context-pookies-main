---
url: "https://docs.crustdata.com/api-reference/web-apis/web-search"
title: "Search - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/web-apis/web-search#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/web-apis/web-search)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Web API

Search

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

basic\_search

```
curl --request POST \
  --url https://api.crustdata.com/web/search/live \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "query": "crustdata",
  "location": "US"
}
'
```

200

basic\_search\_response

```
{
  "success": true,
  "query": "crustdata",
  "timestamp": 1775195367446,
  "results": [\
    {\
      "source": "web",\
      "title": "Crustdata: Real-Time B2B Data Broker via API or Data Feed",\
      "url": "https://crustdata.com/",\
      "snippet": "Crustdata is a B2B data provider offering real-time company & people datasets. Access APIs and live signals to power sales and investment workflows.",\
      "position": 1\
    },\
    {\
      "source": "web",\
      "title": "Crustdata: Real-time B2B data via simple APIs",\
      "url": "https://www.ycombinator.com/companies/crustdata",\
      "snippet": "Crustdata provides live company and people data via APIs and full dataset delivery.",\
      "position": 2\
    },\
    {\
      "source": "web",\
      "title": "Crustdata (YC F24)",\
      "url": "https://www.linkedin.com/company/crustdata",\
      "snippet": "AI agents only grow revenue when they can act on the right data at the right time.",\
      "position": 3\
    }\
  ],
  "metadata": {
    "totalResults": 7,
    "failedPages": [],
    "emptyPages": []
  }
}
```

[Web API](https://docs.crustdata.com/api-reference/web-apis/web-search)

# Search

Copy page

Perform a web search query and return results from multiple sources
including web, news, academic articles, academic author profiles,
deep research results, and social media. Use this endpoint for competitive
intelligence, market research, lead generation, and content discovery.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

web

/

search

/

live

Try it

cURL

basic\_search

```
curl --request POST \
  --url https://api.crustdata.com/web/search/live \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "query": "crustdata",
  "location": "US"
}
'
```

200

basic\_search\_response

```
{
  "success": true,
  "query": "crustdata",
  "timestamp": 1775195367446,
  "results": [\
    {\
      "source": "web",\
      "title": "Crustdata: Real-Time B2B Data Broker via API or Data Feed",\
      "url": "https://crustdata.com/",\
      "snippet": "Crustdata is a B2B data provider offering real-time company & people datasets. Access APIs and live signals to power sales and investment workflows.",\
      "position": 1\
    },\
    {\
      "source": "web",\
      "title": "Crustdata: Real-time B2B data via simple APIs",\
      "url": "https://www.ycombinator.com/companies/crustdata",\
      "snippet": "Crustdata provides live company and people data via APIs and full dataset delivery.",\
      "position": 2\
    },\
    {\
      "source": "web",\
      "title": "Crustdata (YC F24)",\
      "url": "https://www.linkedin.com/company/crustdata",\
      "snippet": "AI agents only grow revenue when they can act on the right data at the right time.",\
      "position": 3\
    }\
  ],
  "metadata": {
    "totalResults": 7,
    "failedPages": [],
    "emptyPages": []
  }
}
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#authorization-authorization)

Authorization

string

header

required

Bearer token authentication. Pass your API key as `Authorization: Bearer <your_api_key>`.

#### Headers

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#parameter-x-api-version)

x-api-version

enum<string>

required

API version to use for request routing and response shape.

Available options:

`2025-11-01`

#### Body

application/json

Search query and optional filters.

Request body for performing a web search.

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#body-query)

query

string

required

The search query text. Keep queries concise and specific for better results. Supports standard search operators (e.g., site:, filetype:).

Required string length: `1 - 5000`

Example:

`"crustdata"`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#body-location-one-of-0)

location

string \| null

ISO 3166-1 alpha-2 country code for location targeting. Use this to get region-specific search results. Valid values include US, CA, MX, BR, AR, CL, CO, PE, VE, GB, DE, FR, IT, ES, PT, NL, BE, CH, AT, PL, SE, NO, DK, FI, IE, RU, UA, CZ, GR, TR, RO, HU, JP, CN, KR, IN, ID, TH, VN, MY, SG, PH, TW, HK, SA, AE, IL, EG, AU, NZ, ZA, NG, KE.

Example:

`"US"`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#body-sources-one-of-0)

sources

enum<string>\[\] \| null

List of search sources to query. If omitted, all sources are searched. Use specific sources to narrow results.

A search source type.

Available options:

`news`,

`web`,

`scholar-articles`,

`scholar-articles-enriched`,

`scholar-author`,

`ai`,

`social`

Example:

```json
["news", "web"]
```

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#body-site-one-of-0)

site

string \| null

Restrict search results to a specific site domain. For example, use "linkedin.com/company" to find company LinkedIn pages, or "site:github.com" for GitHub profiles.

Maximum string length: `500`

Example:

`"example.com"`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#body-start-date-one-of-0)

start\_date

integer \| null

Unix timestamp (seconds since epoch) for the start date filter. Must be less than end\_date if both are provided.

Example:

`1728259200`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#body-end-date-one-of-0)

end\_date

integer \| null

Unix timestamp (seconds since epoch) for the end date filter. Must be greater than start\_date if both are provided.

Example:

`1730937600`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#body-human-mode)

human\_mode

boolean

default:false

Whether to attempt bypassing Cloudflare protection for the search request.

Example:

`false`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#body-page)

page

integer

default:1

Number of search result pages to return.

Required range: `x >= 1`

Example:

`1`

#### Response

200

application/json

Successful search response with results.

Response object for a web search request.

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#response-success)

success

boolean

required

Whether the search was executed successfully.

Example:

`true`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#response-query)

query

string

required

The original search query that was submitted.

Example:

`"crustdata"`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#response-timestamp)

timestamp

integer

required

Unix timestamp in milliseconds when the search was performed.

Example:

`1762908151599`

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#response-results)

results

object\[\]

required

Array of search result entries.

Showchild attributes

Example:

```json
[\
  {\
    "source": "web",\
    "title": "Crustdata: Real-Time B2B Data Broker via API or Data Feed",\
    "url": "https://crustdata.com/",\
    "snippet": "Crustdata is a B2B data provider offering real-time company & people datasets.",\
    "position": 1\
  }\
]
```

[​](https://docs.crustdata.com/api-reference/web-apis/web-search#response-metadata)

metadata

object

required

Metadata about the search results.

Showchild attributes

Was this page helpful?

YesNo

[Autocomplete\\
\\
Previous](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields) [Fetch\\
\\
Next](https://docs.crustdata.com/api-reference/web-apis/web-fetch)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.