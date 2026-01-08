import { Tool } from "@mastra/core";

export const stockPricesHistorical = new Tool({
  id: "stock-prices-historical",
  inputSchema: {
    type: "object",
    properties: { symbol: { type: "string" } },
    required: ["symbol"],
  },
  execute: async ({ context }) => {
    const { symbol } = context;

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_KEY}`;
    const res = await fetch(url).then(r => r.json());

    const series = res["Time Series (Daily)"];
    if (!series) return { lowest: null, date: null };

    let lowest = Infinity;
    let lowestDate: string | null = null;

    for (const [date, data] of Object.entries(series)) {
      const low = parseFloat((data as any)["3. low"]);
      if (low < lowest) {
        lowest = low;
        lowestDate = date;
      }
    }

    return { lowest, date: lowestDate };
  },
});
