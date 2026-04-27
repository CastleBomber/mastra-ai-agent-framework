/**
 * stockPriceOnDate.ts
 * ------------------------
 * Tool: 
 *
 * Computes: 

 *
 * Answers questions like:

 * 
 * Strategy:
 * 
 * Primary data source:
 *   - Yahoo Finance (via yahoo-finance2)
 *     (better than Finnhub)
 *
 * Notes:
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