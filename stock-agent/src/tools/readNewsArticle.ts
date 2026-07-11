/**
 * readNewsArticle.ts
 * ------------------
 * Tool: Read a news article
 *
 * Fetches a public news article and extracts its main readable content,
 * removing navigation, advertisements, sidebars, and other page clutter.
 *
 * Answers requests like:
 *   - "Read this news article"
 *   - "What does this article say?"
 *   - "Extract the content from this news URL"
 *
 * Behavior:
 *   1) Validate the supplied article URL
 *   2) Fetch the public HTML page
 *   3) Extract the article title, author, date, summary, and main text
 *   4) Limit long content before returning it to the AI
 *   5) Return a clear note when only partial content is available
 *
 * Input:
 *   - url: Public news article URL
 *   - maxCharacters: Optional content limit (default: 12,000)
 *
 * Output:
 *   - Article metadata
 *   - Clean article text or available snippet
 *   - Content-access and truncation details
 *
 * Data source:
 *   The public webpage supplied through the article URL
 *
 * Key behavior:
 *   - Extracts readable article content instead of raw HTML
 *   - Does not execute webpage scripts
 *   - Does not bypass paywalls, login screens, or publisher restrictions
 *   - Preserves the final URL after redirects
 *
 * Notes:
 *   - Some websites may block automated requests
 *   - JavaScript-only pages may return limited content
 *   - Article content is limited to protect the agent's context window
 */

import { createTool } from "@mastra/core/tools";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { z } from "zod";

const DEFAULT_MAX_CHARACTERS = 12_000;
const MAX_HTML_BYTES = 3_000_000;
const REQUEST_TIMEOUT_MS = 10_000;

// Blocks clearly local URLs so the tool only reads public webpages
function validatePublicUrl(value: string): URL {
  const url = new URL(value);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Article URL must use HTTP or HTTPS");
  }

  const hostname = url.hostname.toLowerCase();

  const blockedHostnames = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
  ];

  if (
    blockedHostnames.includes(hostname) ||
    hostname.endsWith(".local") ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
  ) {
    throw new Error("Article URL must point to a public website");
  }

  return url;
}

// Cleans excess whitespace while keeping readable paragraph breaks
function cleanText(value: string): string {
  return value
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n\n");
}

export const readNewsArticle = createTool({
  id: "read-news-article",
  description:
    "Reads a public news article URL and returns its main text and metadata",

  inputSchema: z.object({
    url: z.string().url(),
    maxCharacters: z
      .number()
      .int()
      .min(1_000)
      .max(20_000)
      .optional(),
  }),

  outputSchema: z.object({
    sourceUrl: z.string(),
    finalUrl: z.string(),

    title: z.string().optional(),
    author: z.string().optional(),
    publishedDate: z.string().optional(),
    siteName: z.string().optional(),
    excerpt: z.string().optional(),

    content: z.string(),
    wordCount: z.number(),
    access: z.enum(["full", "partial"]),
    truncated: z.boolean(),

    note: z.string().optional(),
  }),

  execute: async (inputData) => {
    if (!inputData) throw new Error("Missing inputData");

    const sourceUrl = validatePublicUrl(inputData.url);
    const maxCharacters =
      inputData.maxCharacters ?? DEFAULT_MAX_CHARACTERS;

    // #1 - Fetch the article HTML with a timeout and standard browser identity
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS
    );

    let response: Response;

    try {
      response = await fetch(sourceUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; StocksAI/1.0; article reader)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Article request timed out");
      }

      throw new Error("Unable to fetch the article");
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(
        `Article request failed with status ${response.status}`
      );
    }

    // #2 - Confirm the redirect destination and response are safe to process
    const finalUrl = validatePublicUrl(response.url || sourceUrl.href);
    const contentType = response.headers.get("content-type") ?? "";
    const contentLength = Number(
      response.headers.get("content-length") ?? 0
    );

    if (contentType && !contentType.includes("text/html")) {
      throw new Error("The supplied URL did not return an HTML webpage");
    }

    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_HTML_BYTES
    ) {
      throw new Error("Article webpage is too large to process");
    }

    const html = await response.text();

    if (html.length > MAX_HTML_BYTES) {
      throw new Error("Article webpage is too large to process");
    }

    // #3 - Parse the page without executing its JavaScript
    const dom = new JSDOM(html, {
      url: finalUrl.href,
    });

    const document = dom.window.document;

    const publishedDate =
      document
        .querySelector(
          'meta[property="article:published_time"]'
        )
        ?.getAttribute("content") ??
      document
        .querySelector('meta[name="date"]')
        ?.getAttribute("content") ??
      undefined;

    const siteName =
      document
        .querySelector('meta[property="og:site_name"]')
        ?.getAttribute("content") ??
      undefined;

    const fallbackExcerpt =
      document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content") ??
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ??
      undefined;

    // #4 - Extract the main article while removing unrelated page elements
    const article = new Readability(document).parse();

    const extractedContent = article?.textContent
      ? cleanText(article.textContent)
      : "";

    const fallbackContent = fallbackExcerpt
      ? cleanText(fallbackExcerpt)
      : "";

    const fullContent = extractedContent || fallbackContent;

    if (!fullContent) {
      throw new Error(
        "No readable article content was found on this webpage"
      );
    }

    // #5 - Limit long articles before sending their content to the AI
    const truncated = fullContent.length > maxCharacters;
    const content = truncated
      ? `${fullContent.slice(0, maxCharacters).trimEnd()}…`
      : fullContent;

    const access = extractedContent ? "full" : "partial";

    let note: string | undefined;

    if (access === "partial") {
      note =
        "Only the publisher's article summary was available. The full article may require JavaScript, a login, or a subscription.";
    } else if (truncated) {
      note =
        `Article content was limited to ${maxCharacters.toLocaleString()} characters.`;
    }

    return {
      sourceUrl: sourceUrl.href,
      finalUrl: finalUrl.href,

      title: article?.title ?? (document.title || undefined),
      author: article?.byline ?? undefined,
      publishedDate,
      siteName,
      excerpt: article?.excerpt ?? fallbackExcerpt,

      content,
      wordCount: fullContent.split(/\s+/).filter(Boolean).length,
      access,
      truncated,

      note,
    };
  },
});