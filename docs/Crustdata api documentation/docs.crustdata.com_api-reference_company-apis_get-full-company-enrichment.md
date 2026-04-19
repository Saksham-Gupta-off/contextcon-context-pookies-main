---
url: "https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment"
title: "Enrich Companies - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/company-apis/get-full-company-enrichment)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company API

Enrich Companies

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

enrich\_by\_domain

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "domains": [\
    "serverobotics.com"\
  ],
  "fields": [\
    "basic_info",\
    "headcount",\
    "funding"\
  ]
}
'
```

200

enrich\_by\_domain\_response

```
{
  "results": [\
    {\
      "matched_on": "serverobotics.com",\
      "match_type": "domain",\
      "matches": [\
        {\
          "confidence_score": 1,\
          "company_data": {\
            "crustdata_company_id": 628895,\
            "basic_info": {\
              "crustdata_company_id": 628895,\
              "name": "Serve Robotics",\
              "primary_domain": "serverobotics.com",\
              "all_domains": [\
                "serverobotics.com"\
              ],\
              "website": "https://www.serverobotics.com/",\
              "professional_network_url": "https://www.linkedin.com/company/serverobotics",\
              "professional_network_id": "72049930",\
              "profile_name": "Serve Robotics",\
              "logo_permalink": "https://crustdata-media.s3.us-east-2.amazonaws.com/company/9f84e252d0f9e35c95843303b33eda9313148adb54404d06947be750e9187db5.jpg",\
              "description": "Serve Robotics (NASDAQ:SERV) develops advanced, AI-powered, low-emissions sidewalk delivery robots that endeavor to make delivery sustainable and economical. Spun off from Uber in 2021 as an independent company, Serve has completed tens of thousands of deliveries for enterprise partners such as Uber Eats and 7-Eleven. The company has scalable multi-year contracts, including a signed agreement to deploy up to 2,000 delivery robots on the Uber Eats platform across multiple U.S. markets. Come join us, we are hiring!",\
              "company_type": "Public Company",\
              "year_founded": "2021-01-01",\
              "employee_count_range": "51-200",\
              "markets": [\
                "PRIVATE",\
                "NASDAQ"\
              ],\
              "industries": [\
                "Technology, Information and Internet",\
                "Technology, Information and Media"\
              ]\
            },\
            "headcount": {\
              "total": 381\
            },\
            "funding": {\
              "total_investment_usd": 394000000,\
              "last_round_amount_usd": 100000000,\
              "last_fundraise_date": "2025-10-10",\
              "last_round_type": "post_ipo_equity"\
            }\
          }\
        }\
      ]\
    }\
  ]
}
```

[Company API](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only)

# Enrich Companies

Copy page

Get comprehensive company data including firmographics, headcount, funding,
web traffic, employee reviews, people (founders, CXOs, decision makers), news,
and more. Identify the company by domain, name, profile URL, or Crustdata company ID.
Use the fields parameter to select specific data groups and reduce response size.

Current platform behavior returns a top-level array with one result per submitted
identifier. The same endpoint supports multiple identifiers of one type in a single
request. No-match responses currently return `200` with an empty `matches` array.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

company

/

enrich

Try it

cURL

enrich\_by\_domain

```
curl --request POST \
  --url https://api.crustdata.com/company/enrich \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "domains": [\
    "serverobotics.com"\
  ],
  "fields": [\
    "basic_info",\
    "headcount",\
    "funding"\
  ]
}
'
```

200

enrich\_by\_domain\_response

```
{
  "results": [\
    {\
      "matched_on": "serverobotics.com",\
      "match_type": "domain",\
      "matches": [\
        {\
          "confidence_score": 1,\
          "company_data": {\
            "crustdata_company_id": 628895,\
            "basic_info": {\
              "crustdata_company_id": 628895,\
              "name": "Serve Robotics",\
              "primary_domain": "serverobotics.com",\
              "all_domains": [\
                "serverobotics.com"\
              ],\
              "website": "https://www.serverobotics.com/",\
              "professional_network_url": "https://www.linkedin.com/company/serverobotics",\
              "professional_network_id": "72049930",\
              "profile_name": "Serve Robotics",\
              "logo_permalink": "https://crustdata-media.s3.us-east-2.amazonaws.com/company/9f84e252d0f9e35c95843303b33eda9313148adb54404d06947be750e9187db5.jpg",\
              "description": "Serve Robotics (NASDAQ:SERV) develops advanced, AI-powered, low-emissions sidewalk delivery robots that endeavor to make delivery sustainable and economical. Spun off from Uber in 2021 as an independent company, Serve has completed tens of thousands of deliveries for enterprise partners such as Uber Eats and 7-Eleven. The company has scalable multi-year contracts, including a signed agreement to deploy up to 2,000 delivery robots on the Uber Eats platform across multiple U.S. markets. Come join us, we are hiring!",\
              "company_type": "Public Company",\
              "year_founded": "2021-01-01",\
              "employee_count_range": "51-200",\
              "markets": [\
                "PRIVATE",\
                "NASDAQ"\
              ],\
              "industries": [\
                "Technology, Information and Internet",\
                "Technology, Information and Media"\
              ]\
            },\
            "headcount": {\
              "total": 381\
            },\
            "funding": {\
              "total_investment_usd": 394000000,\
              "last_round_amount_usd": 100000000,\
              "last_fundraise_date": "2025-10-10",\
              "last_round_type": "post_ipo_equity"\
            }\
          }\
        }\
      ]\
    }\
  ]
}
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#authorization-authorization)

Authorization

string

header

required

API key passed as a Bearer token in the Authorization header.

#### Headers

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#parameter-x-api-version)

x-api-version

string

required

API version to use. Must match a supported version (e.g., "2025-11-01").

Example:

`"2025-11-01"`

#### Body

application/json

Company identifier plus optional field selection and exact\_match. Submit one identifier type per request.

Raw request parameters from query string

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#body-names-one-of-0)

names

string\[\] \| null

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#body-domains-one-of-0)

domains

string\[\] \| null

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#body-crustdata-company-ids-one-of-0)

crustdata\_company\_ids

integer\[\] \| null

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#body-professional-network-profile-urls-one-of-0)

professional\_network\_profile\_urls

string\[\] \| null

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#body-fields)

fields

string\[\]

Fields to include in the response. Valid field groups for enrich: basic\_info, revenue, headcount, funding, hiring, web\_traffic, seo, competitors, employee\_reviews, people, locations, taxonomy, followers, news, software\_reviews, social\_profiles, status. Not valid for enrich: roles, skills (search-only fields).

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#body-exact-match-one-of-0)

exact\_match

boolean \| null

Whether to use exact matching (null means auto-detect)

#### Response

200

application/json

Enriched company matches returned as a top-level array

Response wrapper for /company/enrich containing one entry per submitted identifier. Current platform behavior may return a top-level array; the `results` wrapper represents the documented contract.

[​](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment#response-results)

results

object\[\]

Showchild attributes

Was this page helpful?

YesNo

[Identify Companies\\
\\
Previous](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url) [Autocomplete\\
\\
Next](https://docs.crustdata.com/api-reference/company-apis/get-autocomplete-suggestions-for-company-search-fields)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.