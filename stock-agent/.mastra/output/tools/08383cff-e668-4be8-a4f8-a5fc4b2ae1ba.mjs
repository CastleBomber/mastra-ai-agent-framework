import { createTool } from '@mastra/core';
import { z } from 'zod';

const stockNews = createTool({
  id: "stock-news",
  description: "Fetches recent company news for a stock symbol",
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    headlines: z.array(
      z.object({
        title: z.string(),
        date: z.string()
      })
    )
  }),
  execute: async ({ context }) => {
    const { symbol } = context;
    const from = new Date(Date.now() - 14 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
    const to = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_KEY}`;
    const res = await fetch(url).then((r) => r.json());
    if (!Array.isArray(res)) return {
      headlines: []
    };
    return {
      headlines: res.slice(0, 5).map((a) => ({
        title: a.headline,
        date: new Date(a.datetime * 1e3).toISOString().split("T")[0]
      }))
    };
  }
});

export { stockNews };
