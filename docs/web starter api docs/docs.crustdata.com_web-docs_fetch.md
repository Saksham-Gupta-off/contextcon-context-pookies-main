> ## Documentation Index
> Fetch the complete documentation index at: https://docs.crustdata.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Web Fetch

> Fetch the HTML content of public webpages by URL for content extraction, data collection, and monitoring.

**Use this when** you have specific URLs and need to retrieve their full HTML content — for content extraction, data collection, SEO analysis, or change tracking.

The Web Fetch API accepts a list of URLs and returns the page title and full HTML content for each. You can fetch up to 10 URLs in a single request.

Every request goes to the same endpoint:

```
POST https://api.crustdata.com/web/enrich/live
```

<Note>
  The endpoint path is `/web/enrich/live` (not `/web/fetch/live`) because it
  follows the Crustdata convention where "enrich" means adding data to a known
  identifier — in this case, enriching a URL with its page content.
</Note>

<Snippet file="web-auth-headers.mdx" />

<Callout icon="lock" color="#f59e0b">
  <strong>Pricing:</strong> <code>1 credit per page</code>.
</Callout>

<Note>
  Default `rate-limit` is 15 requests per minute. Send an email to
  [gtm@crustdata.co](mailto:gtm@crustdata.co) to discuss higher limits if
  needed for your use case.
</Note>

## Request body

| Parameter    | Type      | Required | Default | Description                                                                                       |
| ------------ | --------- | -------- | ------- | ------------------------------------------------------------------------------------------------- |
| `urls`       | string\[] | Yes      | —       | URLs to fetch. Min: 1, max: 10. Must include `http://` or `https://`.                             |
| `human_mode` | boolean   | No       | `false` | Attempt a browser-like fetch path when a site is protected by Cloudflare or similar bot controls. |

## Response body

The response is an **array** (not an object) — one entry per URL in your request.

| Field       | Type     | Description                                                   |
| ----------- | -------- | ------------------------------------------------------------- |
| `success`   | boolean  | Whether this URL was fetched successfully.                    |
| `url`       | string?  | The URL that was fetched. `null` if the fetch failed.         |
| `timestamp` | integer? | Unix timestamp (**seconds**) when fetched. `null` on failure. |
| `title`     | string?  | The `<title>` tag content. `null` on failure.                 |
| `content`   | string?  | Full HTML content of the page. `null` on failure.             |

<Note>
  **Timestamps:** Fetch timestamps are in **seconds**. Search timestamps are
  in **milliseconds**. Account for this when comparing timestamps across
  endpoints.
</Note>

<Note>
  **Two kinds of failure, two places to check:**

  * **Request-level errors** (`400`, `401`) — the entire request failed. You get an error object, not an array. Caused by missing fields, empty arrays, or bad auth.
  * **Per-URL failures** within a `200` — individual entries with `success: false` and `null` fields. Caused by unreachable URLs, timeouts, or bot protection.

  Always check the HTTP status first, then check `success` for each entry in the array.
</Note>

***

## Fetch a single URL

The simplest request fetches one URL and returns its HTML content.

<CodeGroup>
  ```bash Request theme={"theme":"vitesse-black"}
  curl --request POST \
    --url https://api.crustdata.com/web/enrich/live \
    --header 'authorization: Bearer YOUR_API_KEY' \
    --header 'content-type: application/json' \
    --header 'x-api-version: 2025-11-01' \
    --data '{
      "urls": ["https://example.com"]
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  [
      {
          "success": true,
          "url": "https://example.com",
          "timestamp": 1775193366,
          "title": "Example Domain",
          "content": "<html lang=\"en\"><head><title>Example Domain</title>...</head><body><div><h1>Example Domain</h1><p>This domain is for use in documentation examples.</p></div></body></html>"
      }
  ]
  ```
</CodeGroup>

<Note>
  The `content` field is trimmed here. It contains the full HTML of the
  fetched page.
</Note>

**Extract:** Parse `content` using an HTML parser (BeautifulSoup for Python, Cheerio for Node.js) to extract specific elements like text, links, or metadata.

***

## Fetch multiple URLs

Pass up to 10 URLs to fetch their content in parallel.

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
        "https://www.crustdata.com"
      ]
    }'
  ```

  ```json Response theme={"theme":"vitesse-black"}
  [
      {
          "success": true,
          "url": "https://example.org",
          "timestamp": 1775193386,
          "title": "Example Domain",
          "content": "<html lang=\"en\"><head><title>Example Domain</title></head><body>...</body></html>"
      },
      {
          "success": true,
          "url": "https://example.com",
          "timestamp": 1775193386,
          "title": "Example Domain",
          "content": "<html lang=\"en\"><head><title>Example Domain</title></head><body>...</body></html>"
      },
      {
          "success": true,
          "url": "https://www.crustdata.com",
          "timestamp": 1775193387,
          "title": "Crustdata: Real-Time B2B Data Broker",
          "content": "<html>...</html>"
      }
  ]
  ```
</CodeGroup>

<Note>
  **Current platform behavior:** The response array order may differ from the
  request order. Match successful results by their `url` field, not by array
  index.
</Note>

***

## Handle partial failures

When some URLs succeed and others fail, the request still returns `200`. Failed URLs have `success: false` with all other fields as `null`.

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
        "https://this-domain-does-not-exist-xyz.com"
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
          "success": false,
          "url": null,
          "timestamp": null,
          "title": null,
          "content": null
      }
  ]
  ```
</CodeGroup>

### Correlating failures to input URLs

Failed entries have `url: null`, so you cannot directly identify which input URL failed. To correlate failures:

1. Track the URLs you sent.
2. Collect the `url` values from all successful entries.
3. Any input URL not in the successful set is the one that failed.

```javascript theme={"theme":"vitesse-black"}
const requestedUrls = [
    "https://example.com",
    "https://this-domain-does-not-exist-xyz.com",
];
const successfulUrls = new Set(
    fetchResponse.filter((r) => r.success).map((r) => r.url),
);
const failedUrls = requestedUrls.filter((url) => !successfulUrls.has(url));
// failedUrls = ["https://this-domain-does-not-exist-xyz.com"]
```

<Tip>
  Always check the `success` field for each entry in the response array. Build
  your parsing logic to handle both successful and failed entries gracefully.
</Tip>

***

## Bypass Cloudflare protection

Some websites use Cloudflare to block automated requests. Set `human_mode: true` to attempt a browser-like fetch path for these pages.

```bash theme={"theme":"vitesse-black"}
curl --request POST \
  --url https://api.crustdata.com/web/enrich/live \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --header 'x-api-version: 2025-11-01' \
  --data '{
    "urls": ["https://example.com"],
        "human_mode": true
  }'
```

<Note>
  **Current platform behavior:** Cloudflare bypass is not guaranteed. Some
  sites have additional protections that may still block the request.
</Note>

***

## Processing fetched content

The `content` field returns raw HTML. Here are common next steps:

| Task                  | Approach                                                       |
| --------------------- | -------------------------------------------------------------- |
| Extract text          | Parse HTML and strip tags (BeautifulSoup, Cheerio, etc.)       |
| Extract links         | Find all `<a>` tags and their `href` attributes                |
| Extract metadata      | Parse `<meta>` tags for SEO data (description, og:title, etc.) |
| Detect changes        | Fetch periodically and diff the `content` or `title` fields    |
| Resolve relative URLs | Combine relative paths with the base `url` from the response   |

***

## Error handling

Fetch returns request-level errors for invalid input or auth failures. These are separate from per-URL `success: false` entries within a `200` response.

<CodeGroup>
  ```json 400 — missing urls theme={"theme":"vitesse-black"}
  {
      "error": {
          "type": "invalid_request",
          "message": "urls: This field is required.",
          "metadata": []
      }
  }
  ```

  ```json 400 — empty urls array theme={"theme":"vitesse-black"}
  {
      "error": {
          "type": "invalid_request",
          "message": "urls: This list may not be empty.",
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

| Mistake                                  | Fix                                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Omitting `http://` or `https://` in URLs | All URLs must include the protocol prefix.                                                                      |
| Sending more than 10 URLs                | The API accepts a maximum of 10 URLs per request. Batch larger lists.                                           |
| Assuming response order matches request  | Match results by the `url` field, not by array index.                                                           |
| Treating a `200` as all-success          | A `200` can contain failed entries. Check `success` for each item.                                              |
| Sending an empty `urls` array            | Returns `400`: `"urls: This list may not be empty."`.                                                           |
| Expecting JavaScript-rendered content    | **Current platform behavior:** The API fetches server-side HTML. JavaScript-heavy SPAs may return minimal HTML. |
| Comparing Search and Fetch timestamps    | Search uses milliseconds, Fetch uses seconds. Divide Search by 1000 to compare.                                 |

***

## Next steps

* [Web Search](/web-docs/search) — search the web to find URLs to fetch.
* [Web API Examples](/web-docs/examples) — ready-to-copy patterns for common workflows.
