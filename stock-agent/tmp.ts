export const stockPricesHistorical = createTool({
    id: "stock-prices-historical",
    description: "Historical all-time low/high using Finnhub (with Yahoo fallback)...",
    inputSchema: z.object({ symbol: z.string() }),
    outputSchema: z.object({ /* ... your output schema ... */ }),

    // ✅ CORRECT v1 SIGNATURE: (inputData, context)
    execute: async (inputData, context) => {
        // 1. Access the symbol directly from inputData (the first parameter)
        const { symbol } = inputData;
        console.log("Tool inputData:", inputData);
        console.log("Tool context:", context); // This now holds requestContext, agent info, etc.

        if (!symbol) {
            throw new Error(`Symbol is required. Received inputData: ${JSON.stringify(inputData)}`);
        }

        // --- The rest of your function logic remains the same, using the 'symbol' variable ---
        let ipoDate: string | undefined;
        try {
            const p = await finnhubProfile2(symbol);
            if (p?.ipo) ipoDate = p.ipo;
        } catch { /* ... */ }

        const now = new Date();
        const to = toUnix(now);
        const fromDate = ipoDate ? new Date(`${ipoDate}T00:00:00Z`) : new Date("1980-01-01T00:00:00Z");
        const from = toUnix(fromDate);

        try {
            const candle = await finnhubCandlesDaily(symbol, from, to);
            // ... rest of your Finnhub logic ...
        } catch (err) {
            // ... your Yahoo fallback logic ...
        }
    },
});