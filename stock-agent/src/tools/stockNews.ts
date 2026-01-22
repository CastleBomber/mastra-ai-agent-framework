/**
 * stockNews.ts
 * ------------
 * Tool: Fetch recent stock-related news
 *
 * Retrieves the most recent company-specific news articles for a given
 * stock symbol, including headline titles and publication dates.
 *
 * Answers questions like:
 *   - "What’s the latest news on GOLD?"
 *   - "Any recent headlines about SPY?"
 * 
 * Behavior:
 *   1) Fetch news from the last 14 days
 *   2) If none found, retry with a 90-day window
 *   3) Return up to the 5 most recent articles
 *   4) If still empty, return an empty list + a note explaining why
 * 
 * Data source:
 *   Finnhub Company News API
 *
 * Notes:
 *   - Uses a rolling 14-day window for relevance
 *   - Limits results to the most recent 5 articles
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod"; // Validates schema at runtime (not just compile-time)

const fmt = (d: Date) => d.toISOString().split("T")[0];

export const stockNews = createTool({
  id: "stock-news",
  description: "Fetches recent company news for a stock symbol (14-day with 90-day fallback",

  inputSchema: z.object({
    symbol: z.string(),
  }),

  outputSchema: z.object({
    headlines: z.array(
      z.object({
        title: z.string(),
        date: z.string(),
        url: z.string(),
        summary: z.string().optional(),
      })
    ),
    note: z.string().optional(),
  }),

  execute: async ({ context }) => {
    const { symbol } = context;

    const to = fmt(new Date());
    const from14 = fmt(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
    const from90 = fmt(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));

    const fetchNews = async (from: string) => {
      const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_KEY}`;
      const res = await fetch(url).then(r => r.json());
      return Array.isArray(res) ? res : [];
    };

    // 1) Try 14 days
    let articles = await fetchNews(from14);
    let note: string | undefined;

    // 2) Fallback to 90 days if empty
    if (articles.length === 0) {
      articles = await fetchNews(from90);
      note = "No news found in the last 14 days; expanded search window to 90 days.";
    }

    // 3) Still empty
    if (articles.length === 0) {
      return {
        headlines: [],
        note: "No company news returned for this symbol in the last 90 days.",
      };
    }

    // 4) Sort newest-first and return top 5
    const headlines = articles
      .sort((a: any, b: any) => (b.datetime ?? 0) - (a.datetime ?? 0))
      .slice(0, 5)
      .map((a: any) => ({
        title: a.headline,
        date: new Date(a.datetime * 1000).toISOString().split("T")[0],
        url: a.url,
        summary: a.summary,
      }));

    return note ? { headlines, note } : { headlines };
  },
});
