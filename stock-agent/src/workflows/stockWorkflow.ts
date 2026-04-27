/**
 * stockWorkflow.ts
 * ----------------
 * Workflow: Stock Detective
 * 
 * Orchestrates a multi-step analysis of a stock:
 * 1. Fetch current price
 * 2. Retrieve all-time high/low prices
 * 3. Fetch recent news headlines
 * 4. Calculate percentage distance from all-time high
 *
 * Answers questions like:
 *   - "How far is AAPL from its all-time high?"
 *   - "Show me NVDA's current price, ATH, and latest news"
 * 
 * Behavior:
 *   1) Accepts stock symbol as input
 *   2) Chains 4 steps, each passing accumulated data forward
 *   3) Last step returns final enriched object
 *   4) Uses build-in tools for price, historical, news data
 * 
 * Input:
 *   "SPY" (into Mastra's Workflow tool)
 *   symbol (string) - stock ticker
 * 
 * Output:
 *   symbol, currentPrice, lowest, lowestDate, highest, highestDate,
 *   headlines (array of {title, date, url}), percentFromATH (optional)
 * 
 * Data sources:
 *   - Current price: mastra-stock-data.vercel.app
 *   - Historical low/high: Finnhub (Yahoo fallback)
 *   = News: Finnhub Company News API
 * 
 * Built with Mastra v1.3.4 createWorkflow and createStep APIs
 *
 */
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockPriceCurrent } from "../tools/stockPriceCurrent";
import { stockExtremes } from "../tools/stockExtremes";
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
        const result = await stockPriceCurrent.execute({ symbol: inputData.symbol });

        return {
            symbol: inputData.symbol,
            currentPrice: result.currentPrice,
        };
    },
});

// Step 2: Get all-time low/high
const stepGetExtremes = createStep({
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
        const result = await stockExtremes.execute({ symbol: inputData.symbol });

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
    .then(stepGetExtremes)
    .then(stepGetNews)
    .then(stepGetPercentFromATH)
    .commit();
