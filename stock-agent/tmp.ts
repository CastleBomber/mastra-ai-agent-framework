/**
 * stockExtremes.ts
 * ----------------
 * Tool: Stock Extremes (Low / High) with Data Coverage Awareness
 *
 * Purpose:
 *   Returns lowest + highest price WITH full transparency about
 *   available historical data vs IPO date.
 *
 * Key Behavior:
 *   - Uses Yahoo Finance for full historical range
 *   - Uses Finnhub ONLY for IPO date (optional)
 *   - Detects if dataset does NOT reach IPO
 *   - Warns user when “all-time” is NOT truly all-time
 *
 * Output includes:
 *   - lowest / highest + dates
 *   - earliestAvailable / latestAvailable
 *   - ipoDate (if available)
 *   - note (if history is incomplete)
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

// --- Finnhub IPO fetch (lightweight only) ---
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

  execute: async ({ inputData }) => {
    if (!inputData) throw new Error("Missing inputData");

    const { symbol } = inputData;

    // 1. IPO date (optional)
    const ipoDate = await getIPODate(symbol);

    // 2. Fetch full Yahoo history
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

    for (const q of quotes) {
      if (!q?.date) continue;

      const ts = new Date(q.date).getTime();
      if (!Number.isFinite(ts)) continue;

      // Track true earliest/latest (robust)
      if (ts < earliestTs) earliestTs = ts;
      if (ts > latestTs) latestTs = ts;

      // Low
      if (Number.isFinite(q.low) && q.low < lowest) {
        lowest = q.low;
        lowestDate = new Date(ts).toISOString().split("T")[0];
      }

      // High
      if (Number.isFinite(q.high) && q.high > highest) {
        highest = q.high;
        highestDate = new Date(ts).toISOString().split("T")[0];
      }
    }

    // Convert timestamps → ISO
    const earliest = new Date(earliestTs).toISOString().split("T")[0];
    const latest = new Date(latestTs).toISOString().split("T")[0];

    // 3. Honesty logic (IPO vs available data)
    let note: string | undefined;

    if (ipoDate) {
      const ipoTs = new Date(ipoDate).getTime();

      if (Number.isFinite(ipoTs) && earliestTs > ipoTs) {
        note =
          `Full history not available. IPO was ${ipoDate}, ` +
          `but data only exists from ${earliest} to ${latest}. ` +
          `Values reflect available range, not true all-time.`;
      }
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