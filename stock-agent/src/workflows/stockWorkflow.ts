import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { stockPricesCurrent } from "../tools/stockPricesCurrent";
import { stockPricesHistorical } from "../tools/stockPricesHistorical";
import { stockNews } from "../tools/stockNews";

// Step 1: Get current price
const stepGetCurrentPrice = createStep({
    id: "getPrice",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({ currentPrice: z.string() }),
    execute: async ({ inputData }) => {
        const result = await stockPricesCurrent.execute({ symbol: inputData.symbol });
        return { currentPrice: result.currentPrice };
    },
});

// Step 2: Get all-time low/high
const stepGetHistoricalPrices = createStep({
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

// Step 3: Get recent news
const stepGetNews = createStep({
    id: "getNews",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({
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
        return { headlines: result.headlines };
    }
});

// Step 4: Calculate distance from all-time high (above or below)
const stepGetPercentFromATH = createStep({
    id: "getPercentFromATH",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({
        percentFromATH: z.string().optional(), // e.g. "2.5%  above ATH" or "1.3% below ATH"
        symbol: z.string(),
    }),
    execute: async ({ inputData, context }) => {
        const priceStep = context.steps.getPrice;
        const histStep = context.steps.getHistorical;

        if (priceStep?.status === "success" && histStep?.status === "success") {
            const current = parseFloat(priceStep.output.currentPrice);
            const ath = histStep.output.highest;
            const diffPercent = ((current - ath) / ath) * 100;
            const absPercent = Math.abs(diffPercent).toFixed(2);
            const direction = current >= ath ? "above" : "below";

            return { 
                percentFromATH: `${absPercent}% ${direction} ATH` ,
                symbol: inputData.symbol,
            };
        }

        // If prerequisite steps failed, return only the symbol (percentFromATH omitted)
        return {
            symbol: inputData.symbol,
        }; 
    }
});

// Define the workflow
export const stockWorkflow = createWorkflow({
    name: "stock-detective",
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
     .then(stepGetCurrentPrice)
     .then(stepGetHistoricalPrices)
     .then(stepGetNews)
     .then(stepGetPercentFromATH)
     .commit();
     