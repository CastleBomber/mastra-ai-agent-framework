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
 * Data source:
 *   Finnhub Company News API
 *
 * Notes:
 *   - Uses a rolling 14-day window for relevance
 *   - Limits results to the most recent 5 articles
 */

import { createTool } from "@mastra/core";
import { z } from "zod"; // Validates schema at runtime (not just compile-time)

export const stockNews = createTool({
  id: "stock-news",
  description: "Fetches recent company news for a stock symbol",

  inputSchema: z.object({
    symbol: z.string(),
  }),

  outputSchema: z.object({
    headlines: z.array(
      z.object({
        title: z.string(),
        date: z.string(),
      })
    ),
  }),

  execute: async ({ context }) => {
    const { symbol } = context;

    const from = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const to = new Date().toISOString().split("T")[0]; // today

    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_KEY}`;

    const res = await fetch(url).then(r => r.json());

    if (!Array.isArray(res)) return { 
      headlines: [] 
    };

    return {
      headlines: res.slice(0, 5).map(a => ({
        title: a.headline,
        date: new Date(a.datetime * 1000).toISOString().split("T")[0],
      })),
    };
  },
});
