/**
 * testStockWorkflow.ts
 * --------------------
 * Test Script: Execute Stock Detective Workflow
 *
 * Runs the full stock analysis workflow and prints the result.
 *
 * Workflow Steps:
 *   1) Fetch current price
 *   2) Retrieve all-time low/high
 *   3) Fetch recent news
 *   4) Calculate percent distance from ATH
 *
 * Example usage:
 *   npx tsx testWorkflow.ts
 * 
 *   Change symbol
 *   symbol: "SPY"
 *   symbol: "NVDA"
 *   symbol: "AAPL"
 *
 * Returns:
 *   {
 *     symbol: "SPY",
 *     currentPrice: "512.33",
 *     lowest: 43.94,
 *     lowestDate: "1993-01-29",
 *     highest: 523.17,
 *     highestDate: "2026-02-19",
 *     headlines: [...],
 *     percentFromATH: "2.06% below ATH"
 *   }
 *
 * Purpose:
 *   - Validate workflow step chaining
 *   - Debug tool integrations
 *   - Verify data pipeline integrity
 *   - Smoke test before agent integration
 *
 * Notes:
 *   - Uses Mastra createWorkflow run engine
 *   - Runs all steps sequentially
 *   - Logs final aggregated workflow output
 */
import { Mastra } from "@mastra/core";
import { stockWorkflow } from "./stockWorkflow";

async function main() {
    const mastra = new Mastra({
        workflows: {
            stockWorkflow,
        },
    });

    const run = await mastra
        .getWorkflow("stockWorkflow")
        .createRun();

    const result = await run.start({
        inputData: { symbol: "SPY" }
    });
}

main();