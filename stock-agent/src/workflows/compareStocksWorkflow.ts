// import { createWorkflow, createStep } from "@mastra/core/workflows";
// import { z } from "zod";
// import { stockWorkflow } from "./stockWorkflow";

// /*
// Input:
// ["NVDA","AAPL","MSFT"]
// */

// const stepCompare = createStep({
//     id: "rank",
//     inputSchema: z.record(z.any()),
//     outputSchema: z.object({
//         ranked: z.array(
//             z.object({
//                 symbol: z.string(),
//                 percentFromATH: z.string().optional(),
//             })
//         ),
//     }),

//     execute: async ({ inputData }) => {
//         // Flatten parallel results
//         const values = Object.values(inputData) as any[];

//         const ranked = values
//             .map(v => ({
//                 symbol: v.symbol,
//                 percentFromATH: v.percentFromATH,
//                 raw: parseFloat(v.percentFromATH?.split("%")[0] || "999"),
//             }))
//             .sort((a, b) => a.raw - b.raw); // Closest to ATH first

//         return {
//             ranked,
//         };
//     },
// });

// export const compareStocksWorkflow = createWorkflow({});

