import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";

// ✅ REQUIRED (v3+)
const yahooFinance = new YahooFinance();

export const stockPriceOnDate = createTool({
  id: "stockPriceOnDate",
  description: "Get stock closing price for a specific date",

  inputSchema: z.object({
    symbol: z.string(),
    date: z.string().describe("YYYY-MM-DD"),
  }),

  outputSchema: z.object({
    symbol: z.string(),
    date: z.string(),
    close: z.number().nullable(),
  }),

  execute: async ({ inputData }) => {
    const { symbol, date } = inputData;

    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    try {
      // ✅ CORRECT API
      const result = await yahooFinance.chart(symbol, {
        period1: start,
        period2: end,
        interval: "1d",
      });

      const quotes = result?.quotes ?? [];
      const row = quotes[0] ?? null;

      return {
        symbol,
        date,
        close: row?.close ?? null,
      };

    } catch (err) {
      console.error("stockPriceOnDate error:", err);

      return {
        symbol,
        date,
        close: null,
      };
    }
  },
});