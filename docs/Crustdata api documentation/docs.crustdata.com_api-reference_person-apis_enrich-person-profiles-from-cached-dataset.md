---
url: "https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset"
title: "Enrich People - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/api-reference/person-apis/enrich-person-profiles-from-cached-dataset)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Person API

Enrich People

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

enrich\_by\_profile\_url

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "professional_network_profile_urls": [\
    "https://www.linkedin.com/in/abhilashchowdhary"\
  ]
}
'
```

200

enrich\_by\_profile\_url\_response

```
[\
  {\
    "matched_on": "https://www.linkedin.com/in/abhilashchowdhary",\
    "match_type": "professional_network_profile_url",\
    "matches": [\
      {\
        "confidence_score": 1,\
        "person_data": {\
          "basic_profile": {\
            "current_title": "Co-Founder & CEO",\
            "headline": "Co-founder at Crustdata (YC F24)",\
            "name": "Abhilash Chowdhary",\
            "location": {\
              "raw": "San Francisco, California, United States"\
            }\
          }\
        }\
      }\
    ]\
  }\
]
```

[Person API](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting)

# Enrich People

Copy page

Enrich person records using the Crustdata cached dataset. Provide either a profile URL or a business email
to retrieve detailed person data including employment history, education, skills, contact information, and developer platform data when available.
Exactly one identifier type must be provided per request. Supports batch enrichment of up to 25 profiles at once.

Default `rate-limit` is 15 requests per minute. Send an email to [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if needed for your use case.

Copy page

POST

https://api.crustdata.com

/

person

/

enrich

Try it

cURL

enrich\_by\_profile\_url

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --header 'x-api-version: <x-api-version>' \
  --data '
{
  "professional_network_profile_urls": [\
    "https://www.linkedin.com/in/abhilashchowdhary"\
  ]
}
'
```

200

enrich\_by\_profile\_url\_response

```
[\
  {\
    "matched_on": "https://www.linkedin.com/in/abhilashchowdhary",\
    "match_type": "professional_network_profile_url",\
    "matches": [\
      {\
        "confidence_score": 1,\
        "person_data": {\
          "basic_profile": {\
            "current_title": "Co-Founder & CEO",\
            "headline": "Co-founder at Crustdata (YC F24)",\
            "name": "Abhilash Chowdhary",\
            "location": {\
              "raw": "San Francisco, California, United States"\
            }\
          }\
        }\
      }\
    ]\
  }\
]
```

#### Authorizations

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#authorization-authorization)

Authorization

string

header

required

API key passed as a Bearer token in the Authorization header.

#### Headers

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#parameter-x-api-version)

x-api-version

string

required

API version to use. Must match a supported version (e.g., "2025-11-01").

Example:

`"2025-11-01"`

#### Body

application/json

Person identifier (profile URL or business email) and optional field selection.

- Option 1

- Option 2


Request body for /person/enrich and /person/professional\_network/enrich/live. Submit exactly one identifier type per request — professional\_network\_profile\_urls or business\_emails.

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#body-one-of-0-professional-network-profile-urls)

professional\_network\_profile\_urls

string\[\]

required

Array of professional-network profile URLs (max 25).

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#body-one-of-0-business-emails)

business\_emails

string\[\]

Business email of the person to lookup

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#body-one-of-0-fields)

fields

string\[\]

Fields to include in the response. Valid field groups for enrich: basic\_profile, professional\_network, skills, contact, social\_handles, experience, education, certifications, honors, dev\_platform\_profiles. Use dot-notation for nested fields (e.g., "basic\_profile.name", "experience.employment\_details"). If omitted, all available fields are returned.

Example:

```json
["basic_profile", "experience"]
```

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#body-one-of-0-min-similarity-score-one-of-0)

min\_similarity\_score

number \| null

Minimum similarity score for email matching

Required range: `0 <= x <= 1`

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#body-one-of-0-preview)

preview

boolean

default:false

Preview mode returns only basic profile fields and charges 0 credits. Cannot be combined with enrich\_realtime.

#### Response

200

application/json

Enriched person profiles

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#response-items-matched-on)

matched\_on

string

The specific input value (e.g., ' [someone@company.com](mailto:someone@company.com)')

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#response-items-match-type)

match\_type

enum<string>

Available options:

`professional_network_profile_url`,

`business_email`

[​](https://docs.crustdata.com/api-reference/person-apis/enrich-person-profiles-from-cached-dataset#response-items-matches)

matches

object\[\]

Showchild attributes

Example:

```json
[\
  {\
    "matched_on": "https://www.linkedin.com/in/dvdhsu/",\
    "match_type": "professional_network_profile_url",\
    "matches": []\
  }\
]
```

Was this page helpful?

YesNo

[Search People\\
\\
Previous](https://docs.crustdata.com/api-reference/person-apis/search-people-using-filters-and-sorting) [Autocomplete\\
\\
Next](https://docs.crustdata.com/api-reference/person-apis/get-autocomplete-suggestions-for-person-search-fields)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.