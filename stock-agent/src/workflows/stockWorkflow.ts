import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockPrices } from "../tools/stockPrices";
import { stockHistorical } from "../tools/stockHistorical";
import { stockNews } from "../tools/stockNews";

// Step 1: get current price
const stepGetPrice = createStep({
    id: "get-price",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({ currentPrice: z.number() }),
    execute: async ({ inputData }) => {
        const res = await stockPrices.execute({ context: { symbol: inputData.symbol } });
        return { currentPrice: res.currentPrice };
    },
});

// Step 2: get historical low
const stepGetLow = createStep({
    id: "get-low",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({ lowest: z.number(), lowestDate: z.string() }),
    execute: async ({ inputData }) => {
        const res = await stockHistorical.execute({ context: { symbol: inputData.symbol } });
        return { lowest: res.lowest, lowestDate: res.date };
    },
});

// Step 3: get news
const stepGetNews = createStep({
    id: "get-news",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({ headlines: z.array(z.string()) }),
    execute: async ({ inputData }) => {
        const res = await stockNews.execute({ context: { symbol: inputData.symbol } });
        return { headlines: res.headlines };
    },
});

// Compose workflow
export const stockWorkflow = createWorkflow({
    id: "stock-analyze-workflow",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.number(),
        lowest: z.number(),
        lowestDate: z.string(),
        headlines: z.array(z.string())
    }),
})
    .then(stepGetPrice)
    .then(stepGetLow)
    .then(stepGetNews)
    .commit();
