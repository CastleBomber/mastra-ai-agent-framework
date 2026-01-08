import { Tool } from "@mastra/core";
import fetch from "node-fetch";

export const stockNews = new Tool({
  id: "stock-news",
  inputSchema: {
    type: "object",
    properties: { symbol: { type: "string" } },
    required: ["symbol"],
  },

  execute: async ({ context }) => {
    const { symbol } = context;

    const today = new Date();
    const from = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const to = today.toISOString().split("T")[0];

    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_KEY}`;

    const res = await fetch(url).then(r => r.json());

    if (!Array.isArray(res)) return { headlines: [] };

    return {
      headlines: res.slice(0, 5).map(a => ({
        title: a.headline,
        date: new Date(a.datetime * 1000).toISOString().split("T")[0],
      })),
    };
  },
});
