import { Tool, Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { createStep, createWorkflow } from '@mastra/core/workflows';

const getStockPrice = async (symbol) => {
  const r = await fetch(
    `https://mastra-stock-data.vercel.app/api/stock-data?symbol=${symbol}`
  );
  if (!r.ok) {
    throw new Error(`Price API failed for ${symbol}`);
  }
  const data = await r.json();
  return data.prices["4. close"];
};
const stockPricesCurrent = createTool({
  id: "get-stock-price",
  description: "Fetches the last day's closing stock price for a given symbol",
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string()
  }),
  execute: async ({ context }) => {
    const { symbol } = context;
    console.log("Using tool to fetch current stock price for", symbol);
    return {
      symbol,
      currentPrice: await getStockPrice(symbol)
    };
  }
});

const stockNews = new Tool({
  id: "stock-news",
  description: "Fetches recent company news for a stock symbol",
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    headlines: z.array(
      z.object({
        title: z.string(),
        date: z.string()
      })
    )
  }),
  execute: async ({ symbol }) => {
    const from = new Date(Date.now() - 14 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
    const to = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_KEY}`;
    const res = await fetch(url).then((r) => r.json());
    if (!Array.isArray(res)) return {
      headlines: []
    };
    return {
      headlines: res.slice(0, 5).map((a) => ({
        title: a.headline,
        date: new Date(a.datetime * 1e3).toISOString().split("T")[0]
      }))
    };
  }
});

const stockPricesHistorical = new Tool({
  id: "stock-prices-historical",
  // Tool input: stock ticker symbol (ex: SPY)
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    lowest: z.number(),
    date: z.string()
  }),
  execute: async ({ symbol }) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_KEY}`;
    const res = await fetch(url).then((r) => r.json());
    const series = res["Time Series (Daily)"];
    if (!series) {
      throw new Error(`No historical ddata returned for ${symbol}`);
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
    stockPricesCurrent: stockPricesCurrent,
    stockPricesHistorical: stockPricesHistorical,
    stockNews
  }
});

const stepGetPrice = createStep({
  id: "get-price",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({ currentPrice: z.number() }),
  execute: async ({ inputData }) => {
    const res = await stockPricesCurrent.execute({
      symbol: inputData.symbol
    });
    return { currentPrice: res.currentPrice };
  }
});
const stepGetLow = createStep({
  id: "get-low",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({
    lowest: z.number(),
    lowestDate: z.string()
  }),
  execute: async ({ inputData }) => {
    const res = await stockPricesHistorical.execute({
      symbol: inputData.symbol
    });
    return {
      lowest: res.lowest,
      lowestDate: res.date
    };
  }
});
const stepGetNews = createStep({
  id: "get-news",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({
    headlines: z.array(
      z.object({
        title: z.string(),
        date: z.string()
      })
    )
  }),
  execute: async ({ inputData }) => {
    const res = await stockNews.execute({
      symbol: inputData.symbol
    });
    return { headlines: res.headlines };
  }
});
const stockWorkflow = createWorkflow({
  id: "stock-analyze-workflow",
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({
    symbol: z.string(),
    currentPrice: z.string(),
    lowest: z.number(),
    lowestDate: z.string(),
    headlines: z.array(
      z.object({
        title: z.string(),
        date: z.string()
      })
    )
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
