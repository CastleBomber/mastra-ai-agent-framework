import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const stockPricesHistorical = createTool({
  id: "stock-prices-historical",
  description: "Fetches historical daily price data for a stock and finds the lowest trading price",
  // Tool input: stock ticker symbol (ex: GOLD)
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    lowest: z.number(),
    date: z.string()
  }),
  execute: async ({ context }) => {
    const { symbol } = context;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_KEY}`;
    const res = await fetch(url).then((r) => r.json());
    const series = res["Time Series (Daily)"];
    if (!series) {
      throw new Error(`No historical data returned for ${symbol}`);
    }
    let lowest = Infinity;
    let lowestDate = "";
    for (const [date, data] of Object.entries(series)) {
      const low = parseFloat(data["3. low"]);
      if (low < lowest) {
        lowest = low;
        lowestDate = date;
      }
    }
    return {
      lowest,
      date: lowestDate
    };
  }
});

export { stockPricesHistorical };
