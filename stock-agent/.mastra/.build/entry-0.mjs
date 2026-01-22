import { Mastra } from '@mastra/core';
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

const fmt = (d) => d.toISOString().split("T")[0];
const stockNews = createTool({
  id: "stock-news",
  description: "Fetches recent company news for a stock symbol (14-day with 90-day fallback",
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
  execute: async ({ context }) => {
    const { symbol } = context;
    const to = fmt(/* @__PURE__ */ new Date());
    const from14 = fmt(new Date(Date.now() - 14 * 24 * 60 * 60 * 1e3));
    const from90 = fmt(new Date(Date.now() - 90 * 24 * 60 * 60 * 1e3));
    const fetchNews = async (from) => {
      const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${process.env.FINNHUB_KEY}`;
      const res = await fetch(url).then((r) => r.json());
      return Array.isArray(res) ? res : [];
    };
    let articles = await fetchNews(from14);
    let note;
    if (articles.length === 0) {
      articles = await fetchNews(from90);
      note = "No news found in the last 14 days; expanded search window to 90 days.";
    }
    if (articles.length === 0) {
      return {
        headlines: [],
        note: "No company news returned for this symbol in the last 90 days."
      };
    }
    const headlines = articles.sort((a, b) => (b.datetime ?? 0) - (a.datetime ?? 0)).slice(0, 5).map((a) => ({
      title: a.headline,
      date: new Date(a.datetime * 1e3).toISOString().split("T")[0]
    }));
    return note ? { headlines, note } : { headlines };
  }
});

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
