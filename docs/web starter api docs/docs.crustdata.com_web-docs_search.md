> ## Documentation Index
> Fetch the complete documentation index at: https://docs.crustdata.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Web Search

> Search the web across multiple sources including web, news, academic papers, deep research mode, and social media.

**Use this when** you want to find web pages, news articles, academic papers, author profiles, AI-generated overviews, or social media posts matching a search query.

The Web Search API accepts a query and returns results from one or more source types. The result shape varies by source — always specify `sources` explicitly when you need predictable parsing.

Every request goes to the same endpoint:

```
POST https://api.crustdata.com/web/search/live
```

<Snippet file="web-auth-headers.mdx" />

<CardGroup cols={3}>
  <Card title="Parameters" icon="sliders" href="#request-body">
    Request fields and defaults
  </Card>

  <Card title="Result shapes" icon="shapes" href="#result-shapes-by-source">
    Per-source field tables with Tabs
  </Card>

  <Card title="Field matrix" icon="table" href="#field-presence-by-source">
    Which fields exist for each source
  </Card>
</CardGroup>

<Callout icon="lock" color="#f59e0b">
  <strong>Pricing:</strong> <code>1 credit per query</code>.
</Callout>

<Note>
  Default `rate-limit` is 15 requests per minute. Send an email to
  [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if
  needed for your use case.
</Note>

## Request body

| Parameter    | Type      | Required | Default | Description                                                                                                                                                                                  |
| ------------ | --------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`      | string    | Yes      | —       | Search query text. Max 5,000 characters. Supports search operators like `site:` and `filetype:`.                                                                                             |
| `location`   | string    | No       | —       | ISO 3166-1 alpha-2 country code for region-specific results (e.g., `"US"`, `"GB"`, `"JP"`).                                                                                                  |
| `sources`    | string\[] | No       | —       | Sources to query: `web`, `news`, `scholar-articles`, `scholar-articles-enriched`, `scholar-author`, `ai`, `social`. **Current platform behavior:** omitting this field searches all sources. |
| `site`       | string    | No       | —       | Restrict results to a domain (e.g., `"linkedin.com/company"`, `"github.com"`). Max 500 characters.                                                                                           |
| `start_date` | integer   | No       | —       | Unix timestamp (seconds). Only results after this date.                                                                                                                                      |
| `end_date`   | integer   | No       | —       | Unix timestamp (seconds). Only results before this date. Must be > `start_date`.                                                                                                             |
| `human_mode` | boolean   | No       | `false` | Attempt a browser-like retrieval path when standard search access is blocked by bot protection.                                                                                              |
| `page`       | integer   | No       | `1`     | Number of result pages to aggregate into the response. Minimum: `1`.                                                                                                                         |

<Snippet file="web-site-parameter.mdx" />

### Source capabilities

<Note>
  **Current platform behavior — not guaranteed by the OpenAPI contract.**
  Parameter applicability varies by source. This table reflects observed
  behavior.
</Note>

| Source                      | Best use case            | Fetchable `url`? | `site` effective? | Date filters effective? |
| --------------------------- | ------------------------ | ---------------- | ----------------- | ----------------------- |
| `web`                       | General web search       | Yes              | Yes               | Yes                     |
| `news`                      | News articles            | Yes              | Yes               | Yes                     |
| `scholar-articles`          | Academic papers          | Yes              | No                | Yes                     |
| `scholar-articles-enriched` | Papers + author profiles | Yes              | No                | Yes                     |
| `scholar-author`            | Researcher profiles      | No               | No                | No                      |
| `ai`                        | AI-generated summaries   | No               | No                | No                      |
| `social`                    | Social media mentions    | Yes              | No                | No                      |

## Response body

| Field                   | Type    | Description                                                                                                                     |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `success`               | boolean | Whether the search executed successfully.                                                                                       |
| `query`                 | string  | The query as interpreted by the API (includes `site:` prefix if `site` was set).                                                |
| `timestamp`             | integer | Unix timestamp in milliseconds when the search was performed.                                                                   |
| `results`               | array   | Search results. Shape varies by `source` — see [Result shapes by source](#result-shapes-by-source).                             |
| `metadata.totalResults` | integer | Total number of results available across all pages (may exceed the number in the `results` array if you requested fewer pages). |
| `metadata.failedPages`  | array   | Page numbers that failed to return results.                                                                                     |
| `metadata.emptyPages`   | array   | Page numbers that returned no results.                                                                                          |

<Note>
  **Timestamps:** Search `timestamp` is in **milliseconds**. Fetch `timestamp`
  is in **seconds**. Divide Search timestamps by 1000 when comparing across
  endpoints.
</Note>

***

## Your first search

The simplest search uses a `query` with an explicit `sources` array. Always specify `sources` for predictable result parsing.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "crustdata",
      "sources": ["web"],
      "location": "US"
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "crustdata",
      "timestamp": 1775195367446,
      "results": [
          {
              "source": "web",
              "title": "Crustdata: Real-Time B2B Data Broker via API or Data Feed",
              "url": "https://crustdata.com/",
              "snippet": "Crustdata is a B2B data provider offering real-time company & people datasets. Access APIs and live signals to power sales and investment workflows.",
              "position": 1
          },
          {
              "source": "web",
              "title": "Crustdata: Real-time B2B data via simple APIs",
              "url": "https://www.ycombinator.com/companies/crustdata",
              "snippet": "Crustdata provides live company and people data via APIs and full dataset delivery.",
              "position": 2
          }
      ],
      "metadata": {
          "totalResults": 7,
          "failedPages": [],
          "emptyPages": []
      }
  }
  ```
</CodeGroup>

<Note>Response trimmed for clarity.</Note>

**Extract:** Each result in `results[]` contains `source`, `title`, `url`, `snippet`, and `position`. Use `position` for ranking and `url` for follow-up fetching.

***

## Restrict results to a specific site

Use the `site` parameter to limit results to a single domain. Useful for finding company pages on LinkedIn, profiles on GitHub, or content on a specific website.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "ADAMSBROWN, LLC",
      "sources": ["web"],
      "site": "linkedin.com/company"
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "site:linkedin.com/company ADAMSBROWN, LLC",
      "timestamp": 1775195371211,
      "results": [
          {
              "source": "web",
              "title": "Adams Brown",
              "url": "https://www.linkedin.com/company/adams-brown-cpa",
              "snippet": "Adams Brown, LLC, a leading CPA and advisory firm, has delivered value-added accounting and advisory services to businesses and their owners since 1945.",
              "position": 1
          }
      ],
      "metadata": {
          "totalResults": 10,
          "failedPages": [],
          "emptyPages": []
      }
  }
  ```
</CodeGroup>

**Extract:** The first result URL is typically the best match. For company LinkedIn URLs, pass the result to the [Company Identify API](/company-docs/identify) for a full profile.

***

## Search with date filtering

Use `start_date` and `end_date` (Unix timestamps in seconds) to limit results to a specific time range.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "distributed systems",
      "location": "US",
      "sources": ["web", "news"],
      "site": "example.com",
      "start_date": 1728259200,
      "end_date": 1730937600
    }'
  ```
</CodeGroup>

<Tip>
  Convert dates to Unix timestamps: October 7, 2024 = `1728259200`. You can
  use any Unix timestamp converter tool.
</Tip>

***

## Use human mode when standard retrieval is blocked

Set `human_mode: true` when you want the API to attempt a browser-like retrieval
path for the search request.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
      --url https://api.crustdata.com/web/search/live \
      --header 'authorization: Bearer YOUR_API_KEY' \
      --header 'content-type: application/json' \
      --header 'x-api-version: 2025-11-01' \
      --data '{
          "query": "crustdata",
          "sources": ["web"],
          "human_mode": true
      }'
  ```
</CodeGroup>

<Note>
  **Current platform behavior:** `human_mode: true` returns the normal search
  response shape with `success`, `query`, `timestamp`, `results`, and
  `metadata`.
</Note>

***

## Result shapes by source

The `results[]` array shape depends on the `source` field of each result. Use this reference when parsing multi-source responses.

<Tabs>
  <Tab title="web / news">
    Standard web and news results share the same shape.

    | Field      | Type    | Description                |
    | ---------- | ------- | -------------------------- |
    | `source`   | string  | `"web"` or `"news"`.       |
    | `title`    | string  | Page title.                |
    | `url`      | string  | Page URL.                  |
    | `snippet`  | string  | Text excerpt.              |
    | `position` | integer | Result position (1-based). |

    ```json theme={"theme":"vitesse-black"}
    {
        "source": "web",
        "title": "Crustdata: Real-Time B2B Data Broker via API or Data Feed",
        "url": "https://crustdata.com/",
        "snippet": "Crustdata is a B2B data provider offering real-time company & people datasets.",
        "position": 1
    }
    ```
  </Tab>

  <Tab title="scholar-articles">
    Academic article results include citation data, author information, and optional PDF links.

    | Field       | Type    | Description                                            |
    | ----------- | ------- | ------------------------------------------------------ |
    | `source`    | string  | `"scholar-articles"` or `"scholar-articles-enriched"`. |
    | `title`     | string  | Article title.                                         |
    | `url`       | string  | Link to the article.                                   |
    | `snippet`   | string  | Abstract excerpt.                                      |
    | `metadata`  | string  | Citation string: `"Author - Year - Publisher"`.        |
    | `pdf_url`   | string? | Direct PDF link, if available.                         |
    | `position`  | integer | Result position (1-based).                             |
    | `authors`   | array   | `[{ name, profile_url, profile_id }]`.                 |
    | `citations` | integer | Total citation count.                                  |

    ```json theme={"theme":"vitesse-black"}
    {
        "source": "scholar-articles",
        "title": "Understanding deep learning",
        "url": "https://books.google.com/books?hl=en&lr=lang_en&id=rvyxEAAAQBAJ",
        "snippet": "...to this field understand the principles behind deep learning.",
        "metadata": "SJD Prince - 2023 - books.google.com",
        "pdf_url": null,
        "position": 1,
        "authors": [
            {
                "name": "SJD Prince",
                "profile_url": "https://scholar.google.com/citations?user=fjm67xYAAAAJ&hl=en&oi=sra",
                "profile_id": "fjm67xYAAAAJ"
            }
        ],
        "citations": 618
    }
    ```

    <Tip>
      Use `scholar-articles-enriched` instead of `scholar-articles` to get richer author profile data. The result shape is the same, with more author fields populated.
    </Tip>
  </Tab>

  <Tab title="scholar-author">
    Author profile results have a completely different shape — no `snippet`, `position`, or `title`. Instead, you get a full researcher profile.

    | Field         | Type    | Description                                                                  |
    | ------------- | ------- | ---------------------------------------------------------------------------- |
    | `source`      | string  | `"scholar-author"`.                                                          |
    | `url`         | string  | Academic profile URL.                                                        |
    | `name`        | string  | Author full name.                                                            |
    | `affiliation` | string  | Institutional affiliation.                                                   |
    | `website`     | string? | Personal or institutional website.                                           |
    | `interests`   | array   | `[{ title, link }]` — research interests.                                    |
    | `thumbnail`   | string? | Profile photo URL.                                                           |
    | `citations`   | object  | `{ all, since_2020 }` — total and recent counts.                             |
    | `h_index`     | object  | `{ all, since_2020 }`.                                                       |
    | `i10_index`   | object  | `{ all, since_2020 }`.                                                       |
    | `articles`    | array   | Top publications: `[{ title, url, year, citations, authors, publication }]`. |

    ```json theme={"theme":"vitesse-black"}
    {
        "source": "scholar-author",
        "url": "https://scholar.google.com/citations?user=NMS69lQAAAAJ&hl=en&oi=ao",
        "name": "Jeff Dean",
        "affiliation": "Google Chief Scientist, Google Research and Google DeepMind",
        "website": "http://research.google.com/people/jeff",
        "interests": [
            { "title": "Distributed systems", "link": "https://scholar.google.com/..." }
        ],
        "citations": { "all": 401624, "since_2020": 231008 },
        "h_index": { "all": 114, "since_2020": 78 },
        "i10_index": { "all": 319, "since_2020": 203 },
        "articles": [
            {
                "title": "MapReduce: simplified data processing on large clusters",
                "url": "https://scholar.google.com/...",
                "year": "2008",
                "citations": "37255",
                "authors": "J Dean, S Ghemawat",
                "publication": "Communications of the ACM 51 (1), 107-113, 2008"
            }
        ]
    }
    ```
  </Tab>

  <Tab title="ai">
    Deep research mode returns a single AI-generated overview with source references. No `snippet`, `position`, or standard search fields.

    | Field        | Type   | Description                                       |
    | ------------ | ------ | ------------------------------------------------- |
    | `source`     | string | `"ai"`.                                           |
    | `title`      | string | Always `"AI Overview"`.                           |
    | `content`    | string | AI-generated overview text.                       |
    | `references` | array  | Source articles: `[{ title, url, snippet }]`.     |
    | `images`     | array  | Embedded images: `[{ url, alt, width, height }]`. |

    ```json theme={"theme":"vitesse-black"}
    {
        "source": "ai",
        "title": "AI Overview",
        "content": "The primary difference between uv and pip is speed and scope...",
        "references": [
            {
                "title": "uv vs pip: Managing Python Packages and Dependencies",
                "url": "https://realpython.com/uv-vs-pip/",
                "snippet": "When it comes to Python package managers..."
            }
        ],
        "images": []
    }
    ```
  </Tab>

  <Tab title="social">
    Social media results use the same shape as web/news results.

    | Field      | Type    | Description                |
    | ---------- | ------- | -------------------------- |
    | `source`   | string  | `"social"`.                |
    | `title`    | string  | Post or page title.        |
    | `url`      | string  | Post URL.                  |
    | `snippet`  | string  | Post excerpt.              |
    | `position` | integer | Result position (1-based). |

    <Note>
      **Current platform behavior:** Social search results may return empty
      for some queries depending on availability. Always check `results.length`
      before processing.
    </Note>
  </Tab>
</Tabs>

### Result ordering and ranking

<Note>
  **Current platform behavior:** When querying a single source, `position`
  reflects the source's natural ranking order. When querying multiple sources,
  results from different sources are interleaved and `position` may reflect a
  per-source rank rather than a global rank. `metadata.totalResults` is the
  total count across all requested sources and pages.
</Note>

### Parsing multi-source responses

When you query multiple sources at once (or omit `sources`), the `results[]` array can contain items with different shapes. Always check the `source` field of each result to determine which fields are available:

```javascript theme={"theme":"vitesse-black"}
for (const result of response.results) {
    switch (result.source) {
        case "web":
        case "news":
        case "social":
            // Standard: title, url, snippet, position
            console.log(result.title, result.url);
            break;
        case "scholar-articles":
        case "scholar-articles-enriched":
            // Academic: standard fields + authors, citations, pdf_url, metadata
            console.log(result.title, result.citations, result.authors);
            break;
        case "scholar-author":
            // Author profile: name, affiliation, h_index, articles[]
            console.log(result.name, result.affiliation, result.h_index);
            break;
        case "ai":
            // AI overview: content, references[]
            console.log(result.content, result.references);
            break;
    }
}
```

***

## Multi-page search

Use `page` to request multiple result pages in a single response. The `metadata` object tells you which pages succeeded.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "artificial intelligence startups",
      "sources": ["web"],
      "location": "US",
      "page": 3
    }'
  ```

  ```json Response (with page 2 failure) theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "artificial intelligence startups",
      "timestamp": 1775195500000,
      "results": [
          {
              "source": "web",
              "title": "AI Startup Landscape 2026",
              "url": "https://example.com/ai-startups",
              "snippet": "...",
              "position": 1
          },
          {
              "source": "web",
              "title": "Top AI Companies to Watch",
              "url": "https://example.com/top-ai",
              "snippet": "...",
              "position": 2
          }
      ],
      "metadata": {
          "totalResults": 25,
          "failedPages": [2],
          "emptyPages": [3]
      }
  }
  ```
</CodeGroup>

<Note>
  Response trimmed for clarity. Pages 1 succeeded, page 2 failed, page 3 was
  empty.
</Note>

The response aggregates results across all successful pages into a single `results[]` array. Check `metadata` to understand page-level outcomes:

* **`metadata.totalResults`** — total results available across all sources and pages.
* **`metadata.failedPages`** — page numbers that returned errors. Retry the request with a smaller `page` value if needed.
* **`metadata.emptyPages`** — page numbers that returned no results. You have reached the end of available results — **do not retry**.

**Handling page outcomes:**

```javascript theme={"theme":"vitesse-black"}
if (response.metadata.failedPages.length > 0) {
    // Some pages failed — retry the full request or reduce page
    console.log("Failed pages:", response.metadata.failedPages);
}

if (response.metadata.emptyPages.length > 0) {
    // No more results available — do not request more pages
    console.log(
        "Reached end of results at page",
        Math.min(...response.metadata.emptyPages),
    );
}
```

<Note>
  **Current platform behavior (not guaranteed by the OpenAPI contract):** Each
  page returns approximately 10 results. If `metadata.emptyPages` contains
  page numbers, you have reached the end of available results.
</Note>

***

## Field presence by source

Use this reference to determine which fields are present for each source type.

<Note>
  **Naming note:** The API uses `metadata` in two different contexts. The
  **response-level** `metadata` is an object with `totalResults`,
  `failedPages`, and `emptyPages`. The **per-result** `metadata` field
  (scholar-articles only) is a citation string like `"Author - Year -
        Publisher"`. Always use the full path (`response.metadata` vs
  `result.metadata`) to avoid confusion.
</Note>

**Standard fields** — present in `web`, `news`, `social`, and `scholar-articles` / `scholar-articles-enriched`:

| Field      | Sources with this field                                        | Notes                            |
| ---------- | -------------------------------------------------------------- | -------------------------------- |
| `source`   | All sources                                                    | Always present                   |
| `title`    | `web`, `news`, `social`, `scholar-articles*`, `ai`             | AI: always `"AI Overview"`       |
| `url`      | `web`, `news`, `social`, `scholar-articles*`, `scholar-author` | Academic author: profile link    |
| `snippet`  | `web`, `news`, `social`, `scholar-articles*`                   | Absent in `ai`, `scholar-author` |
| `position` | `web`, `news`, `social`, `scholar-articles*`                   | Absent in `ai`, `scholar-author` |

**Academic article fields** — `scholar-articles` and `scholar-articles-enriched` only:

| Field       | Type    | Notes                                               |
| ----------- | ------- | --------------------------------------------------- |
| `metadata`  | string  | Citation string: `"Author - Year - Publisher"`      |
| `pdf_url`   | string? | Direct PDF download link — handle outside Web Fetch |
| `authors`   | array   | `[{ name, profile_url, profile_id }]`               |
| `citations` | integer | Total citation count                                |

**Academic author fields** — `scholar-author` only:

| Field         | Type    | Notes                                                        |
| ------------- | ------- | ------------------------------------------------------------ |
| `name`        | string  | Author full name                                             |
| `affiliation` | string  | Institutional affiliation                                    |
| `website`     | string? | Personal or institutional website                            |
| `interests`   | array   | `[{ title, link }]`                                          |
| `thumbnail`   | string? | Profile photo URL                                            |
| `citations`   | object  | `{ all, since_2020 }` — different type than scholar-articles |
| `h_index`     | object  | `{ all, since_2020 }`                                        |
| `i10_index`   | object  | `{ all, since_2020 }`                                        |
| `articles`    | array   | `[{ title, url, year, citations, authors, publication }]`    |

**Deep research mode fields** — `ai` only:

| Field        | Type   | Notes                                          |
| ------------ | ------ | ---------------------------------------------- |
| `content`    | string | AI-generated overview text                     |
| `references` | array  | `[{ title, url, snippet }]` — fetch these URLs |
| `images`     | array  | `[{ url, alt, width, height }]`                |

<Tip>
  For full request/response examples of each source type, see the [Web API
  Examples](/web-docs/examples) page.
</Tip>

***

## Error handling

Search returns `400` for invalid requests and `401` for auth failures.

<CodeGroup>
  ```json 400 — missing query theme={"theme":"vitesse-black"}
  {
      "error": {
          "type": "invalid_request",
          "message": "query: This field is required.",
          "metadata": []
      }
  }
  ```

  ```json 400 — invalid source theme={"theme":"vitesse-black"}
  {
      "error": {
          "type": "invalid_request",
          "message": "sources: {0: [ErrorDetail(string='\"invalid_source\" is not a valid choice.', code='invalid_choice')]}",
          "metadata": []
      }
  }
  ```

  ```json 401 — bad API key theme={"theme":"vitesse-black"}
  {
      "message": "Invalid API key in request"
  }
  ```
</CodeGroup>

<Snippet file="web-error-responses.mdx" />

***

## Common gotchas

| Mistake                                            | Fix                                                                                                      |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Omitting `sources` and expecting uniform results   | Different sources return different fields. Specify `sources` explicitly for predictable parsing.         |
| Using `site` with `scholar-author` or `ai` sources | `site` only applies to `web` and `news` sources. It has no effect on academic or deep research searches. |
| Expecting `snippet` in deep research mode results  | Deep research mode returns `content` and `references` instead of `snippet` and `position`.               |
| Expecting `position` in scholar-author results     | Academic author results don't have `position` — they have `name`, `affiliation`, `citations`, etc.       |
| Using `start_date` >= `end_date`                   | `start_date` must be strictly less than `end_date`.                                                      |

***

## Next steps

* [Web Fetch](/web-docs/fetch) — fetch the HTML content of URLs returned by search results.
* [Web API Examples](/web-docs/examples) — ready-to-copy patterns for common workflows.
