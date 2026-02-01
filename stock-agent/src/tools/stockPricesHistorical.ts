/**
 * stockPricesHistorical.ts
 * ------------------------
 * Tool: Analyze historical stock prices
 *
 * Fetches historical price data for a given stock symbol and computes: 
 * - the lowest trading price ever + date
 * - the highest trading price ever + date
 *
 * Answers questions like:
 *   - "What is the lowest price SPY has ever traded at?"
 *   - "What was GOLD's historical high?"
 *
 * Data source:
 *   Alpha Vantage – Daily Time Series API
 *
 * Notes:
 *   - Designed to be extended with averages, indicators, etc.
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const stockPricesHistorical = createTool({
    id: "stock-prices-historical",
    description:
        "Fetches historical stock price data and returns the all-time lowest and highest prices with dates",

    // Tool input: stock ticker symbol (ex: GOLD)
    inputSchema: z.object({
        symbol: z.string()
    }),

    outputSchema: z.object({
        symbol: z.string(),
        lowest: z.number(),
        lowestDate: z.string(),
        highest: z.number(),
        highestDate: z.string(),
    }),

    execute: async ({ context }) => {
        const { symbol } = context;

        // Call Alpha Vantage daily time series API
        const url =
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY` +
            `&symbol=${encodeURIComponent(symbol)}` +
            `&outputsize=full` +
            `&apikey=${process.env.ALPHA_KEY}`;

        const res = await fetch(url).then((r) => r.json());

        // AlphaVantage error cases
        if (res?.["Error Message"]) {
            throw new Error(`Alpha Vantage error for ${symbol}: ${res["Error Message"]}`);
        }
        if (res?.["Note"]) {
            // rate limit message
            throw new Error(`Alpha Vantage rate limit hit: ${res["Note"]}`);
        }

        // Daily price series keyed by date
        const series = res["Time Series (Daily)"];
        console.log("days returned:", Object.keys(series).length);

        if (!series) {
            throw new Error(`No historical data returned for ${symbol}`);
        }

        let lowest = Number.POSITIVE_INFINITY;
        let lowestDate = "";
        let highest = Number.NEGATIVE_INFINITY;
        let highestDate = "";

        // Iterate through all days to find lowest price
        for (const [date, data] of Object.entries(series)) {
            const low = parseFloat((data as any)["3. low"]);
            const high = parseFloat((data as any)["2. high"]);

            if (!Number.isFinite(low) || !Number.isFinite(high)) continue;

            if (low < lowest) { lowest = low; lowestDate = date; }
            if (high > highest) { highest = high; highestDate = date; }
        }

        if (!Number.isFinite(lowest) || !Number.isFinite(highest)) {
            throw new Error(`Could not compute low/high for ${symbol}`)
        }

        return {
            symbol,
            lowest,
            lowestDate,
            highest,
            highestDate,
        };
    },
});



