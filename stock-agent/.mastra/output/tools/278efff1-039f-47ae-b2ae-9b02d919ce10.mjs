import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const fmt = (d) => d.toISOString().split("T")[0];
const stockNews = createTool({
  id: "stock-news",
  description: "Fetches recent company news for a stock symbol (14-day with 90-day fallback",
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    headlines: z.array(
      z.object({
        title: z.string(),
        date: z.string(),
        url: z.string(),
        summary: z.string().optional()
      })
    ),
    note: z.string().optional()
  }),
  execute: async ({ context }) => {
    const { symbol } = context;
    const to = fmt(/* @__PURE__ */ new Date());
    const from14 = fmt(new Date(Date.now() - 14 * 24 * 60 * 60 * 1e3));
    const from90 = fmt(new Date(Date.now() - 90 * 24 * 60 * 60 * 1e3));
    const fetchNews = async (from) => {
      const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_KEY}`;
      const res = await fetch(url).then((r) => r.json());
      return Array.isArray(res) ? res : [];
    };
    let articles = await fetchNews(from14);
    let note;
    if (articles.length === 0) {
      articles = await fetchNews(from90);
      note = "No news found in the last 14 days; expanded search window to 90 days.";
    }
    if (articles.length === 0) {
      return {
        headlines: [],
        note: "No company news returned for this symbol in the last 90 days."
      };
    }
    const headlines = articles.sort((a, b) => (b.datetime ?? 0) - (a.datetime ?? 0)).slice(0, 5).map((a) => ({
      title: a.headline,
      date: new Date(a.datetime * 1e3).toISOString().split("T")[0],
      url: a.url,
      summary: a.summary
    }));
    return note ? { headlines, note } : { headlines };
  }
});

export { stockNews };
