/**
 * compareStocksATHWorkflow.ts
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
 *   2) Executes stockATHWorkflow for each symbol in parallel
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
 * Built with Mastra v1.4+ parallel execution and workflow composition
 */

import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockATHWorkflow } from "./stockATHWorkflow";
import { Mastra } from "@mastra/core";

const stepCompare = createStep({
    id: "compare",

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
        // Used to register and run workflows inside a Mastra runtime
        const mastra = new Mastra({
            workflows: { stockATHWorkflow },
        });

        const results = await Promise.all(
            // Dynamic input of stock symbols
            inputData.symbols.map(async (symbol) => {
                const run = await mastra
                .getWorkflow("stockATHWorkflow")
                .createRun();

                const result = await run.start({
                    inputData: { symbol },
                });

                return result.result;
            })
        );    

        const ranked = results
        .map((r: any) => ({
            symbol: r.symbol,
            percentFromATH: r.percentFromATH,
            raw: parseFloat(r.percentFromATH?.split("%")[0] || "999"),
        }))
        .sort((a, b) => a.raw - b.raw);

        return {
            ranked
        };
    },
});

export const compareStocksATHWorkflow = createWorkflow({
    id: "stocks-compare-ATH",

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
    .then(stepCompare)
    .commit();

