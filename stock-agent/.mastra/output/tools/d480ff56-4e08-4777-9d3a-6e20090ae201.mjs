import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import YahooFinance from 'yahoo-finance2';

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

export { finnhubCandlesDaily, stockPricesHistorical };
