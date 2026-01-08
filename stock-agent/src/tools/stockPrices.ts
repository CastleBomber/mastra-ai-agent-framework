import { Tool } from "@mastra/core";
import { z } from "zod";

const getStockPrice = async (symbol: string) => {
  const data = await fetch(
    `https://mastra-stock-data.vercel.app/api/stock-data?symbol=${symbol}`,
  ).then((r) => r.json());

  return data.prices["4. close"];
};

export const stockPrices = new Tool({
  id: "get-stock-price",
  description: "Fetches the last day's closing stock price for a given symbol",

  inputSchema: z.object({
    symbol: z.string(),
  }),

  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
  }),

  execute: async ({ symbol }) => {
    console.log("Using tool to fetch stock price for", symbol);

    return {
      symbol,
      currentPrice: await getStockPrice(symbol),
    };
  },
});
