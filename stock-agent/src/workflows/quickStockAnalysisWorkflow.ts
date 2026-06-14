/**
 * quickStockAnalysisWorkflow.ts
 * -----------------------------
 * Workflow: Instant Stock Analysis
 *
 * Returns a concise stock summary for fast lookup commands
 *
 * Answers questions like:
 *   - "/stock SPY"
 *   - "/stock NVDA"
 *
 * Behavior:
 *   1) Fetch current stock price
 *   2) Retrieve ATH + ATL
 *   3) Calculate % from ATH
 *   4) Return clean formatted stock snapshot
 *
 * Input:
 *   symbol (string)
 *
 * Output:
 *   {
 *     symbol,
 *     currentPrice,
 *     highest,
 *     highestDate,
 *     lowest,
 *     lowestDate,
 *     percentFromATH
 *   }
 * 
 */

import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockPriceCurrent } from "@/tools/stockPriceCurrent";
import { stockExtremes } from "@/tools/stockExtremes";


// Step 1: Get current price
const stepGetPrice = createStep({
  id: "getPrice",

  inputSchema: z.object({
    symbol: z.string(),
  }),

  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
  }),

  execute: async ({ inputData }) => {
    const result = await stockPriceCurrent.execute({
      symbol: inputData.symbol,
    });

    return {
      symbol: inputData.symbol.toUpperCase(),
      currentPrice: result.currentPrice,
    };
  },
});

// Step 2: Get ATH / ATL
const stepGetExtremes = createStep({
  id: "getExtremes",

  inputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
  }),

  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
    highest: z.number(),
    highestDate: z.string(),
    lowest: z.number(),
    lowestDate: z.string(),
    note: z.string().optional(),
  }),

  execute: async ({ inputData }) => {
    const result = await stockExtremes.execute({
      symbol: inputData.symbol,
    });

    return {
      ...inputData,
      highest: result.highest,
      highestDate: result.highestDate,
      lowest: result.lowest,
      lowestDate: result.lowestDate,
      note: result.note,
    };
  },
});

// Step 3: Calculate % from ATH
const stepPercentFromATH = createStep({
  id: "percentFromATH",

  inputSchema: z.any(),

  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
    highest: z.number(),
    highestDate: z.string(),
    lowest: z.number(),
    lowestDate: z.string(),
    percentFromATH: z.string(),
  }),

  execute: async ({ inputData }) => {
    const current = parseFloat(inputData.currentPrice);
    const ath = inputData.highest;

    const diffPercent = ((current - ath) / ath) * 100;
    const absPercent = Math.abs(diffPercent).toFixed(2);

    return {
      ...inputData,
      percentFromATH: `${absPercent}% below ATH`,
    };
  },
});

export const quickStockAnalysisWorkflow = createWorkflow({
  id: "quick-stock-analysis",

  inputSchema: z.object({
    symbol: z.string(),
  }),

  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
    highest: z.number(),
    highestDate: z.string(),
    lowest: z.number(),
    lowestDate: z.string(),
    percentFromATH: z.string(),
  }),
})
  .then(stepGetPrice)
  .then(stepGetExtremes)
  .then(stepPercentFromATH)
  .commit();

