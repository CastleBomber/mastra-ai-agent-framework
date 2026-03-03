/**
 * stockPricesHistorical.ts
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
 * 
 * Strategy (robust + honest):
 *      1) Use Finnhub to fetch candles back to IPO date (via profile2.ipo)
 *      2) If Finnhub returns no_data / can't reach IPO range, fallback to Yahoo finance
 *      3) If we still can't reach the IPO range, return results + a note explaining
 * 
 * Primary data source:
 *      Finnhub (profile2 + stock candles)
 * 
 * Backup data source:
 *      Yahoo Finance (via yahoo-finance2)
 *      No longer using AlphaVantage (limited dates)
 *
 * Notes:
 *   - profile2: currently supported Finnhub API endpoint
 *   - Designed to be extended with averages, indicators, etc.
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import YahooFinance from "yahoo-finance2";

type FinnhubProfile2 = {
    ipo?: string; // "1980-12-12"
};

type FinnhubCandle = {
    s: "ok" | "no_data";
    t?: number[]; // unix seconds
    h?: number[];
    l?: number[];
};

const yahooFinance = new YahooFinance();
const toUnix = (date: Date) => Math.floor(date.getTime() / 1000);
const isoDay = (unixSeconds: number) =>
    new Date(unixSeconds * 1000).toISOString().split("T")[0];

async function fetchJson<T>(url: string, timeoutMs = 12_000): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const r = await fetch(url, { signal: controller.signal });
        if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
        return (await r.json()) as T;
    } finally {
        clearTimeout(timer);
    }
}

async function finnhubProfile2(symbol: string): Promise<FinnhubProfile2> {
    const token = process.env.FINNHUB_KEY;
    if (!token) throw new Error("Missing FINNHUB_KEY in environment");

    const url =
        `https://finnhub.io/api/v1/stock/profile2` +
        `?symbol=${encodeURIComponent(symbol)}` +
        `&token=${encodeURIComponent(token)}`;

    return fetchJson<FinnhubProfile2>(url);
}

export function finnhubCandlesDaily(symbol: string, fromUnix: number, toUnix: number): Promise<FinnhubCandle> {
    const token = process.env.FINNHUB_KEY;
    if (!token) throw new Error("Missing FINNHUB_KEY in enviroment");

    const url =
        `https://finnhub.io/api/v1/stock/candle` +
        `?symbol=${encodeURIComponent(symbol)}` +
        `&resolution=D` +
        `&from=${fromUnix}` +
        `&to=${toUnix}` +
        `&token=${encodeURIComponent(token)}`;

    return fetchJson<FinnhubCandle>(url);
}

function computeLowHighFromArrays(t: number[], lows: number[], highs: number[]) {
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
        earliestDate: isoDay(Math.min(...t)),
    };
}

async function yahooLowHigh(symbol: string) {
    // Pull max available daily Yahoo will provide
    const chart = await yahooFinance.chart(symbol, {
        period1: "1900-01-01",
        interval: "1d",
    });

    // HARD GAURD: chart must exist and be an object
    if (!chart || typeof chart !== "object") {
        throw new Error(`Yahoo fallback returned invalid chart object for ${symbol}`);
    }

    const rawQuotes = (chart as any).quotes;

    // 🔒 HARD GUARD: quotes must be a real array
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

    if (
        !Number.isFinite(lowest) ||
        !Number.isFinite(highest) ||
        !lowestDate ||
        !highestDate
    ) {
        throw new Error(`Yahoo fallback couldn't compute low/high for ${symbol}`);
    }

    return { lowest, lowestDate, highest, highestDate };
}

export const stockPricesHistorical = createTool({
    id: "stock-prices-historical",
    description:
        "Historical all-time low/high using Finnhub (with Yahoo fallback) +  returns dates and notes if range is limited",

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
        earliestAvailable: z.string().optional(), // earliest date we actually received from the source
        ipoDate: z.string().optional(),
    }),

    execute: async ( inputData, context ) => {
        const { symbol } = inputData;
        console.log("Tool inputData:", inputData);
        console.log("Tool context", context);

        if (!symbol) {
            throw new Error(`Symbol is required but was not provided in the arguments. Received args: ${JSON.stringify(args)}`);
        }

        // 1) Determine IPO date (so "all-time" means "since IPO")
        let ipoDate: string | undefined;
        try {
            const p = await finnhubProfile2(symbol);
            if (p?.ipo) ipoDate = p.ipo;
        } catch {
            // If profile fails, "whatever", we can still try candels - just won't know IPO
        }

        const now = new Date();
        const to = toUnix(now);

        // If we have IPO date, go from IPO -> now. Otherwise, use a very old date.
        const fromDate = ipoDate ? new Date(`${ipoDate}T00:00:00Z`) : new Date("1980-01-01T00:00:00Z");
        const from = toUnix(fromDate);

        // 2) Try Finnhub candles
        try {
            const candle = await finnhubCandlesDaily(symbol, from, to);

            if (!candle || typeof candle !== "object") {
                throw new Error("Finnhub candle response missing");
            }

            if (
                candle.s !== "ok" ||
                !Array.isArray(candle.t) ||
                !Array.isArray(candle.l) ||
                !Array.isArray(candle.h) ||
                candle.t.length === 0
            ) {
                throw new Error("Finnhub returned no_data / missing arrays");
            }

            const computed = computeLowHighFromArrays(candle.t, candle.l, candle.h);

            // If Finnhub earliest is later than IPO, be honest in a note
            let note: string | undefined;
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
                ipoDate,
            };
        } catch (err) {
            // 3) Fallback to Yahoo (best-effort), 🔒 try safely
            let y;
            try {
                y = await yahooLowHigh(symbol);
            } catch (yErr: any) {
                throw new Error(
                    `Both Finnhub and Yahoo failed for ${symbol}. ` +
                    `Finnhub error: ${(err as any)?.message ?? "unknown"} | ` +
                    `Yahoo error: ${yErr?.message ?? "unknown"}`
                );
            }

            const note =
                `Finnhub could not return a full historidal range for ${symbol}. ` +
                `Used Yahoo Finance fallback; results reflect Yahoo's available range.`;

            return {
                symbol,
                ...y,
                source: "yahoo",
                note,
                ipoDate,
            };
        }
    },
});



