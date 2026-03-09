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
    }),  // ✅ one closing brace/parenthesis + comma
})
 .step(stepGetCurrentPrice)       // use .step, not .then
 .step(stepGetHistoricalPrices)
 .step(stepGetNews)
 .step(stepGetPercentFromATH)
 .commit();