---
url: "https://docs.crustdata.com/api-reference/web-apis/web-fetch"
title: "Fetch - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/web-apis/web-fetch#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/web-apis/web-fetch)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Web API

Fetch

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

single\_url

```
curl --request POST \
  --url https://api.crustdata.com/web/enrich/live \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "urls": [\
    "https://example.com"\
  ]
}
'
```

200

single\_url\_success

```
[\
  {\
    "success": true,\
    "url": "https://example.com",\
    "timestamp": 1775193366,\
    "title": "Example Domain",\
    "content": "<html lang=\"en\"><head><title>Example Domain</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style>body{background:#eee;width:60vw;margin:15vh auto;font-family:system-ui,sans-serif}h1{font-size:1.5em}div{opacity:0.8}a:link,a:visited{color:#348}</style></head><body><div><h1>Example Domain</h1><p>This domain is for use in documentation examples without needing permission. Avoid use in operations.</p><p><a href=\"https://iana.org/domains/example\">Learn more</a></p></div>\n</body></html>"\
  }\
]
```

[Web API](https://docs.crustdata.com/api-reference/web-apis/web-search)

# Fetch

Copy page

Fetch the HTML content of webpages given their URLs. Retrieves the page
title and full HTML content for up to 10 URLs in a single request. Use
this for content extraction, web content retrieval, data collection, content
monitoring, and SEO analysis.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

web

/

enrich

/

live

Try it

cURL

single\_url

```
curl --request POST \
  --url https://api.crustdata.com/web/enrich/live \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "urls": [\
    "https://example.com"\
  ]
}
'
```

200

single\_url\_success

```
[\
  {\
    "success": true,\
    "url": "https://example.com",\
    "timestamp": 1775193366,\
    "title": "Example Domain",\
    "content": "<html lang=\"en\"><head><title>Example Domain</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style>body{background:#eee;width:60vw;margin:15vh auto;font-family:system-ui,sans-serif}h1{font-size:1.5em}div{opacity:0.8}a:link,a:visited{color:#348}</style></head><body><div><h1>Example Domain</h1><p>This domain is for use in documentation examples without needing permission. Avoid use in operations.</p><p><a href=\"https://iana.org/domains/example\">Learn more</a></p></div>\n</body></html>"\
  }\
]
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#authorization-authorization)

Authorization

string

header

required

Bearer token authentication. Pass your API key as `Authorization: Bearer <your_api_key>`.

#### Headers

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#parameter-x-api-version)

x-api-version

enum<string>

required

API version to use for request routing and response shape.

Available options:

`2025-11-01`

#### Body

application/json

List of URLs to fetch and optional settings.

Request body for fetching webpage content.

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#body-urls)

urls

string\[\]

required

List of URLs to fetch web content for. Each URL must include the protocol prefix (http:// or https://). Maximum of 10 URLs per request.

Required array length: `1 - 10` elements

A fully-qualified URL to fetch.

Maximum string length: `2000`

Example:

```json
["https://example.com"]
```

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#body-human-mode)

human\_mode

boolean

default:false

Whether to attempt bypassing Cloudflare protection when fetching pages behind Cloudflare.

Example:

`false`

#### Response

200

application/json

Array of fetch results, one per URL. Each result includes a success flag. Failed URLs have null fields.

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#response-items-success)

success

boolean

Whether the content was fetched successfully for this URL.

Example:

`true`

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#response-items-url-one-of-0)

url

string \| null

The URL that was fetched. Null if the fetch failed.

Example:

`"https://example.com"`

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#response-items-timestamp-one-of-0)

timestamp

integer \| null

Unix timestamp (seconds) of when the content was fetched. Null if the fetch failed.

Example:

`1775193366`

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#response-items-title-one-of-0)

title

string \| null

The title of the fetched webpage from the HTML title tag. Null if the fetch failed.

Example:

`"Example Domain"`

[​](https://docs.crustdata.com/api-reference/web-apis/web-fetch#response-items-content-one-of-0)

content

string \| null

The full HTML content of the fetched webpage. Null if the fetch failed.

Was this page helpful?

YesNo

[Search\\
\\
Previous](https://docs.crustdata.com/api-reference/web-apis/web-search) [Search Jobs\\
\\
Next](https://docs.crustdata.com/api-reference/job-apis/search-the-indexed-job-dataset)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.