/**
 * stockExtremes.ts
 * ------------------------
 * Tool: Historical stock prices (All-time Lows/Highs)
 *
 * Computes: 
 *   - Lowest trading price + date
 *   - Highest trading price + date
 *   - *Adds a note if IPO date is out of retrieved data range
 *
 * Answers:
 *   - What is the lowest price SPY?   $43.94 January 29th, 1993 (IPO)
 *   - What is the highest price ever of WPM?
 *   - What is the lowest ever price of GE?  (public since 1892) *Adds Note
 * 
 * Strategy (simple + honest):
 *   1) Fetch full historical daily data from Yahoo Fincance
 *   2) Detect earliest & latest available data points
 *   3) Fetch IPO date (Finnhub)
 *   4) If IPO < earliest available → attach warning note

 * Data sources:
 *    - Prices: Yahoo Finance (yahoo-finance2)
 *    - IPO date: Finnhub (profile2 endpoint)
 * 
 * Key behavior:
 *    - NEVER assumes "all-time" if data is incomplete
 *    - Returns best-known extremes + explicit limitation note
 *    - Agent decides how to present the note   
 *
 * Notes:
 *    - Uses daily low/high (not close)
 *    - Prices may differ slightly across providers (rounding/splits)
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// Finnhub IPO fetch
async function getIPODate(symbol: string): Promise<string | undefined> {
  try {
    const token = processDataStream.env.FINNHUB_KEY;
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
  id: "stock-extremes",
  description: "Get stock low/high with full data-range transparency"

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

  execute: async (inputData) => {
    if (!inputData) throw new Error("Missing inputData");

    const { symbol } = inputData;

    // #1 - IPO Daate
    const ipoDate = await getIPODate(symbol);

    // #2 - Yahoo full history
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
    let latestTs = - Infinity;

    // #3 - Process data
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

    // #4 - Validate
    if (!Number.isFinite(earliestTs) || !Number.isFinite(latestTs)) {
      throw new Error("Failed to determine data range");
    }

    if (!Number.isFinite(lowest) || !Number.isFinite(highest)) {
      throw new Error("Failed to compute extremes");
    }

    const earliest = new Date(earliestTs).toISOString().split("T")[0];
    const latest = new Date(latestTs).toISOString().split("T")[0];

    // #5 = Honesty logic
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





