> ## Documentation Index
> Fetch the complete documentation index at: https://docs.crustdata.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Web APIs

> Search the web and fetch webpage content with the Crustdata Web APIs.

The Web APIs give you programmatic access to web search and webpage content fetching. Search across web, news, academic, deep research mode, and social media sources — or fetch the raw HTML of any public URL.

<CardGroup cols={2}>
  <Card title="Web Search" icon="magnifying-glass" href="/web-docs/search">
    Search the web across 7 source types: web, news, academic articles,
    academic authors, deep research mode, social, and enriched academic.
  </Card>

  <Card title="Web Fetch" icon="download" href="/web-docs/fetch">
    Fetch the HTML content of up to 10 public URLs in one request for
    content extraction and analysis.
  </Card>
</CardGroup>

## At a glance

|                           | Search                                                                        | Fetch                                                  |
| ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Endpoint**              | `POST /web/search/live`                                                       | `POST /web/enrich/live`                                |
| **Required fields**       | `query`                                                                       | `urls`                                                 |
| **Optional fields**       | `location`, `sources`, `site`, `start_date`, `end_date`, `human_mode`, `page` | `human_mode`                                           |
| **Response shape**        | Object with `success`, `query`, `timestamp`, `results[]`, `metadata`          | Array of `{ success, url, timestamp, title, content }` |
| **Pagination**            | `page` (request multiple pages)                                               | —                                                      |
| **Max items per request** | \~10 results per page *(platform behavior)*                                   | 10 URLs                                                |
| **Timestamp unit**        | Milliseconds                                                                  | Seconds                                                |
| **Error codes**           | `400`, `401`                                                                  | `400`, `401`                                           |

***

## Before you start

You need:

* A Crustdata API key
* A terminal with `curl` (or any HTTP client)
* The required header: `x-api-version: 2025-11-01`

<Snippet file="web-auth-headers.mdx" />

<Note>
  **Convention used in these docs:** Information labeled "OpenAPI contract"
  reflects the formal API specification. Information labeled "Current platform
  behavior" (such as rate limits and credit costs) describes observed behavior
  that may change. See the [API
  reference](/openapi-specs/2025-11-01/introduction) for the formal OpenAPI
  spec.
</Note>

***

## Quickstart: search the web

The fastest way to get started is a simple web search. This single request returns search results with titles, URLs, snippets, and positions.

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
              "snippet": "Crustdata is a B2B data provider offering real-time company & people datasets.",
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

The response contains:

* **`success`** — whether the search executed successfully.
* **`results[]`** — an array of search results, each with `source`, `title`, `url`, `snippet`, and `position`.
* **`metadata.totalResults`** — the total number of results available (may exceed the displayed count if you didn't request all pages).

***

## End-to-end: Search → Company Enrich

The most common workflow chains a web search with a downstream Crustdata API call. Here is a complete 3-step example:

<Steps>
  <Step title="Search for a company's website">
    ```bash theme={"theme":"vitesse-black"}
    curl --request POST \
      --url https://api.crustdata.com/web/search/live \
      --header 'authorization: Bearer YOUR_API_KEY' \
      --header 'content-type: application/json' \
      --header 'x-api-version: 2025-11-01' \
      --data '{"query": "ADAMSBROWN, LLC website", "sources": ["web"]}'
    ```

    **Extract:** `results[0].url` → `"https://www.adamsbrowncpa.com/"`
  </Step>

  <Step title="Normalize the URL to a domain">
    ```javascript theme={"theme":"vitesse-black"}
    const domain = new URL("https://www.adamsbrowncpa.com/")
      .hostname.replace("www.", ""); // "adamsbrowncpa.com"
    ```
  </Step>

  <Step title="Enrich the company via Company API">
    ```bash theme={"theme":"vitesse-black"}
    curl --request POST \
      --url https://api.crustdata.com/company/enrich \
      --header 'authorization: Bearer YOUR_API_KEY' \
      --header 'content-type: application/json' \
      --header 'x-api-version: 2025-11-01' \
      --data '{"domains": ["adamsbrowncpa.com"]}'
    ```

    This returns the full company profile: name, headcount, funding, industry, and more.
  </Step>
</Steps>

***

## Which API should you start with?

| If you want to...                                         | Start with                        |
| --------------------------------------------------------- | --------------------------------- |
| Find companies, news, academic papers, or social mentions | [Search](/web-docs/search)        |
| Get the HTML content of specific URLs for processing      | [Fetch](/web-docs/fetch)          |
| Do both — search then fetch the top results               | Search first, then Fetch the URLs |

## Common workflows

<Steps>
  <Step title="Competitive intelligence">
    [Search](/web-docs/search) for a competitor's name across `news` and
    `web` sources, then [Fetch](/web-docs/fetch) the top result URLs to
    extract full article content.
  </Step>

  <Step title="Find company domain → Enrich">
    [Search](/web-docs/search) with the company name + "website" to discover
    the domain (first result URL). Then pass it to the [Company Enrich
    API](/company-docs/enrichment) for the full company profile.
  </Step>

  <Step title="Find LinkedIn → Identify company">
    [Search](/web-docs/search) with the company name and `site:
                "linkedin.com/company"` to get the LinkedIn URL. Then pass it to the
    [Company Identify API](/company-docs/identify).
  </Step>

  <Step title="Find person → Enrich">
    [Search](/web-docs/search) with a person's name and `site:
                "linkedin.com/in"` to find their LinkedIn profile URL. Then pass it to
    the [Person Enrich API](/person-docs/enrichment).
  </Step>

  <Step title="Academic research">
    [Search](/web-docs/search) with `sources: ["scholar-articles"]` to find
    papers with citation data, or `sources: ["scholar-author"]` to get full
    author profiles with h-index metrics.
  </Step>

  <Step title="AI-powered answers">
    [Search](/web-docs/search) with `sources: ["ai"]` to get an AI-generated
    overview with source references.
  </Step>

  <Step title="Content monitoring">
    [Fetch](/web-docs/fetch) the same set of URLs on a schedule and diff the
    `content` field to detect changes.
  </Step>
</Steps>

***

## Choosing a search source

The Web Search API supports seven source types. Each returns a different result shape — always specify `sources` explicitly for predictable parsing.

| Source                      | What it returns                  | Safe to pass `url` to Fetch? | Typical downstream action                                            |
| --------------------------- | -------------------------------- | ---------------------------- | -------------------------------------------------------------------- |
| `web`                       | Standard web results             | Yes                          | Fetch page content, discover domains/profiles                        |
| `news`                      | News articles                    | Yes                          | Fetch full article, monitor press coverage                           |
| `scholar-articles`          | Academic articles                | Yes                          | Download PDF via `pdf_url`, analyze citations                        |
| `scholar-articles-enriched` | Articles with richer author data | Yes                          | Same as above, plus follow author profiles                           |
| `scholar-author`            | Researcher profiles              | No                           | Read citation metrics and publications directly from the result      |
| `ai`                        | AI-generated overview            | No                           | Use `content` directly; fetch `references[].url` for source articles |
| `social`                    | Social media posts               | Yes                          | Monitor social mentions                                              |

<Tip>
  **For Fetch workflows:** Only pass URLs from sources marked "Yes" in the
  fetchable `url` column directly to [Web Fetch](/web-docs/fetch). For AI
  results, fetch the `references[].url` values instead. For scholar-author
  results, the `url` is a profile page, not a content page.
</Tip>

<Note>
  **OpenAPI contract:** The `site`, `start_date`, and `end_date` parameters
  are defined in the spec. **Current platform behavior:** These parameters
  primarily affect `web` and `news` results. `scholar-author` and `ai`
  searches may not filter by these parameters.
</Note>

***

## Cross-API workflow map

The Web APIs are often the first step in a larger pipeline. Here's how they connect to other Crustdata APIs:

| Starting point                    | Web Search query pattern                         | Extract from result           | Pass to                                                                          |
| --------------------------------- | ------------------------------------------------ | ----------------------------- | -------------------------------------------------------------------------------- |
| Company name → company profile    | `"ACME Inc website"`, `sources: ["web"]`         | `results[0].url` → domain     | [Company Enrich](/company-docs/enrichment) (`domains`)                           |
| Company name → identify company   | `"ACME Inc"`, `site: "linkedin.com/company"`     | `results[0].url` → LinkedIn   | [Company Identify](/company-docs/identify) (`professional_network_profile_urls`) |
| Person name → person profile      | `"Jane Smith Google"`, `site: "linkedin.com/in"` | `results[0].url` → LinkedIn   | [Person Enrich](/person-docs/enrichment) (`professional_network_profile_urls`)   |
| Any search → full article content | Any search query                                 | `results[].url`               | [Web Fetch](/web-docs/fetch) (`urls`)                                            |
| AI overview → source articles     | `"topic"`, `sources: ["ai"]`                     | `results[0].references[].url` | [Web Fetch](/web-docs/fetch) (`urls`)                                            |

***

## Error handling

<Snippet file="web-error-responses.mdx" />

***

## Next steps

* [Web Search](/web-docs/search) — search the web, news, scholars, AI, and social media.
* [Web Fetch](/web-docs/fetch) — fetch the HTML content of public URLs.
* [Web API Examples](/web-docs/examples) — ready-to-copy patterns for common use cases.
