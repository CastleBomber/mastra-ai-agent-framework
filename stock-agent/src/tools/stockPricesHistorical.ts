/**
 * stockPricesHistorical.ts
 * ------------------------
 * Tool: Analyze historical stock prices
 *
 * Fetches historical daily price data for a given stock symbol and
 * computes the lowest trading price along with the date it occurred.
 *
 * Answers questions like:
 *   - "What is the lowest price SPY has ever traded at?"
 *   - "What was GOLD's historical low?"
 *
 * Data source:
 *   Alpha Vantage – Daily Time Series API
 *
 * Notes:
 *   - Currently calculates ONLY the lowest price
 *   - Designed to be extended with highest price, averages, indicators, etc.
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// Tool that fetches historical daily prices and computes the lowest trading price
export const stockPricesHistorical = createTool({
    id: "stock-prices-historical",
    description: "Fetches historical daily price data for a stock and finds the lowest trading price",

    // Tool input: stock ticker symbol (ex: GOLD)
    inputSchema: z.object( {
        symbol: z.string()
    }),

    outputSchema: z.object({
        lowest: z.number(),
        date: z.string(),
    }),

    execute: async ({ context }) => {
        const { symbol } = context;

        // Call Alpha Vantage daily time series API
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_KEY}`;
        const res = await fetch(url).then(r => r.json());

        // Daily price series keyed by date
        const series = res["Time Series (Daily)"];
        if (!series) {
            throw new Error(`No historical data returned for ${symbol}`);
        }

        let lowest = Infinity;
        let lowestDate = "";

        // Iterate through all days to find lowest price
        for (const [date, data] of Object.entries(series)) {
            const low = parseFloat((data as any)["3. low"]);
            if (low < lowest) {
                lowest = low;
                lowestDate = date;
            }
        }

        return {
            lowest,
            date: lowestDate
        };
    },
});



