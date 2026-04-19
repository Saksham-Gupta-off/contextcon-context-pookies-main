> ## Documentation Index
> Fetch the complete documentation index at: https://docs.crustdata.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Web API Examples

> Ready-to-copy patterns for common Web API workflows: lead generation, competitive intelligence, academic research, and more.

This page collects ready-to-copy patterns for the Web APIs. Each example shows a real request, the response, and what to extract.

<Snippet file="web-auth-headers.mdx" />

<CardGroup cols={2}>
  <Card title="Company & profile discovery" icon="building" href="#company-and-profile-discovery">
    Find domains, LinkedIn, GitHub profiles
  </Card>

  <Card title="Research & analysis" icon="graduation-cap" href="#research-and-analysis">
    Academic articles, authors, deep research, news, social, mixed-source
  </Card>

  <Card title="Search-then-fetch workflows" icon="arrows-rotate" href="#search-then-fetch-workflows">
    End-to-end competitive intelligence
  </Card>

  <Card title="Bulk fetch" icon="download" href="#bulk-fetch">
    Batch-fetch up to 10 URLs
  </Card>
</CardGroup>

***

## Company and profile discovery

### Find a company's website domain

Search for a company by name followed by "website". The first result URL is typically the company's website.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "ADAMSBROWN, LLC website",
      "sources": ["web"]
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "ADAMSBROWN, LLC website",
      "timestamp": 1775195388180,
      "results": [
          {
              "source": "web",
              "title": "Adams Brown",
              "url": "https://www.adamsbrowncpa.com/",
              "snippet": "Adams Brown is a holistic professional services firm with a team of strategic allies.",
              "position": 1
          }
      ],
      "metadata": { "totalResults": 10, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

**Extract:** `results[0].url` → `https://www.adamsbrowncpa.com/`

<Tip>
  Do **not** wrap the company name in quotes — this lets the search engine
  match partial name variations. If the company name is common, add city and
  state: `"ADAMSBROWN, LLC WICHITA KS website"`.
</Tip>

**Bridge to Company API:** Extract the domain from the URL, then pass it to [Company Enrich](/company-docs/enrichment) for the full company profile:

```javascript theme={"theme":"vitesse-black"}
// Extract domain from results[0].url
const url = new URL("https://www.adamsbrowncpa.com/");
const domain = url.hostname.replace("www.", ""); // "adamsbrowncpa.com"
```

```json Company Enrich request body theme={"theme":"vitesse-black"}
{ "domains": ["adamsbrowncpa.com"] }
```

***

### Find a company's LinkedIn URL

Use the `site` parameter with `linkedin.com/company` to restrict results to LinkedIn company pages.

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
              "snippet": "Adams Brown, LLC, a leading CPA and advisory firm.",
              "position": 1
          }
      ],
      "metadata": { "totalResults": 10, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

**Extract:** `results[0].url` → `https://www.linkedin.com/company/adams-brown-cpa`

**Bridge to Company API:** Pass the LinkedIn URL to [Company Identify](/company-docs/identify):

```json theme={"theme":"vitesse-black"}
{
    "professional_network_profile_urls": [
        "https://www.linkedin.com/company/adams-brown-cpa"
    ]
}
```

***

### Find a person's LinkedIn URL

Use the `site` parameter with `linkedin.com/in` to find a person's LinkedIn profile, then enrich via the Person API.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "Jeff Dean Google",
      "sources": ["web"],
      "site": "linkedin.com/in"
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "site:linkedin.com/in Jeff Dean Google",
      "timestamp": 1775195400000,
      "results": [
          {
              "source": "web",
              "title": "Jeff Dean - Google",
              "url": "https://www.linkedin.com/in/jeff-dean-8b212555",
              "snippet": "Chief Scientist at Google DeepMind.",
              "position": 1
          }
      ],
      "metadata": { "totalResults": 5, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

**Extract:** `results[0].url` → `https://www.linkedin.com/in/jeff-dean-8b212555`

**Bridge to Person API:** Pass the LinkedIn URL to [Person Enrich](/person-docs/enrichment):

```json theme={"theme":"vitesse-black"}
{
    "professional_network_profile_urls": [
        "https://www.linkedin.com/in/jeff-dean-8b212555"
    ]
}
```

***

### Find a GitHub profile

Use `site: "github.com"` to search for developer profiles on GitHub.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "Tyler Lambe",
      "sources": ["web"],
      "site": "github.com",
      "location": "US"
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "site:github.com Tyler Lambe",
      "timestamp": 1775195572177,
      "results": [
          {
              "source": "web",
              "title": "Tyler Lambe tylambe",
              "url": "https://github.com/tylambe",
              "snippet": "Autodidactic entrepreneur, engineer, educator. tylambe has 9 repositories available.",
              "position": 1
          }
      ],
      "metadata": { "totalResults": 10, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

**Extract:** `results[0].url` → `https://github.com/tylambe`

***

## Research and analysis

### Search for academic research on a topic

Search for academic articles with date filtering to find papers with citation data and PDF links.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "deep learning",
      "location": "US",
      "sources": ["scholar-articles"],
      "start_date": 1672531200,
      "end_date": 1704067200
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "deep learning",
      "timestamp": 1775195398144,
      "results": [
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
                      "profile_url": "https://scholar.google.com/citations?user=fjm67xYAAAAJ",
                      "profile_id": "fjm67xYAAAAJ"
                  }
              ],
              "citations": 618
          }
      ],
      "metadata": { "totalResults": 10, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

**Extract:**

* `citations` — citation count to gauge impact.
* `pdf_url` — direct PDF download link (when available).
* `authors[].profile_url` — Author profile link.
* `metadata` — citation string: `"Author - Year - Publisher"`.

***

### Look up an academic researcher's profile

Search for a researcher by name to get their full academic profile with h-index, citation metrics, and top publications.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "jeff dean",
      "location": "US",
      "sources": ["scholar-author"]
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "jeff dean",
      "timestamp": 1775195567878,
      "results": [
          {
              "source": "scholar-author",
              "url": "https://scholar.google.com/citations?user=NMS69lQAAAAJ",
              "name": "Jeff Dean",
              "affiliation": "Google Chief Scientist, Google Research and Google DeepMind",
              "citations": { "all": 401624, "since_2020": 231008 },
              "h_index": { "all": 114, "since_2020": 78 },
              "i10_index": { "all": 319, "since_2020": 203 },
              "articles": [
                  {
                      "title": "MapReduce: simplified data processing on large clusters",
                      "year": "2008",
                      "citations": "37255",
                      "authors": "J Dean, S Ghemawat"
                  }
              ]
          }
      ],
      "metadata": { "totalResults": 1, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

**Extract:** `citations.all` for total impact, `h_index.all` for research quality, `articles[]` for top publications.

***

### Get an AI-generated overview of a topic

Use deep research mode for a synthesized answer with source references.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "uv vs pip",
      "location": "US",
      "sources": ["ai"]
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "uv vs pip",
      "timestamp": 1775195563283,
      "results": [
          {
              "source": "ai",
              "title": "AI Overview",
              "content": "The primary difference between uv and pip is speed and scope: uv is a modern, high-performance replacement for pip that prioritizes speed and a unified workflow.",
              "references": [
                  {
                      "title": "uv vs pip: Managing Python Packages and Dependencies",
                      "url": "https://realpython.com/uv-vs-pip/",
                      "snippet": "When it comes to Python package managers..."
                  }
              ],
              "images": []
          }
      ],
      "metadata": { "totalResults": 1, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

**Extract:** `content` for the overview text, `references[].url` for source verification.

***

### Search news with date filtering

Filter news results to a specific date range by providing `start_date` and `end_date` as Unix timestamps in seconds.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "artificial intelligence developments",
      "location": "US",
      "sources": ["news"],
      "start_date": 1728259200,
      "end_date": 1730937600
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "artificial intelligence developments",
      "timestamp": 1775195375651,
      "results": [
          {
              "source": "news",
              "title": "Major AI Breakthroughs of October 2024",
              "url": "https://www.example.com/2024/10/ai-breakthroughs/",
              "snippet": "A roundup of the most significant artificial intelligence developments from October 2024...",
              "position": 1
          }
      ],
      "metadata": { "totalResults": 5, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

<Note>
  Response trimmed for clarity. Results are filtered to the October 7 –
  November 7, 2024 date range.
</Note>

<Tip>
  `start_date` and `end_date` are Unix timestamps in **seconds**. October 7,
  2024 = `1728259200`. November 7, 2024 = `1730937600`.
</Tip>

### Search social media posts

Search for recent social media mentions of a topic or person.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "crustdata AI agents",
      "location": "US",
      "sources": ["social"]
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "crustdata AI agents",
      "timestamp": 1775195556119,
      "results": [
          {
              "source": "social",
              "title": "Crustdata AI agents discussion",
              "url": "https://x.com/crustdata/status/1234567890",
              "snippet": "AI agents only grow revenue when they can act on the right data at the right time.",
              "position": 1
          }
      ],
      "metadata": { "totalResults": 1, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

<Note>
  **Current platform behavior:** Social media results may return an empty
  `results` array for some queries depending on availability. Always check
  `results.length` before processing.
</Note>

***

### Search with enriched scholar articles

Use `scholar-articles-enriched` to get the same result shape as `scholar-articles`, but with richer author profile data populated.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "large language models",
      "location": "US",
      "sources": ["scholar-articles-enriched"],
      "start_date": 1672531200,
      "end_date": 1704067200
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "large language models",
      "timestamp": 1775195400000,
      "results": [
          {
              "source": "scholar-articles-enriched",
              "title": "A Survey of Large Language Models",
              "url": "https://arxiv.org/abs/2303.18223",
              "snippet": "...survey provides a comprehensive review of the recent advances in large language models...",
              "metadata": "W Zhao, K Zhou - 2023 - arxiv.org",
              "pdf_url": "https://arxiv.org/pdf/2303.18223",
              "position": 1,
              "authors": [
                  {
                      "name": "W Zhao",
                      "profile_url": "https://scholar.google.com/citations?user=abc123",
                      "profile_id": "abc123"
                  },
                  {
                      "name": "K Zhou",
                      "profile_url": "https://scholar.google.com/citations?user=def456",
                      "profile_id": "def456"
                  }
              ],
              "citations": 2500
          }
      ],
      "metadata": { "totalResults": 10, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

<Tip>
  The result shape is the same as `scholar-articles`, but
  `authors[].profile_url` and `authors[].profile_id` are more likely to be
  populated. Use `scholar-articles-enriched` when you need to follow up on
  author profiles.
</Tip>

***

### Mixed-source search with safe parsing

When searching multiple sources, the `results[]` array contains items with different shapes. Always branch on `result.source`.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/search/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "query": "machine learning infrastructure",
      "location": "US",
      "sources": ["web", "news", "scholar-articles"]
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  {
      "success": true,
      "query": "machine learning infrastructure",
      "timestamp": 1775195500000,
      "results": [
          {
              "source": "web",
              "title": "MLOps: Machine Learning Infrastructure Guide",
              "url": "https://ml-ops.org/",
              "snippet": "A comprehensive guide to machine learning operations and infrastructure.",
              "position": 1
          },
          {
              "source": "news",
              "title": "AWS Launches New ML Infrastructure Tools",
              "url": "https://www.reuters.com/technology/aws-ml-tools-2026/",
              "snippet": "Amazon Web Services has launched a new suite of infrastructure tools for machine learning...",
              "position": 2
          },
          {
              "source": "scholar-articles",
              "title": "Scaling Machine Learning Infrastructure",
              "url": "https://dl.acm.org/doi/10.1145/example",
              "snippet": "...challenges of scaling ML infrastructure in production...",
              "metadata": "J Smith - 2023 - dl.acm.org",
              "pdf_url": "https://dl.acm.org/doi/pdf/10.1145/example",
              "position": 3,
              "authors": [
                  { "name": "J Smith", "profile_url": null, "profile_id": null }
              ],
              "citations": 42
          }
      ],
      "metadata": { "totalResults": 30, "failedPages": [], "emptyPages": [] }
  }
  ```
</CodeGroup>

**Safe parsing logic:**

```javascript theme={"theme":"vitesse-black"}
const fetchableUrls = [];

for (const result of response.results) {
    switch (result.source) {
        case "web":
        case "news":
        case "social":
            // Standard results — URL is fetchable
            fetchableUrls.push(result.url);
            break;
        case "scholar-articles":
        case "scholar-articles-enriched":
            // Fetch the article page URL for HTML content
            // Note: pdf_url is a direct PDF download link — handle separately outside Web Fetch
            fetchableUrls.push(result.url);
            break;
        case "scholar-author":
            // Author profile — not a fetchable content page
            console.log(`Author: ${result.name} (${result.affiliation})`);
            break;
        case "ai":
            // AI overview — content is inline, references have URLs
            console.log(`AI Overview: ${result.content}`);
            result.references?.forEach((ref) => fetchableUrls.push(ref.url));
            break;
    }
}

// Pass fetchableUrls to the Fetch endpoint
```

<Note>
  Not every search result should go to Fetch. Academic author results are
  profiles, not content pages. Deep research results provide content inline
  and use `references[].url` for source URLs instead of a top-level `url`.
</Note>

***

## Search-then-fetch workflows

### End-to-end competitive intelligence

Search for competitor news, then fetch the full article content for analysis.

<Steps>
  <Step title="Search for competitor news">
    <CodeGroup>
      ```bash Request theme={"theme":"vitesse-black"}
      curl --request POST \
        --url https://api.crustdata.com/web/search/live \
        --header 'authorization: Bearer YOUR_API_KEY' \
        --header 'content-type: application/json' \
        --header 'x-api-version: 2025-11-01' \
        --data '{
          "query": "OpenAI funding 2026",
          "location": "US",
          "sources": ["news", "web"]
        }'
      ```

      ```json Response theme={"theme":"vitesse-black"}
      {
          "success": true,
          "query": "OpenAI funding 2026",
          "timestamp": 1775195400000,
          "results": [
              {
                  "source": "news",
                  "title": "OpenAI Secures New Funding Round",
                  "url": "https://www.reuters.com/technology/openai-funding-2026/",
                  "snippet": "OpenAI has secured a new round of funding...",
                  "position": 1
              },
              {
                  "source": "web",
                  "title": "OpenAI Valuation and Funding History",
                  "url": "https://techcrunch.com/2026/01/15/openai-funding/",
                  "snippet": "A complete history of OpenAI's funding rounds...",
                  "position": 2
              }
          ],
          "metadata": { "totalResults": 10, "failedPages": [], "emptyPages": [] }
      }
      ```
    </CodeGroup>
  </Step>

  <Step title="Select URLs and fetch content">
    Extract URLs from the search results and pass them to the Fetch endpoint.

    <CodeGroup>
      ```bash Request theme={"theme":"vitesse-black"}
      curl --request POST \
        --url https://api.crustdata.com/web/enrich/live \
        --header 'authorization: Bearer YOUR_API_KEY' \
        --header 'content-type: application/json' \
        --header 'x-api-version: 2025-11-01' \
        --data '{
          "urls": [
            "https://www.reuters.com/technology/openai-funding-2026/",
            "https://techcrunch.com/2026/01/15/openai-funding/"
          ]
        }'
      ```

      ```json Response theme={"theme":"vitesse-black"}
      [
          {
              "success": true,
              "url": "https://www.reuters.com/technology/openai-funding-2026/",
              "timestamp": 1775193400,
              "title": "OpenAI Secures New Funding Round | Reuters",
              "content": "<html>...</html>"
          },
          {
              "success": false,
              "url": null,
              "timestamp": null,
              "title": null,
              "content": null
          }
      ]
      ```
    </CodeGroup>
  </Step>

  <Step title="Parse results and handle failures">
    Check `success` for each entry. Parse HTML from successful fetches. To identify which URLs failed, compare requested URLs against successful `url` values.

    ```javascript theme={"theme":"vitesse-black"}
    const requestedUrls = [
      "https://www.reuters.com/technology/openai-funding-2026/",
      "https://techcrunch.com/2026/01/15/openai-funding/"
    ];
    const successfulUrls = new Set(
      fetchResponse.filter(r => r.success).map(r => r.url)
    );

    for (const result of fetchResponse) {
      if (result.success) {
        const text = extractText(result.content);
        console.log(`${result.title}: ${text.substring(0, 200)}...`);
      }
    }

    const failedUrls = requestedUrls.filter(u => !successfulUrls.has(u));
    console.log('Failed URLs:', failedUrls);
    ```

    <Note>
      Failed entries have `url: null`, so correlate failures by comparing
      successful URLs to your input list. See [Fetch: correlating failures](/web-docs/fetch#correlating-failures-to-input-urls).
    </Note>
  </Step>
</Steps>

***

### Full pipeline in Python: search → fetch → parse

A complete Python example that searches, filters fetchable URLs by source, fetches content, and handles failures.

```python theme={"theme":"vitesse-black"}
import requests

API_KEY = "YOUR_API_KEY"
HEADERS = {
    "authorization": f"Bearer {API_KEY}",
    "content-type": "application/json",
    "x-api-version": "2025-11-01",
}

# Step 1: Search
search_resp = requests.post(
    "https://api.crustdata.com/web/search/live",
    headers=HEADERS,
    json={"query": "OpenAI funding 2026", "sources": ["web", "news"]},
).json()

# Step 2: Extract fetchable URLs (web, news, social, scholar-articles have url)
fetchable_urls = []
for result in search_resp["results"]:
    if result["source"] in ("web", "news", "social", "scholar-articles", "scholar-articles-enriched"):
        fetchable_urls.append(result["url"])
    elif result["source"] == "ai":
        # AI results: fetch reference URLs instead
        for ref in result.get("references", []):
            fetchable_urls.append(ref["url"])
    # scholar-author: no content URL to fetch

# Step 3: Fetch (max 10 URLs per request)
fetch_resp = requests.post(
    "https://api.crustdata.com/web/enrich/live",
    headers=HEADERS,
    json={"urls": fetchable_urls[:10]},
).json()

# Step 4: Process results and correlate failures
successful_urls = set()
for item in fetch_resp:
    if item["success"]:
        successful_urls.add(item["url"])
        print(f"Fetched: {item['title']} ({len(item['content'])} chars)")
    else:
        print("One URL failed to fetch")

failed_urls = [u for u in fetchable_urls[:10] if u not in successful_urls]
if failed_urls:
    print(f"Failed URLs: {failed_urls}")
```

***

### AI overview → fetch source references

When using deep research mode, the overview `content` is inline. To get the full source articles, fetch the URLs from `references[]`.

<Steps>
  <Step title="Search with deep research mode">
    ```bash theme={"theme":"vitesse-black"}
    curl --request POST \
      --url https://api.crustdata.com/web/search/live \
      --header 'authorization: Bearer YOUR_API_KEY' \
      --header 'content-type: application/json' \
      --header 'x-api-version: 2025-11-01' \
      --data '{"query": "uv vs pip", "sources": ["ai"], "location": "US"}'
    ```

    **Extract:** `results[0].references[].url` — the source article URLs.
  </Step>

  <Step title="Fetch the reference URLs">
    ```bash theme={"theme":"vitesse-black"}
    curl --request POST \
      --url https://api.crustdata.com/web/enrich/live \
      --header 'authorization: Bearer YOUR_API_KEY' \
      --header 'content-type: application/json' \
      --header 'x-api-version: 2025-11-01' \
      --data '{"urls": ["https://realpython.com/uv-vs-pip/"]}'
    ```

    Parse the `content` from successful entries to read the full source articles.
  </Step>
</Steps>

<Note>
  AI results do not have a top-level `url` field. Always use
  `references[].url` for fetch targets.
</Note>

***

## Bulk fetch

### Batch-fetch multiple webpages

Fetch up to 10 URLs in a single request for bulk content extraction.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/enrich/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "urls": [
        "https://example.com",
        "https://example.org",
        "https://example.net",
        "https://www.crustdata.com",
        "https://docs.crustdata.com"
      ]
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  [
      {
          "success": true,
          "url": "https://example.com",
          "timestamp": 1775193366,
          "title": "Example Domain",
          "content": "<html lang=\"en\"><head><title>Example Domain</title></head><body>...</body></html>"
      },
      {
          "success": true,
          "url": "https://example.org",
          "timestamp": 1775193367,
          "title": "Example Domain",
          "content": "<html lang=\"en\"><head><title>Example Domain</title></head><body>...</body></html>"
      },
      {
          "success": true,
          "url": "https://www.crustdata.com",
          "timestamp": 1775193368,
          "title": "Crustdata: Real-Time B2B Data Broker",
          "content": "<html>...</html>"
      },
      {
          "success": true,
          "url": "https://example.net",
          "timestamp": 1775193369,
          "title": "Example Domain",
          "content": "<html>...</html>"
      },
      {
          "success": true,
          "url": "https://docs.crustdata.com",
          "timestamp": 1775193370,
          "title": "Crustdata Docs",
          "content": "<html>...</html>"
      }
  ]
  ```
</CodeGroup>

**Processing tips:**

* Match results by the `url` field — the response order may differ from the request.
* Check `success` for each entry before processing `content`.
* Use `title` for quick identification without parsing HTML.
* For larger batches (>10 URLs), split into multiple requests of 10 each.

***

## Next steps

* [Web Search reference](/web-docs/search) — full request/response contract, all parameters, result shapes by source, field-presence matrix.
* [Web Fetch reference](/web-docs/fetch) — full request/response contract, partial failure handling, content processing guidance.
* [Web APIs Quickstart](/web-docs/quickstart) — overview, common workflows, and getting started.
