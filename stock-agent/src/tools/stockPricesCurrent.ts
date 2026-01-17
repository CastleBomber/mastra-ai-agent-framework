import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Fetches the current stock price (last close)
const getStockPrice = async (symbol: string) => {
  const r = await fetch(
    `https://mastra-stock-data.vercel.app/api/stock-data?symbol=${symbol}`,
  );
  
  if (!r.ok) {
    throw new Error(`Price API failed for ${symbol}`);
  }

  const data = await r.json();
  return data.prices["4. close"];
};

export const stockPricesCurrent = createTool({
  id: "get-stock-price",
  description: "Fetches the last day's closing stock price for a given symbol",

  inputSchema: z.object({
    symbol: z.string(),
  }),

  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
  }),

  execute: async ({ context }) => {
    const { symbol } = context;
    console.log("Using tool to fetch current stock price for", symbol);

    return {
      symbol,
      currentPrice: await getStockPrice(symbol),
    };
  },
});
