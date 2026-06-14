/**
 * stockATHWorkflow.ts
 * ----------------
 * Workflow: Stock ATH
 * 
 * Orchestrates a multi-step analysis of a stock:
 * 1. Fetch current price
 * 2. Retrieve all-time high/low prices
 * 3. Calculate percentage distance from all-time high
 *
 * Answers questions like:
 *   - "How far is NVDA from its all-time high?"
 * 
 * Behavior:
 *   1) Accepts stock symbol as input
 *   2) Chains steps, passing accumulated data forward
 *   3) Returns final enriched object
 * 
 * Input:
 *   "SPY" (into Mastra's Workflow tool)
 *   symbol (string) - stock ticker
 * 
 * Output:
 *   percentFromATH
 * 
 * Data sources:
 *   - Current price: mastra-stock-data.vercel.app
 *   - Historical low/high: Finnhub (Yahoo fallback)
 * 
 * Built with Mastra createWorkflow + createStep APIs
 *
 */

import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockPriceCurrent } from "../tools/stockPriceCurrent";
import { stockExtremes } from "../tools/stockExtremes";

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
        note: z.string().optional(),
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

// Step 3: Calculate distance from ATH
const stepGetPercentFromATH = createStep({
    id: "getPercentFromATH",

    inputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string(),
        lowest: z.number(),
        lowestDate: z.string(),
        highest: z.number(),
        highestDate: z.string(),
        note: z.string().optional(),
    }),

    outputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string(),
        lowest: z.number(),
        lowestDate: z.string(),
        highest: z.number(),
        highestDate: z.string(),
        percentFromATH: z.string().optional(),
        note: z.string().optional(),
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
export const stockATHWorkflow = createWorkflow({
    id: "stock-ATH",
    name: "Stock ATH",

    inputSchema: z.object({ 
        symbol: z.string() 
    }),

    outputSchema: z.object({
        symbol: z.string(),
        currentPrice: z.string(),
        lowest: z.number(),
        lowestDate: z.string(),
        highest: z.number(),
        highestDate: z.string(),
        percentFromATH: z.string().optional(),
        note: z.string().optional(),
    }),
})
    .then(stepGetCurrentPrice)
    .then(stepGetExtremes)
    .then(stepGetPercentFromATH)
    .commit();
