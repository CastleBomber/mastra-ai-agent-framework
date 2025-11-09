import { Agent, Mastra } from '@mastra/core';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const getStockPrice = async (symbol) => {
  const data = await fetch(
    `https://mastra-stock-data.vercel.app/api/stock-data?symbol=${symbol}`
  ).then((r) => r.json());
  return data.prices["4. close"];
};
const stockPrices = createTool({
  id: "Get Stock Price",
  inputSchema: z.object({
    symbol: z.string()
  }),
  description: `Fetches the last day's closing stock price for a given symbol`,
  execute: async ({ context: { symbol } }) => {
    console.log("Using tool to fetch stock price for", symbol);
    return {
      symbol,
      currentPrice: await getStockPrice(symbol)
    };
  }
});

const stockAgent = new Agent({
  name: "Stock Agent",
  instructions: `You are a helpful assistant that provides current stock prices. 
    When asked about a stock, 
    use the stock price tool to fetch the stock price.`,
  model: {
    provider: "OPEN_AI",
    name: "gpt-4o"
  },
  tools: {
    stockPrices: stockPrices
  }
});

const mastra = new Mastra({
  agents: {
    stockAgent
  }
});

export { mastra };
