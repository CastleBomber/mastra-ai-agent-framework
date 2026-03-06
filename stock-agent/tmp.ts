import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockPricesCurrent } from "../tools/stockPricesCurrent";
import { stockPricesHistorical } from "../tools/stockPricesHistorical";
import { stockNews } from "../tools/stockNews";

// --- Define each step with createStep ---
const stepGetPrice = createStep({
  id: "getPrice",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({ currentPrice: z.string() }),
  execute: async ({ inputData }) => {
    const result = await stockPricesCurrent.execute({ symbol: inputData.symbol });
    return { currentPrice: result.currentPrice };
  }
});

const stepGetHistorical = createStep({
  id: "getHistorical",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({
    lowest: z.number(),
    lowestDate: z.string(),
    highest: z.number(),
    highestDate: z.string(),
  }),
  execute: async ({ inputData }) => {
    const result = await stockPricesHistorical.execute({ symbol: inputData.symbol });
    return {
      lowest: result.lowest,
      lowestDate: result.lowestDate,
      highest: result.highest,
      highestDate: result.highestDate,
    };
  }
});

const stepGetNews = createStep({
  id: "getNews",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({
    headlines: z.array(z.object({ title: z.string(), date: z.string(), url: z.string() })),
  }),
  execute: async ({ inputData }) => {
    const result = await stockNews.execute({ symbol: inputData.symbol });
    return { headlines: result.headlines };
  }
});

const stepGetPercentFromATH = createStep({
  id: "getPercentFromATH",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({ percentFromATH: z.string().optional() }),
  execute: async ({ inputData, context }) => {
    // This step requires previous step results — we'll handle via workflow state
    // In v1, steps can access previous step outputs via context.steps
    const priceStep = context.steps.getPrice;
    const histStep = context.steps.getHistorical;
    if (priceStep?.status === "success" && histStep?.status === "success") {
      const current = parseFloat(priceStep.output.currentPrice);
      const ath = histStep.output.highest;
      const diffPercent = ((current - ath) / ath) * 100;
      const absPercent = Math.abs(diffPercent).toFixed(2);
      const direction = current >= ath ? "above" : "below";
      return { percentFromATH: `${absPercent}% ${direction} ATH` };
    }
    return {};
  }
});

// --- Compose workflow with .then() chaining (or .step() if available — check docs) ---
export const stockWorkflow = createWorkflow({
  id: "stock-detective",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
    lowest: z.number(),
    lowestDate: z.string(),
    highest: z.number(),
    highestDate: z.string(),
    headlines: z.array(z.object({ title: z.string(), date: z.string(), url: z.string() })),
    percentFromATH: z.string().optional(),
  }),
})
  .then(stepGetPrice)
  .then(stepGetHistorical)
  .then(stepGetNews)
  .then(stepGetPercentFromATH)
  .commit();