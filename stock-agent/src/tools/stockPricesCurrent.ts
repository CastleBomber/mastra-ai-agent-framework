/**
 * stockPricesCurrent.ts
 * ---------------------
 * Tool: Fetch current stock price
 *
 * Retrieves the most recent daily closing price for a given stock symbol.
 * 
 * Answers questions like:
 *   - What is the current price of SPY?
 *   - How much is GOLD trading at?
 *
 * Data source:
 *   mastra-stock-data.vercel.app (aggregated market data)
 * 
 * Historical price data sources (stockPricesHistorical):
 *      Finnhub (profile2 + stock candles)
 *      Yahoo Finance (via yahoo-finance2)
 *      No longer using AlphaVantage (limited dates)
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

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

  execute: async (inputData, context) => {
    const { symbol } = inputData;

    return {
      symbol,
      currentPrice: await getStockPrice(symbol),
    };
  },
});
