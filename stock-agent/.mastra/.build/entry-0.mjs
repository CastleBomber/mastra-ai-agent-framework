import 'dotenv/config';
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
  description: "Fetches recent company news for a stock symbol (14-day with 90-day fallback)",
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    headlines: z.array(
      z.object({
        title: z.string(),
        date: z.string(),
        url: z.string(),
        summary: z.string().optional()
      })
    ),
    note: z.string().optional()
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
      date: new Date(a.datetime * 1e3).toISOString().split("T")[0],
      url: a.url,
      summary: a.summary
    }));
    return note ? { headlines, note } : { headlines };
  }
});

const stockPricesHistorical = createTool({
  id: "stock-prices-historical",
  description: "Fetches historical stock price data and returns the all-time lowest and highest prices with dates",
  // Tool input: stock ticker symbol (ex: GOLD)
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    symbol: z.string(),
    lowest: z.number(),
    lowestDate: z.string(),
    highest: z.number(),
    highestDate: z.string()
  }),
  execute: async ({ context }) => {
    const { symbol } = context;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=full&apikey=${process.env.ALPHA_KEY}`;
    const res = await fetch(url).then((r) => r.json());
    if (res?.["Error Message"]) {
      throw new Error(`Alpha Vantage error for ${symbol}: ${res["Error Message"]}`);
    }
    if (res?.["Note"]) {
      throw new Error(`Alpha Vantage rate limit hit: ${res["Note"]}`);
    }
    const series = res["Time Series (Daily)"];
    if (!series) {
      throw new Error(`No historical data returned for ${symbol}`);
    }
    let lowest = Number.POSITIVE_INFINITY;
    let lowestDate = "";
    let highest = Number.NEGATIVE_INFINITY;
    let highestDate = "";
    for (const [date, data] of Object.entries(series)) {
      const low = parseFloat(data["3. low"]);
      const high = parseFloat(data["2. high"]);
      if (!Number.isFinite(low) || !Number.isFinite(high)) continue;
      if (low < lowest) {
        lowest = low;
        lowestDate = date;
      }
      if (high > highest) {
        highest = high;
        highestDate = date;
      }
    }
    if (!Number.isFinite(lowest) || !Number.isFinite(highest)) {
      throw new Error(`Could not compute low/high for ${symbol}`);
    }
    return {
      symbol,
      lowest,
      lowestDate,
      highest,
      highestDate
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

    When using stockNews:
    - Present results as a bulleted list.
    - The article title should be a clickable hyperlink to the article.
    - On the next line, show the publication date in italics, with no "Date:" prefix, formatted like: JAN 25th.
    - Do NOT print a separate "Read more" line.
    - Do NOT include summaries unless the user explicitly asks for a summary, explanation, or paragraph.
    - If the user asks for more detail about a specific article, you may then use the stored summary.

    When using stockPricesHistorical:
    - If the user asks for "highest", "all-time high", "ATH", or "peak", you MUST report highest + highestDate.
    - If the user asks for "lowest", "all-time low", "ATL", or "bottom", you MUST report lowest + lowestDate.
    - Never swap highest/lowest. If the tool output does not include the requested metric, say you cannot answer.


    When using stockPricesHistorical:
    - If the user asks for "highest", "all-time high", "ATH", or "peak", you MUST report highest + highestDate.

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
