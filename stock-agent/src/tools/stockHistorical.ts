import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import axios from "axios";

export const stockHistorical = createTool({
    id: "Get Historical Prices",
    inputSchema: z.object({
        symbol: z.string(),
        from: z.string().optional(),
        to: z.string().optional(),
    }),
    description: "Fetches historical daily closing prices for a symbol.",
    execute: async ({ context }) => {
        const { symbol, from, to } = context;
        const apiKey = process.env.FINNHUB_KEY;

        const { data } = await axios.get(
            `https://finnhub.io/api/v1/stock/candle`,
            {
                params: {
                    symbol,
                    resolution: "D",
                    from: Math.floor(new Date(from ?? "2000-01-01").getTime() / 1000),
                    to: Math.floor(new Date(to ?? Date.now()).getTime() / 1000),
                    token: apiKey,
                },
            }
        );

        // lowest close price
        const lowest = Math.min(...data.c);
        const index = data.c.indexOf(lowest);
        const timestamp = data.t[index] * 1000;
        const date = new Date(timestamp).toISOString().split("T")[0];

        return { symbol, lowest, date };
    },
});


