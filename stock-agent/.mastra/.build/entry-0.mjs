import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import YahooFinance from 'yahoo-finance2';
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
  execute: async (inputData, context) => {
    const { symbol } = inputData;
    console.log("Tool inputData:", inputData);
    console.log("Tool context", context);
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
  execute: async (inputData, context) => {
    const { symbol } = inputData;
    console.log("Tool inputData:", inputData);
    console.log("Tool context", context);
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

const yahooFinance = new YahooFinance();
const toUnix = (date) => Math.floor(date.getTime() / 1e3);
const isoDay = (unixSeconds) => new Date(unixSeconds * 1e3).toISOString().split("T")[0];
async function fetchJson(url, timeoutMs = 12e3) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: controller.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
    return await r.json();
  } finally {
    clearTimeout(timer);
  }
}
async function finnhubProfile2(symbol) {
  const token = process.env.FINNHUB_KEY;
  if (!token) throw new Error("Missing FINNHUB_KEY in environment");
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(token)}`;
  return fetchJson(url);
}
function finnhubCandlesDaily(symbol, fromUnix, toUnix2) {
  const token = process.env.FINNHUB_KEY;
  if (!token) throw new Error("Missing FINNHUB_KEY in enviroment");
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${fromUnix}&to=${toUnix2}&token=${encodeURIComponent(token)}`;
  return fetchJson(url);
}
function computeLowHighFromArrays(t, lows, highs) {
  let lowest = Number.POSITIVE_INFINITY;
  let lowestT = 0;
  let highest = Number.NEGATIVE_INFINITY;
  let highestT = 0;
  for (let i = 0; i < t.length; i++) {
    const lo = lows[i];
    const hi = highs[i];
    const ts = t[i];
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || !Number.isFinite(ts)) continue;
    if (lo < lowest) {
      lowest = lo;
      lowestT = ts;
    }
    if (hi > highest) {
      highest = hi;
      highestT = ts;
    }
  }
  if (!Number.isFinite(lowest) || !Number.isFinite(highest) || !lowestT || !highestT) {
    throw new Error("Could not compute low/high from returned data");
  }
  return {
    lowest,
    lowestDate: isoDay(lowestT),
    highest,
    highestDate: isoDay(highestT),
    earliestDate: isoDay(Math.min(...t))
  };
}
async function yahooLowHigh(symbol) {
  const chart = await yahooFinance.chart(symbol, {
    period1: "1900-01-01",
    interval: "1d"
  });
  if (!chart || typeof chart !== "object") {
    throw new Error(`Yahoo fallback returned invalid chart object for ${symbol}`);
  }
  const rawQuotes = chart.quotes;
  if (!Array.isArray(rawQuotes)) {
    throw new Error(`Yahoo fallback returned no quotes array for ${symbol}`);
  }
  if (rawQuotes.length === 0) {
    throw new Error(`Yahoo fallback returned empty quotes array for ${symbol}`);
  }
  let lowest = Number.POSITIVE_INFINITY;
  let lowestDate = "";
  let highest = Number.NEGATIVE_INFINITY;
  let highestDate = "";
  for (const q of rawQuotes) {
    if (!q) continue;
    const lo = Number(q.low);
    const hi = Number(q.high);
    const d = q.date ? new Date(q.date) : null;
    if (!d || !Number.isFinite(lo) || !Number.isFinite(hi)) continue;
    const day = d.toISOString().split("T")[0];
    if (lo < lowest) {
      lowest = lo;
      lowestDate = day;
    }
    if (hi > highest) {
      highest = hi;
      highestDate = day;
    }
  }
  if (!Number.isFinite(lowest) || !Number.isFinite(highest) || !lowestDate || !highestDate) {
    throw new Error(`Yahoo fallback couldn't compute low/high for ${symbol}`);
  }
  return { lowest, lowestDate, highest, highestDate };
}
const stockPricesHistorical = createTool({
  id: "stock-prices-historical",
  description: "Historical all-time low/high using Finnhub (with Yahoo fallback) +  returns dates and notes if range is limited",
  // Tool input: stock ticker symbol (ex: GOLD)
  inputSchema: z.object({
    symbol: z.string()
  }),
  outputSchema: z.object({
    symbol: z.string(),
    lowest: z.number(),
    lowestDate: z.string(),
    highest: z.number(),
    highestDate: z.string(),
    source: z.enum(["finnhub", "yahoo"]),
    note: z.string().optional(),
    earliestAvailable: z.string().optional(),
    // earliest date we actually received from the source
    ipoDate: z.string().optional()
  }),
  execute: async (inputData, context) => {
    const { symbol } = inputData;
    console.log("Tool inputData:", inputData);
    console.log("Tool context", context);
    if (!symbol) {
      throw new Error(`Symbol is required but was not provided in the arguments. Received args: ${JSON.stringify(args)}`);
    }
    let ipoDate;
    try {
      const p = await finnhubProfile2(symbol);
      if (p?.ipo) ipoDate = p.ipo;
    } catch {
    }
    const now = /* @__PURE__ */ new Date();
    const to = toUnix(now);
    const fromDate = ipoDate ? /* @__PURE__ */ new Date(`${ipoDate}T00:00:00Z`) : /* @__PURE__ */ new Date("1980-01-01T00:00:00Z");
    const from = toUnix(fromDate);
    try {
      const candle = await finnhubCandlesDaily(symbol, from, to);
      if (!candle || typeof candle !== "object") {
        throw new Error("Finnhub candle response missing");
      }
      if (candle.s !== "ok" || !Array.isArray(candle.t) || !Array.isArray(candle.l) || !Array.isArray(candle.h) || candle.t.length === 0) {
        throw new Error("Finnhub returned no_data / missing arrays");
      }
      const computed = computeLowHighFromArrays(candle.t, candle.l, candle.h);
      let note;
      if (ipoDate && computed.earliestDate > ipoDate) {
        note = `Finnhub earliest available was ${computed.earliestDate}; IPO is ${ipoDate}. Results reflect Finnhub's available range.`;
      }
      return {
        symbol,
        lowest: computed.lowest,
        lowestDate: computed.lowestDate,
        highest: computed.highest,
        highestDate: computed.highestDate,
        source: "finnhub",
        note,
        earliestAvailable: computed.earliestDate,
        ipoDate
      };
    } catch (err) {
      let y;
      try {
        y = await yahooLowHigh(symbol);
      } catch (yErr) {
        throw new Error(
          `Both Finnhub and Yahoo failed for ${symbol}. Finnhub error: ${err?.message ?? "unknown"} | Yahoo error: ${yErr?.message ?? "unknown"}`
        );
      }
      const note = `Finnhub could not return a full historidal range for ${symbol}. Used Yahoo Finance fallback; results reflect Yahoo's available range.`;
      return {
        symbol,
        ...y,
        source: "yahoo",
        note,
        ipoDate
      };
    }
  }
});

const mem = new Memory({
  options: { lastMessages: 50 },
  storage: new LibSQLStore({
    id: "stock-agent-storage",
    url: "file:./mastra.db"
  })
});
const stockAgent = new Agent({
  id: "stock-agent",
  name: "Stock Agent",
  model: "openai/gpt-4o",
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
    - Never swap highest/lowest. If the tool output does not include the requested metric, say you cannot answer.`,
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
    id: "stock-agent-storage",
    url: "file:./mastra.db"
  })
});

export { mastra };
