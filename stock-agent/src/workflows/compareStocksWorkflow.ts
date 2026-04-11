/**
 * compareStocksWorkflow.ts
 * ------------------------
 * Workflow: Compare Stocks by Distance to All-time high (ATH)
 * 
 * Runs the Stock Detective workflow in parallel on multiple symbols,
 * then ranks them by how close each is to its ATH.
 * 
 * Answers questions like:
 *   - "Which of NVDA, AAPL, MSFT is closest to its ATH?"
 *   - "Rank these stocks by percentage below their peak"
 * 
 * Behavior:
 *   1) Accepts array of stock symbols
 *   2) Executes stockWorkflow for each symbol in parallel
 *   3) Aggregates results, extracts percentFromATH
 *   4) Sorts symbols ascending by percentage (closest to ATH first)
 * 
 * Input: 
 *   ["NVDA","AAPL","MSFT"]
 *   symbols (string[]) - array of stock tickers
 * 
 * Output:
 *   ranked (array) - objects containing { symbol, percentFromATH } sorted
 *                    by smallest percentage below ATH (i.e., closest to peak)
 * 
 * Built with Mastra v1.3.4 parallel execution and workflow composition
 */

import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockWorkflow } from "./stockWorkflow";

/*
Input:
["NVDA","AAPL","MSFT"]
*/

const stepCompare = createStep({
    id: "rank",
    inputSchema: z.record(z.any()),
    outputSchema: z.object({
        ranked: z.array(
            z.object({
                symbol: z.string(),
                percentFromATH: z.string().optional(),
            })
        ),
    }),

    execute: async ({ inputData }) => {
        // Flatten parallel results
        const values = Object.values(inputData) as any[];

        const ranked = values
            .map(v => ({
                symbol: v.symbol,
                percentFromATH: v.percentFromATH,
                raw: parseFloat(v.percentFromATH?.split("%")[0] || "999"),
            }))
            .sort((a, b) => a.raw - b.raw); // Closest to ATH first

        return {
            ranked,
        };
    },
});

export const compareStocksWorkflow = createWorkflow({
    id: "compare-stocks",
    inputSchema: z.object({
        symbols: z.array(z.string()),
    }),
    outputSchema: z.object({
        ranked: z.array(
            z.object({
                symbol: z.string(),
                percentFromATH: z.string().optional(),
            })
        ),
    }),
})
    .parallel([
        stockWorkflow.withInput((ctx) => ({ symbol: ctx.symbols[0] })),
        stockWorkflow.withInput((ctx) => ({ symbol: ctx.symbols[1] })),
        stockWorkflow.withInput((ctx) => ({ symbol: ctx.symbols[2] })),
    ])
    .then(stepCompare)
    .commit();


