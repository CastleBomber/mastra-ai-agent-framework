import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import axios from 'axios';
import { createWorkflow, createStep } from '@mastra/core/workflows';

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

const stockNews = createTool({
  id: "Get Stock News",
  inputSchema: z.object({
    symbol: z.string()
  }),
  description: "Fetches real, live financial news for a stock symbol.",
  execute: async ({ context: { symbol } }) => {
    const apiKey = process.env.FINNHUB_KEY;
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2024-01-01&to=2024-12-31&token=${apiKey}`,
      {
        params: {
          symbol,
          from: "2024-01-01",
          to: "2024-12-31",
          token: apiKey
        }
      }
    );
    const headlines = data.slice(0, 3).map((item) => item.headline);
    return {
      symbol,
      headlines
    };
  }
});

const stockHistorical = createTool({
  id: "Get Historical Prices",
  inputSchema: z.object({
    symbol: z.string(),
    from: z.string().optional(),
    to: z.string().optional()
  }),
  description: "Fetches historical daily closing prices for a symbol.",
  execute: async ({ context }) => {
    const { symbol, from, to } = context;
    const apiKey = process.env.FINNHUB_KEY;
    const { data } = await axios.get(
      `https://finnhub.io/api/v1/stock/candle`,
      {
        params: {
          symbol,
          resolution: "D",
          from: Math.floor(new Date(from ?? "2000-01-01").getTime() / 1e3),
          to: Math.floor(new Date(to ?? Date.now()).getTime() / 1e3),
          token: apiKey
        }
      }
    );
    const lowest = Math.min(...data.c);
    const index = data.c.indexOf(lowest);
    const timestamp = data.t[index] * 1e3;
    const date = new Date(timestamp).toISOString().split("T")[0];
    return { symbol, lowest, date };
  }
});

const mem = new Memory({
  options: { lastMessages: 50 },
  storage: new LibSQLStore({ url: "file:./mastra.db" })
});
const stockAgent = new Agent({
  name: "Stock Agent",
  model: "openai/gpt-4o-mini",
  memory: mem,
  instructions: `
    You are a helpful assistant.
    When relevant, use the remembered information to give more personalized and consistent answers.
    Do not invent memory that was not provided.
`,
  tools: {
    stockPrices: stockPrices,
    stockNews,
    stockHistorical
  }
});

const stepGetPrice = createStep({
  id: "get-price",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({ currentPrice: z.number() }),
  execute: async ({ inputData }) => {
    const res = await stockPrices.execute({ context: { symbol: inputData.symbol } });
    return { currentPrice: res.currentPrice };
  }
});
const stepGetLow = createStep({
  id: "get-low",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({ lowest: z.number(), lowestDate: z.string() }),
  execute: async ({ inputData }) => {
    const res = await stockHistorical.execute({ context: { symbol: inputData.symbol } });
    return { lowest: res.lowest, lowestDate: res.date };
  }
});
const stepGetNews = createStep({
  id: "get-news",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({ headlines: z.array(z.string()) }),
  execute: async ({ inputData }) => {
    const res = await stockNews.execute({ context: { symbol: inputData.symbol } });
    return { headlines: res.headlines };
  }
});
const stockWorkflow = createWorkflow({
  id: "stock-analyze-workflow",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.number(),
    lowest: z.number(),
    lowestDate: z.string(),
    headlines: z.array(z.string())
  })
}).then(stepGetPrice).then(stepGetLow).then(stepGetNews).commit();

const mastra = new Mastra({
  agents: {
    stockAgent
  },
  workflows: {
    stockWorkflow
  },
  storage: new LibSQLStore({
    url: "file:./mastra.db"
  })
});

export { mastra };
