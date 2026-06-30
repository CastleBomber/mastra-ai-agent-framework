/**
 * stockExtremes.ts
 * ------------------------
 * Tool: Historical stock prices (All-time Lows/Highs)
 *
 * Computes: 
 *   - Lowest trading price + date
 *   - Highest trading price + date
 *   - Available Yahoo price-history range
 *   - IPO-date warning when Yahoo data may be incomplete
 *   - Stock split context when split events exits
 *
 * Questons:
 *   - "What is the lowest price SPY?"
 *   - "What is the highest price ever of WPM?"
 *   - "What is the lowest ever price of GE?"  
 * 
 * Answers:
 *   - SPY (lowest): $43.94 January 29th, 1993 (IPO)
 *   - WPM (highest): $165.76 on March 2, 2026 (ongoing)
 *   - GE (lowest): (!) $2.71 on June 25, 1962 *Note: Warning, IPO 1892, *Note: Stock split
 *   - PG (lowest): (!) $0.88 on June 25, 1962 *Note: Warning, IPO 1892, *Note: Stock split
 * 
 * Insights:
 *   - *(!) Earliest Yahoo data available is around: 1962 (most common response:  June 25th, 1962)
 *   - 1962 “Kennedy Slide” / “Flash Crash of 1962”
 *   - Market decline of roughly 25–30% from its 1961 peak
 * 
 * Strategy (simple + honest):
 *   1) Fetch IPO date from Finnhub
 *   2) Fetch full historical daily data from Yahoo Finance
 *   3) Detect earliest & latest available Yahoo data points
 *   4) Compute best-known ATH / ATL from available daily highs/lows
 *   5) Detect stock splits from Yahoo chart events
 *   6) Add transparency notes for incomplete history and split-adjusted prices
 * 
 * Data sources:
 *    - Prices: Yahoo Finance (yahoo-finance2)
 *    - IPO date: Finnhub (profile2 endpoint)
 * 
 * Key behavior:
 *    - NEVER assumes "all-time" if data is incomplete
 *    - Returns best-known extremes + explicit limitation note
 *    - Mentions split-adjusted history when stoc splits exist
 *    - Agent decides how to present the note   
 *
 * Notes:
 *    - Uses daily low/high for ATH/ATL, not close
 *    - Yahoo historical prices are generally split-adjusted
 *    - Prices may differ slightly across providers (rounding/splits)
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// Stores readable split details so the tool can explain split-adjusted price history
type SplitInfo = {
  date: string;
  ratio: string;
  numerator: number;
  denominator: number;
  rawPriceEstimate?: number;
  adjustedPriceEstimate?: number;
};

// Finnhub IPO fetch used to detect whether Yahoo's price history starts after IPO
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
  id: "stock-extremes",
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

    hasSplits: z.boolean().optional(),
    splits: z.array(
      z.object({
        date: z.string(),
        ratio: z.string(),
        numerator: z.number(),
        denominator: z.number(),
        rawPriceEstimate: z.number().optional(),
        adjustedPriceEstimate: z.number().optional(),
      })
    ).optional(),

    note: z.string().optional(),
  }),

  execute: async (inputData) => {
    if (!inputData) throw new Error("Missing inputData");

    const symbol = inputData.symbol.trim().toUpperCase();

    // #1 - Fetch IPO date so we can warn when Yahoo history may be incomplete
    const ipoDate = await getIPODate(symbol);

    // #2 - Fetch Yahoo chart data, including daily prices and split events
    const chart = await yahooFinance.chart(symbol, {
      period1: "1900-01-01",
      interval: "1d",
      events: "split",
    });

    const quotes = (chart as any)?.quotes ?? [];

    // Yahoo chart events may include stock splits, dividends, and earnings
    const splitEvents = (chart as any)?.events?.splits ?? {};

    if (!Array.isArray(quotes) || quotes.length === 0) {
      throw new Error(`No historical data found for ${symbol}`);
    }

    let lowest = Infinity;
    let highest = -Infinity;

    let lowestDate = "";
    let highestDate = "";

    let earliestTs = Infinity;
    let latestTs = -Infinity;

    // #3 - Process daily quotes to find ATH, ATL, and available data range
    for (const q of quotes) {
      if (!q?.date) continue;

      const ts = new Date(q.date).getTime();
      if (!Number.isFinite(ts)) continue;

      // Track earliest/latest Yahoo data points
      if (ts < earliestTs) earliestTs = ts;
      if (ts > latestTs) latestTs = ts;

      // Track all-time low from daily low price
      if (Number.isFinite(q.low) && q.low < lowest) {
        lowest = q.low;
        lowestDate = new Date(ts).toISOString().split("T")[0];
      }

      // Track all-time high from daily high price
      if (Number.isFinite(q.high) && q.high > highest) {
        highest = q.high;
        highestDate = new Date(ts).toISOString().split("T")[0];
      }
    }

    // #4 - Convert Yahoo split events into readable split details for the final note
    const splits: SplitInfo[] = Object.values(splitEvents)
      .map((split: any) => {
        const splitDate = new Date(split.date).toISOString().split("T")[0];

        const numerator = Number(split.numerator);
        const denominator = Number(split.denominator);

        const splitFactor = numerator / denominator;

        // Find the most recent quote before the split date
        const previousQuote = [...quotes]
          .reverse()
          .find((q: any) => {
            if (!q?.date) return false;
            return new Date(q.date).getTime() < new Date(split.date).getTime();
          });

        const adjustedPriceEstimate =
          Number.isFinite(previousQuote?.close) ? previousQuote.close : undefined;

        const rawPriceEstimate =
          adjustedPriceEstimate && Number.isFinite(splitFactor)
            ? adjustedPriceEstimate * splitFactor
            : undefined;

        return {
          date: splitDate,
          ratio: `${numerator}:${denominator}`,
          numerator,
          denominator,
          rawPriceEstimate,
          adjustedPriceEstimate,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    const hasSplits = splits.length > 0;

    // #5 - Validate that Yahoo returned usable price history
    if (!Number.isFinite(earliestTs) || !Number.isFinite(latestTs)) {
      throw new Error("Failed to determine data range");
    }

    if (!Number.isFinite(lowest) || !Number.isFinite(highest)) {
      throw new Error("Failed to compute extremes");
    }

    const earliest = new Date(earliestTs).toISOString().split("T")[0];
    const latest = new Date(latestTs).toISOString().split("T")[0];

    // #6 - Build honesty notes for incomplete history and split-adjusted prices
    let noteParts: string[] = [];

    const hasIncompleteHistory =
      !ipoDate || new Date(earliest).getTime() > new Date(ipoDate).getTime();

    if (hasIncompleteHistory) {
      if (ipoDate) {
        noteParts.push(
          `⚠️ Warning: ${symbol}'s IPO date (${ipoDate}) is earlier than available data. ` +
          `Earliest data available: ${earliest}. `
        );
      } else {
        noteParts.push(
          `⚠️ Warning: ${symbol}'s IPO date is unavailable. ` +
          `Earliest data available: ${earliest}. `
        );
      }
    }

    if (hasSplits) {
      const latestSplit = splits[splits.length - 1];

      const priceDetail =
        latestSplit.rawPriceEstimate && latestSplit.adjustedPriceEstimate
          ? ` Around that split, the prior close is roughly represented as $${latestSplit.rawPriceEstimate.toFixed(
            2
          )} pre-split → $${latestSplit.adjustedPriceEstimate.toFixed(
            2
          )} split-adjusted.`
          : "";

      noteParts.push(
        `ℹ️ Split note: Historical prices are split-adjusted. ${symbol} had a ${latestSplit.ratio} stock split on ${latestSplit.date}.${priceDetail}`
      );
    }

    const note = noteParts.length > 0 ? noteParts.join(" ") : undefined;

    return {
      symbol,
      lowest,
      lowestDate,
      highest,
      highestDate,
      earliestAvailable: earliest,
      latestAvailable: latest,
      ipoDate,
      hasSplits,
      splits,
      note,
    };
  },
});





