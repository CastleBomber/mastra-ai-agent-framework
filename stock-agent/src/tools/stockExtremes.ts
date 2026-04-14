/**
 * stockExtremes.ts
 * ------------------------
 * Tool: Analyze historical stock prices (All-time Low/High)
 *
 * Computes: 
 * - all-time lowest trading price + date
 * - all-time highest trading price + date
 *
 * Answers questions like:
 *   - What is the lowest price SPY has ever traded at?   $43.94 January 29th, 1993 (IPO)
 *   - What was GOLD's historical high?
 *   - What is the lowest ever price of SPY?
 *   - What is the highest price ever of WPM?
 *   - * (public since ~1892)
 *   - *What is the lowest ever price of PG? (public since 1891)
 * 
 * Strategy (robust + honest):
 *      1) Use Finnhub to fetch candles back to IPO date (via profile2.ipo)
 *      2) If Finnhub returns no_data / can't reach IPO range, fallback to Yahoo finance
 *      3) If we still can't reach the IPO range, return results + a note explaining
 * 
 * Primary data source:
 *    - Finnhub (profile2 + stock candles) 
 *      (YahooFinance >>>)    
 * 
 * Backup data source:
 *   - Yahoo Finance (via yahoo-finance2)
 *   - No longer using AlphaVantage (limited dates)
 * 
 * Current price data source:
 *   - used in stockPricesCurrent.ts
 *     mastra-stock-data.vercel.app
 *
 * Notes:
 *   - Different types of closes:
 *      Official close (auction close), most “true”
 *      Last traded price
 *      Adjusted close (after dividends/splits)
 */








/**
 * stockExtremes.ts
 * ------------------------
 * Tool: Stock price extremes (low/high) with data transparency
 *
 * Features:
 * - Computes lowest + highest price with dates
 * - Detects earliest & latest available data
 * - Compares IPO vs available data range
 * - Warns if "all-time" is NOT truly covered
 *
 * Data:
 * - Prices: Yahoo Finance (yahoo-finance2 v3)
 * - IPO: Finnhub (profile2 endpoint)
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";

// ✅ REQUIRED for yahoo-finance2 v3
const yahooFinance = new YahooFinance();

// --- Lightweight IPO fetch (Finnhub) ---
async function getIPODate(symbol: string): Promise<string | undefined> {
  try {
    const token = process.env.FINNHUB_KEY;
    if (!token) return undefined;

    const res = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${token}`
    );

    if (!res.ok) return undefined;

    const json = await res.json();
    return json?.ipo;
  } catch {
    return undefined;
  }
}

export const stockExtremes = createTool({
  id: "stock-extrema",
  description: "Get stock low/high with full data-range transparency",

  inputSchema: z.object({
    symbol: z.string(),
  }),

  outputSchema: z.object({
    symbol: z.string(),

    lowest: z.number(),
    lowestDate: z.string(),

    highest: z.number(),
    highestDate: z.string(),

    earliestAvailable: z.string(),
    latestAvailable: z.string(),

    ipoDate: z.string().optional(),
    note: z.string().optional(),
  }),

  // ✅ Mastra v1.5 signature (NO destructuring)
  execute: async (inputData) => {
    if (!inputData) throw new Error("Missing inputData");

    const { symbol } = inputData;

    // --- 1. IPO date (optional) ---
    const ipoDate = await getIPODate(symbol);

    // --- 2. Yahoo full history ---
    const chart = await yahooFinance.chart(symbol, {
      period1: "1900-01-01",
      interval: "1d",
    });

    const quotes = (chart as any)?.quotes ?? [];

    if (!Array.isArray(quotes) || quotes.length === 0) {
      throw new Error(`No historical data found for ${symbol}`);
    }

    let lowest = Infinity;
    let highest = -Infinity;

    let lowestDate = "";
    let highestDate = "";

    let earliestTs = Infinity;
    let latestTs = -Infinity;

    // --- 3. Process data ---
    for (const q of quotes) {
      if (!q?.date) continue;

      const ts = new Date(q.date).getTime();
      if (!Number.isFinite(ts)) continue;

      // Track range
      if (ts < earliestTs) earliestTs = ts;
      if (ts > latestTs) latestTs = ts;

      // Track extremes
      if (Number.isFinite(q.low) && q.low < lowest) {
        lowest = q.low;
        lowestDate = new Date(ts).toISOString().split("T")[0];
      }

      if (Number.isFinite(q.high) && q.high > highest) {
        highest = q.high;
        highestDate = new Date(ts).toISOString().split("T")[0];
      }
    }

    // --- 4. Validate ---
    if (!Number.isFinite(earliestTs) || !Number.isFinite(latestTs)) {
      throw new Error("Failed to determine data range");
    }

    if (!Number.isFinite(lowest) || !Number.isFinite(highest)) {
      throw new Error("Failed to compute extremes");
    }

    const earliest = new Date(earliestTs).toISOString().split("T")[0];
    const latest = new Date(latestTs).toISOString().split("T")[0];

    // --- 5. Honesty logic (clean + reliable) ---
    let note: string | undefined;

    const hasIncompleteHistory =
      ipoDate && new Date(earliest).getTime() > new Date(ipoDate).getTime();

    if (hasIncompleteHistory) {
      note =
        `⚠️ Incomplete history. IPO: ${ipoDate}. ` +
        `Data available: ${earliest} → ${latest}. ` +
        `Extremes reflect available range only.`;
    }

    return {
      symbol,
      lowest,
      lowestDate,
      highest,
      highestDate,
      earliestAvailable: earliest,
      latestAvailable: latest,
      ipoDate,
      note,
    };
  },
});