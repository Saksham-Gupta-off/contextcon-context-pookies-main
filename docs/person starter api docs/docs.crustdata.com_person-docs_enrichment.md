---
url: "https://docs.crustdata.com/person-docs/enrichment"
title: "Person Enrichment - Crustdata Docs"
---

[Skip to main content](https://docs.crustdata.com/person-docs/enrichment#content-area)

You are viewing the documentation of the new API versions. We would love to hear from you. You can write to use at [support@crustdata.tech](mailto:support@crustdata.tech) for feedback and clarifications.

[Crustdata Docs home page![light logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-black.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=4be4304c52a005d9356a20bad429a965)![dark logo](https://mintcdn.com/crustdata/D_7b8rIJs3leJu3M/logo/crustdata-logo-full-white.png?fit=max&auto=format&n=D_7b8rIJs3leJu3M&q=85&s=d4ae3a6c89ef13ad4eb1a4b0b341d33c)](https://docs.crustdata.com/)

Search...

Ctrl KAsk AI

- [Support](https://crustdata.com/demo)
- [Log In](https://docs.crustdata.com/login?redirect=/person-docs/enrichment)
- [Dashboard](https://app.crustdata.com/screenerv2)
- [Dashboard](https://app.crustdata.com/screenerv2)

Search...

Navigation

Person

Person Enrichment

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

- [Your first enrichment: look up a profile](https://docs.crustdata.com/person-docs/enrichment#your-first-enrichment-look-up-a-profile)
- [Understanding the response](https://docs.crustdata.com/person-docs/enrichment#understanding-the-response)
- [What is inside person\_data?](https://docs.crustdata.com/person-docs/enrichment#what-is-inside-person_data)
- [Reverse lookup: find a person from a business email](https://docs.crustdata.com/person-docs/enrichment#reverse-lookup-find-a-person-from-a-business-email)
- [How email reverse lookup works](https://docs.crustdata.com/person-docs/enrichment#how-email-reverse-lookup-works)
- [Handle no-match results](https://docs.crustdata.com/person-docs/enrichment#handle-no-match-results)
- [Batch enrichment: look up multiple people at once](https://docs.crustdata.com/person-docs/enrichment#batch-enrichment-look-up-multiple-people-at-once)
- [Batch enrichment tips](https://docs.crustdata.com/person-docs/enrichment#batch-enrichment-tips)
- [Need fresh data from the web?](https://docs.crustdata.com/person-docs/enrichment#need-fresh-data-from-the-web)
- [Advanced refresh flags](https://docs.crustdata.com/person-docs/enrichment#advanced-refresh-flags)
- [Request specific fields](https://docs.crustdata.com/person-docs/enrichment#request-specific-fields)
- [Popular fields for contact and developer workflows](https://docs.crustdata.com/person-docs/enrichment#popular-fields-for-contact-and-developer-workflows)
- [Choosing between profile URL and email enrichment](https://docs.crustdata.com/person-docs/enrichment#choosing-between-profile-url-and-email-enrichment)
- [Common workflow: Search then Enrich](https://docs.crustdata.com/person-docs/enrichment#common-workflow-search-then-enrich)
- [Request parameter reference](https://docs.crustdata.com/person-docs/enrichment#request-parameter-reference)
- [Response fields reference](https://docs.crustdata.com/person-docs/enrichment#response-fields-reference)
- [Person data sections](https://docs.crustdata.com/person-docs/enrichment#person-data-sections)
- [What to do next](https://docs.crustdata.com/person-docs/enrichment#what-to-do-next)

[Products](https://docs.crustdata.com/company-docs/quickstart)

[Person](https://docs.crustdata.com/person-docs/quickstart)

# Person Enrichment

Copy page

Learn how to enrich person profiles using profile URLs or business emails, from single lookups to batch enrichment.

Copy page

The Person Enrich API takes an identifier you already have — a profile URL or a business email — and returns a rich person profile. This page walks you through the API step by step, starting with the simplest possible request and building up to common enrichment patterns.Every request goes to the same endpoint:

```
POST https://api.crustdata.com/person/enrich
```

Replace `YOUR_API_KEY` in each example with your actual API key. All
requests require the `x-api-version: 2025-11-01` header.

**Pricing:** Base profile is `1 credit`. Add
`+2` for personal email, `+2` for phone,
`+1` for business email, and `+1` for developer
platform data. Maximum: `7 credits per profile`.

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#your-first-enrichment-look-up-a-profile)  Your first enrichment: look up a profile

The simplest enrichment takes a single profile URL and returns the person’s cached profile. Pass the URL in the `professional_network_profile_urls` array.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "professional_network_profile_urls": [\
      "https://www.linkedin.com/in/abhilashchowdhary/"\
    ]
  }'
```

Response trimmed for clarity. The full response can include employment
history, education, skills, contact data, and developer platform profiles
when available.

### [​](https://docs.crustdata.com/person-docs/enrichment\#understanding-the-response)  Understanding the response

The Enrich API returns an **array** — one entry per identifier you submitted. Each entry has three fields:

- **`matched_on`** — the identifier you submitted (a profile URL or email).
- **`match_type`** — either `professional_network_profile_url` or `business_email`, telling you which identifier type was used.
- **`matches`** — an array of candidate profiles. Each match includes a `confidence_score` (0 to 1) and the full `person_data` object.

For profile URL lookups, you will typically get exactly one match with a `confidence_score` of `1.0`, because the URL is a direct identifier.

### [​](https://docs.crustdata.com/person-docs/enrichment\#what-is-inside-person_data)  What is inside `person_data`?

The `person_data` object contains several sections:

| Section | Key fields | Description |
| --- | --- | --- |
| `basic_profile` | `name`, `headline`, `current_title`, `summary`, `location`, `languages` | Core identity and role information |
| `professional_network` | `connections`, `followers`, `open_to_cards`, `profile_picture_permalink` | Profile-level network metadata when available |
| `social_handles` | available social identifiers such as `twitter_identifier.slug` | Available social and profile identifiers |
| `experience` | `employment_details.current`, `employment_details.past` | Full work history when available |
| `education` | `schools` | Education background when available |
| `skills` | `professional_network_skills` | Listed professional skills when available |
| `contact` | `business_emails`, `personal_emails`, `phone_numbers`, `websites` | Contact data such as websites, phones, or email records |
| `dev_platform_profiles` | developer platform profile objects | Developer platform profiles and activity when available |

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#reverse-lookup-find-a-person-from-a-business-email)  Reverse lookup: find a person from a business email

You do not always have a profile URL. If you have a business email, use `business_emails` to reverse-lookup the person behind the address.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "business_emails": ["abhilash@crustdata.com"],
    "min_similarity_score": 0.8
  }'
```

Response trimmed for clarity.

### [​](https://docs.crustdata.com/person-docs/enrichment\#how-email-reverse-lookup-works)  How email reverse lookup works

When you submit a business email, the API resolves it to a public person profile. The response structure is identical to a profile URL lookup, but `match_type` is `business_email` and `matched_on` shows the email you submitted.The `min_similarity_score` parameter controls how strict the matching is. A value of `0.8` means the API only returns matches where it is at least 80% confident the email belongs to the person. Higher values give fewer but more reliable results.

| `min_similarity_score` | When to use |
| --- | --- |
| `0.9` – `1.0` | High-confidence workflows (CRM enrichment, automated pipelines) |
| `0.7` – `0.8` | Balanced accuracy for most use cases |
| `0.5` – `0.6` | Exploratory lookups where you will manually verify |
| Not set | Returns all matches regardless of confidence |

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#handle-no-match-results)  Handle no-match results

Not every identifier will resolve to a person. When there is no match, the `matches` array is empty.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "business_emails": ["nonexistent@unknowndomain.com"],
    "min_similarity_score": 0.8
  }'
```

You still get a response entry for the identifier — `matched_on` tells you which input had no match. This makes it easy to track which lookups succeeded and which need a different approach.

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#batch-enrichment-look-up-multiple-people-at-once)  Batch enrichment: look up multiple people at once

You can enrich up to **25 identifiers** in a single request. The response returns one entry per identifier, in the same order you submitted them.

Request

Response

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "professional_network_profile_urls": [\
      "https://www.linkedin.com/in/dvdhsu/",\
      "https://www.linkedin.com/in/abhilashchowdhary/"\
    ]
  }'
```

Response trimmed for clarity.

### [​](https://docs.crustdata.com/person-docs/enrichment\#batch-enrichment-tips)  Batch enrichment tips

- The maximum batch size is **25 identifiers** per request.
- You must use **one identifier type** per request — either all profile URLs or all emails, not a mix.
- Each entry in the response corresponds to the input at the same position, so you can match results back to your input list by index.
- If some identifiers fail to match, their `matches` array will be empty, but the request still succeeds for the others.

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#need-fresh-data-from-the-web)  Need fresh data from the web?

If the cached enrich response is missing a recent update or you need real-time retrieval from the web, use [Person Live Enrich](https://docs.crustdata.com/person-docs/live-enrich). That endpoint is designed for fresh profile retrieval when cached enrich is not enough.

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#advanced-refresh-flags)  Advanced refresh flags

The API currently accepts two advanced refresh flags on `/person/enrich`:

| Flag | Type | What it does |
| --- | --- | --- |
| `force_fetch` | boolean | Request a fresh fetch path when supported. |
| `enrich_realtime` | boolean | Request realtime enrich behavior when supported. |

**Current platform behavior:** both flags are accepted on `/person/enrich`
and return the standard enrich response envelope. Their exact effect can
vary by cache state and account access, so confirm the behavior you need
before relying on either flag in production.

Advanced refresh example

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "professional_network_profile_urls": [\
      "https://www.linkedin.com/in/abhilashchowdhary/"\
    ],
    "force_fetch": true
  }'
```

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#request-specific-fields)  Request specific fields

By default, the API returns all available data. If you only need specific information, use the `fields` parameter to request just what you need.

Request specific fields

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "professional_network_profile_urls": [\
      "https://www.linkedin.com/in/dvdhsu/"\
    ],
    "fields": [\
      "basic_profile.summary",\
      "contact",\
      "dev_platform_profiles"\
    ]
  }'
```

### [​](https://docs.crustdata.com/person-docs/enrichment\#popular-fields-for-contact-and-developer-workflows)  Popular fields for contact and developer workflows

| Field path | What it returns |
| --- | --- |
| `basic_profile.summary` | The person’s summary or about text |
| `contact` | Contact section with email records, phone numbers, and websites when available |
| `contact.business_emails` | Business email records when available |
| `contact.personal_emails` | Personal email records when available |
| `contact.phone_numbers` | Phone numbers when available |
| `contact.websites` | Personal or company-linked websites |
| `dev_platform_profiles` | Developer platform profiles when available |
| `social_handles.dev_platform_identifier.profile_url` | Canonical developer platform profile URL when available |
| `experience.employment_details.current.company_name` | The person’s current company name |

Use `contact` when you want contact-ready records and
`dev_platform_profiles` when you want developer platform context in the same
enrich response.

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#choosing-between-profile-url-and-email-enrichment)  Choosing between profile URL and email enrichment

Both paths return the same `person_data` shape, but they work differently.

|  | Profile URL | Business email |
| --- | --- | --- |
| **Identifier** | `professional_network_profile_urls` | `business_emails` |
| **Match type** | Direct lookup — the URL uniquely identifies a profile | Reverse lookup — the API infers which profile owns the email |
| **Confidence** | Always `1.0` (exact match) | Varies. Use `min_similarity_score` to control the threshold |
| **Best for** | When you already have the profile URL | When you only have an email |
| **Batch limit** | Up to 25 URLs per request | Up to 25 emails per request |

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#common-workflow-search-then-enrich)  Common workflow: Search then Enrich

The most powerful pattern combines [Person Search](https://docs.crustdata.com/person-docs/search) with Person Enrich. Search finds people matching your criteria; Enrich gets the full profile for each match.**Step 1:** Search for decision-makers at a target company.

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
          "field": "experience.employment_details.current.company_name",\
          "type": "in",\
          "value": ["Retool"]\
        },\
        {\
          "field": "experience.employment_details.current.title",\
          "type": "(.)",\
          "value": "VP|Director|Head of"\
        }\
      ]
    },
    "limit": 5
  }'
```

**Step 2:** Take the profile URLs from the search results and enrich them for full profiles.

```
curl --request POST \
  --url https://api.crustdata.com/person/enrich \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "professional_network_profile_urls": [\
      "https://www.linkedin.com/in/dvdhsu/",\
      "https://www.linkedin.com/in/abhilashchowdhary/"\
    ]
  }'
```

This two-step pattern is the foundation for most sales, recruiting, and research workflows. Search narrows the universe; Enrich fills in the details.

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#request-parameter-reference)  Request parameter reference

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `professional_network_profile_urls` | string\[\] | One of `professional_network_profile_urls` or `business_emails` | — | Profile URLs to enrich. Max 25. |
| `business_emails` | string\[\] | One of `professional_network_profile_urls` or `business_emails` | — | Business emails for reverse lookup. Max 25. |
| `fields` | string\[\] | No | All fields | Specific field paths or section groups to return. |
| `min_similarity_score` | number (0–1) | No | None | Minimum confidence threshold for email reverse lookup matches. |
| `force_fetch` | boolean | No | `false` | Advanced flag accepted by the API to request a fresh fetch path when supported. |
| `enrich_realtime` | boolean | No | `false` | Advanced flag accepted by the API to request realtime enrich behavior when supported. |

## [​](https://docs.crustdata.com/person-docs/enrichment\#response-fields-reference)  Response fields reference

Each item in the response array contains:

| Field | Type | Description |
| --- | --- | --- |
| `matched_on` | string | The input identifier (profile URL or email) |
| `match_type` | string | `professional_network_profile_url` or `business_email` |
| `matches` | array | Array of candidate matches (may be empty for no-match) |
| `matches[].confidence_score` | number | 0 to 1. How confident the match is. `1.0` = exact match. |
| `matches[].person_data` | object | Full enriched profile (see table below) |

### [​](https://docs.crustdata.com/person-docs/enrichment\#person-data-sections)  Person data sections

| Section | Key fields | Description |
| --- | --- | --- |
| `basic_profile` | `name`, `headline`, `current_title`, `summary`, `location`, `languages`, `last_updated` | Core identity and role |
| `professional_network` | `profile_picture_permalink`, `connections`, `followers`, `open_to_cards` | Profile metadata when available |
| `social_handles` | available social identifiers such as `twitter_identifier.slug` | Available social identifiers |
| `experience` | `employment_details.current[]`, `employment_details.past[]` | Full employment history |
| `education` | `schools[]` | Education background |
| `skills` | `professional_network_skills[]` | Professional skills |
| `contact` | `business_emails[]`, `personal_emails[]`, `phone_numbers[]`, `websites[]` | Contact data when available |
| `dev_platform_profiles` | developer platform profile objects | Developer platform data when available |

* * *

## [​](https://docs.crustdata.com/person-docs/enrichment\#what-to-do-next)  What to do next

- **Search first, then enrich** — use [Person Search](https://docs.crustdata.com/person-docs/search) to find people by name, title, company, or location, then enrich the results.
- **Fetch fresh data from the web** — use [Person Live Enrich](https://docs.crustdata.com/person-docs/live-enrich) when cached enrich is not enough.
- **See more examples** — browse [person examples](https://docs.crustdata.com/person-docs/examples) for ready-to-copy patterns.
- **Read the overview** — see [Person APIs](https://docs.crustdata.com/person-docs/quickstart) for a high-level guide to choosing between search and enrich.
- **Check the API reference** — see the [OpenAPI spec](https://docs.crustdata.com/openapi-specs/2025-11-01/introduction) for the full schema.

Was this page helpful?

YesNo

[Person Search\\
\\
Previous](https://docs.crustdata.com/person-docs/search) [Person Autocomplete\\
\\
Next](https://docs.crustdata.com/person-docs/autocomplete)

Ctrl+I

[x](https://x.com/crustdata) [linkedin](https://www.linkedin.com/company/crustdata)

Assistant

Responses are generated using AI and may contain mistakes.