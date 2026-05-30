/**
 * stockPriceOnDate.ts
 * -------------------
 * Tool: Get stock closing price for a specific date
 *
 * Fetches the closing price of a stock on a given trading day using Yahoo Finance.
 *
 * Answers questions like:
 *   - "What was the closing price of SPY on March 15, 2025?"
 *   - "How much did NVDA close at on January 1, 2024?"
 *
 * Behavior:
 *   1) Accepts symbol and date (YYYY-MM-DD)
 *   2) Queries Yahoo Finance chart API for a 1-day range
 *   3) Returns the close price of the first (and only) trading day
 *
 * Input:
 *   symbol (string) – stock ticker (e.g., "SPY")
 *   date (string) – trading date in YYYY-MM-DD format
 *
 * Output:
 *   {
 *     symbol,
 *     date,
 *     close      // number or null if market closed
 *   }
 *
 * Notes:
 *   - Uses Yahoo Finance (yahoo-finance2) for reliable historical data.
 *   - Returns null if the market was closed (weekend, holiday) or no data found.
 *   - Timezone-safe using UTC date boundaries.
 * 
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const stockPriceOnDate = createTool({
    id: "stockPriceOnDate",
    description: "Get stock closing price for a specific date",

    inputSchema: z.object({
        symbol: z.string(),
        date: z.string().describe("YYYY-MM-DD",)
    }),

    outputSchema: z.object({
        symbol: z.string(),
        date: z.string(),
        close: z.number().nullable(),
    }),

    execute: async (inputData) => {
        if (!inputData) throw new Error("Missing inputData");

        const { symbol, date } = inputData;

        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);

        try {
            const result = await yahooFinance.chart(symbol, {
                period1: start,
                period2: end,
                interval: "1d",
            });

            const quotes = result?.quotes ?? [];
            const row = quotes?.[0] ?? null; // first trading entry

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