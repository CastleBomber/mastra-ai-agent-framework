/**
 * stockWorkflow.ts
 * ----------------
 * Stock Detective Workflow
 * 
 * Author: DeepSeek + ChatGPT + CBombs
 *
 * This workflow orchestrates a multi-step analysis of a stock:
 * 1. Fetch current price
 * 2. Retrieve all-time high/low prices
 * 3. Fetch recent news headlines
 * 4. Calculate percentage distance from all-time high
 *
 * Built with Mastra v1.3.4 createWorkflow and createStep APIs.
 *
 */
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockPricesCurrent } from "../tools/stockPricesCurrent";
import { stockPricesHistorical } from "../tools/stockPricesHistorical";
import { stockNews } from "../tools/stockNews";

// Step 1: Get current price
const stepGetCurrentPrice = createStep({
    id: "getPrice",

    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string()
    }),

    execute: async ({ inputData }) => {
        const result = await stockPricesCurrent.execute({ symbol: inputData.symbol });

        return {
            symbol: inputData.symbol,
            currentPrice: result.currentPrice,
        };
    },
});

// Step 2: Get all-time low/high
const stepGetHistoricalPrices = createStep({
    id: "getHistorical",

    inputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string(),
    }),
    outputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string(),
        lowest: z.number(),
        lowestDate: z.string(),
        highest: z.number(),
        highestDate: z.string(),
    }),

    execute: async ({ inputData }) => {
        const result = await stockPricesHistorical.execute({ symbol: inputData.symbol });

        return {
            ...inputData,
            lowest: result.lowest,
            lowestDate: result.lowestDate,
            highest: result.highest,
            highestDate: result.highestDate,
        };
    }
});

// Step 3: Get recent news
const stepGetNews = createStep({
    id: "getNews",

    inputSchema: z.any(),
    outputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string(),
        lowest: z.number(),
        lowestDate: z.string(),
        highest: z.number(),
        highestDate: z.string(),
        headlines: z.array(
            z.object({
                title: z.string(),
                date: z.string(),
                url: z.string(),
            })
        ),
    }),

    execute: async ({ inputData }) => {
        const result = await stockNews.execute({ symbol: inputData.symbol });

        return {
            ...inputData,
            headlines: result.headlines,
        };
    }
});

// Step 4: Calculate distance from all-time high (above or below)
const stepGetPercentFromATH = createStep({
    id: "getPercentFromATH",

    inputSchema: z.any(),
    outputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string(),
        lowest: z.number(),
        lowestDate: z.string(),
        highest: z.number(),
        highestDate: z.string(),
        headlines: z.array(
            z.object({
                title: z.string(),
                date: z.string(),
                url: z.string(),
            })
        ),
        percentFromATH: z.string().optional(),
    }),

    execute: async ({ inputData }) => {

        const current = parseFloat(inputData.currentPrice);
        const ath = inputData.highest;

        if (!Number.isFinite(current) || !Number.isFinite(ath)) {
            return { ...inputData };
        }

        const diffPercent = ((current - ath) / ath) * 100;
        const absPercent = Math.abs(diffPercent).toFixed(2);
        const direction = current >= ath ? "above" : "below";

        return {
            ...inputData,
            percentFromATH: `${absPercent}% ${direction} ATH`,
        };
    }
});

// Define the workflow
export const stockWorkflow = createWorkflow({
    id: "stock-detective",
    name: "Stock Detective",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string(),
        lowest: z.number(),
        lowestDate: z.string(),
        highest: z.number(),
        highestDate: z.string(),
        headlines: z.array(
            z.object({
                title: z.string(),
                date: z.string(),
                url: z.string(),
            })
        ),
        percentFromATH: z.string().optional(),
    }),
})
    .then(stepGetCurrentPrice)
    .then(stepGetHistoricalPrices)
    .then(stepGetNews)
    .then(stepGetPercentFromATH)
    .commit();
