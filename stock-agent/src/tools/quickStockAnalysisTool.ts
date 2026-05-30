/**
 * quickStockAnalysisTool.ts
 * -------------------------
 * Tool: Quick Stock Analysis (workflow wrapper)
 *
 * Provides a single‑call interface to the quickStockAnalysisWorkflow.
 * 
 * Returns a complete stock snapshot including 
 * current price, 
 * all‑time high/low,
 * and percentage distance from the all‑time high.
 *
 * Answers user slash commands like:
 *   - "/stock SPY"
 *   - "/stock NVDA"
 *
 * Behavior:
 *   1) Accepts a stock symbol
 *   2) Executes quickStockAnalysisWorkflow
 *   3) Returns structured result (no LLM formatting, raw data)
 *
 * Input:
 *   symbol (string) – stock ticker (e.g., "AAPL")
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
 * Notes:
 *   Claude: "The agent can't invoke workflows — that's the workflow engine's job."
 *
 */

import { quickStockAnalysisWorkflow } from "@/workflows/quickStockAnalysisWorkflow";
import { createTool } from "@mastra/core/tools";


export const quickStockAnalysisTool = createTool({
  id: "quick-stock-analysis",
  description: "Run quick stock analysis for a symbol. Returns current price, all-time high/low, and percentage from all-time high.",
  inputSchema: z.object({ symbol: z.string() }),
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
    const run = await quickStockAnalysisWorkflow.createRunAsync();
    const result = await run.start({ 
      inputData: { symbol: inputData.symbol } 
    });
    return result.results;
  },
});




