// Will add to this script to have: highest (value), etc.
import { Tool } from "@mastra/core";

// Tool that fetches historical daily prices and computes the lowest trading price
export const stockPricesHistorical = new Tool({
    id: "stock-prices-historical",

    // Tool input: stock ticker symbol (ex: SPY)
    inputSchema: {
        type: "object",
        properties: { symbol: { type: "string" } },
        required: ["symbol"],
    },

    execute: async ({ context }) => {
        const { symbol } = context;

        // Call Alpha Vantage daily time series API
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_KEY}`;
        const res = await fetch(url).then(r => r.json());

        // Daily price series keyed by date
        const series = res["Time Series (Daily)"];
        if (!series) {
            // API error or rate limit hit
            return { lowest: null, date: null };
        }

        let lowest = Infinity;
        let lowestDate: string | null = null;

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



