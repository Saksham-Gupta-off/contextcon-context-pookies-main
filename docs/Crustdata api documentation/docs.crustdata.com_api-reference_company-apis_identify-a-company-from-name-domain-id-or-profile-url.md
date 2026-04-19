---
url: "https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url"
title: "Identify Companies - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Company API

Identify Companies

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

identify\_by\_domain

```
curl --request POST \
  --url https://api.crustdata.com/company/identify \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "domains": [\
    "serverobotics.com"\
  ]
}
'
```

200

identify\_by\_domain\_response

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
              "description": null,\
              "company_type": null,\
              "year_founded": null,\
              "employee_count_range": "51-200",\
              "markets": null,\
              "industries": [\
                "Technology, Information and Internet",\
                "Technology, Information and Media"\
              ]\
            }\
          }\
        }\
      ]\
    }\
  ]
}
```

[Company API](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only)

# Identify Companies

Copy page

Match a company by name, website domain, profile URL, or Crustdata company ID.
Returns one or more matches ranked by confidence score. This endpoint is useful
for entity resolution before enrichment.

Current platform behavior returns a top-level array with one result per submitted
identifier. Each match currently includes `company_data.crustdata_company_id` and
`company_data.basic_info`.

Exactly one identifier type must be provided per request.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

company

/

identify

Try it

cURL

identify\_by\_domain

```
curl --request POST \
  --url https://api.crustdata.com/company/identify \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "domains": [\
    "serverobotics.com"\
  ]
}
'
```

200

identify\_by\_domain\_response

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
              "description": null,\
              "company_type": null,\
              "year_founded": null,\
              "employee_count_range": "51-200",\
              "markets": null,\
              "industries": [\
                "Technology, Information and Internet",\
                "Technology, Information and Media"\
              ]\
            }\
          }\
        }\
      ]\
    }\
  ]
}
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#authorization-authorization)

Authorization

string

header

required

API key passed as a Bearer token in the Authorization header.

#### Headers

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#parameter-x-api-version)

x-api-version

string

required

API version to use. Must match a supported version (e.g., "2025-11-01").

Example:

`"2025-11-01"`

#### Body

application/json

Company identifier plus optional exact\_match for domains. Provide exactly one of names, domains, crustdata\_company\_ids, or professional\_network\_profile\_urls.

Raw request parameters from query string

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#body-names-one-of-0)

names

string\[\] \| null

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#body-domains-one-of-0)

domains

string\[\] \| null

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#body-crustdata-company-ids-one-of-0)

crustdata\_company\_ids

integer\[\] \| null

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#body-professional-network-profile-urls-one-of-0)

professional\_network\_profile\_urls

string\[\] \| null

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#body-fields)

fields

string\[\]

Fields to include in the response. Valid field groups for enrich: basic\_info, revenue, headcount, funding, hiring, web\_traffic, seo, competitors, employee\_reviews, people, locations, taxonomy, followers, news, software\_reviews, social\_profiles, status. Not valid for enrich: roles, skills (search-only fields).

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#body-exact-match-one-of-0)

exact\_match

boolean \| null

Whether to use exact matching (null means auto-detect)

#### Response

200

application/json

Identified company matches returned as a top-level array

Response wrapper for /company/identify containing one entry per submitted identifier. Current platform behavior may return a top-level array; the `results` wrapper represents the documented contract.

[​](https://docs.crustdata.com/api-reference/company-apis/identify-a-company-from-name-domain-id-or-profile-url#response-results)

results

object\[\]

Showchild attributes

Was this page helpful?

YesNo

[Search Companies\\
\\
Previous](https://docs.crustdata.com/api-reference/company-apis/search-companies-with-indexed-fields-only) [Enrich Companies\\
\\
Next](https://docs.crustdata.com/api-reference/company-apis/get-full-company-enrichment)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.