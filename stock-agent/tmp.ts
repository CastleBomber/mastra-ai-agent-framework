// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

// Finnhub company profile response, containing IPO date if available.
type FinnhubProfile2 = {
    ipo?: string; // "1980-12-12"
};

// Finnhub candle (OHLC) response for a given symbol and date range.
// 's' indicates success status, arrays hold parallel time/price data.
type FinnhubCandle = {
    s: "ok" | "no_data";
    t?: number[]; // unix seconds
    h?: number[];
    l?: number[];
};

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

// Converts a Date object to Unix timestamp (seconds).
const toUnix = (date: Date) => Math.floor(date.getTime() / 1000);

// Formats a Unix timestamp (seconds) as YYYY-MM-DD.
const isoDay = (unixSeconds: number) =>
    new Date(unixSeconds * 1000).toISOString().split("T")[0];

// Generic fetch wrapper with timeout and error handling.
async function fetchJson<T>(url: string, timeoutMs = 12_000): Promise<T> {
    // ...implementation...
}

// Fetches company profile (including IPO date) from Finnhub.
async function finnhubProfile2(symbol: string): Promise<FinnhubProfile2> {
    // ...implementation...
}

// Fetches daily candlestick data from Finnhub for the given date range.
export function finnhubCandlesDaily(symbol: string, fromUnix: number, toUnix: number): Promise<FinnhubCandle> {
    // ...implementation...
}

// Computes all‑time low/high and their dates from parallel candle arrays.
function computeLowHighFromArrays(t: number[], lows: number[], highs: number[]) {
    // ...implementation...
}

// Fallback: fetch all‑time low/high from Yahoo Finance.
async function yahooLowHigh(symbol: string) {
    // ...implementation...
}

// ----------------------------------------------------------------------
// Main Tool Definition
// ----------------------------------------------------------------------

export const stockPricesHistorical = createTool({
    // ...configuration...
    execute: async ( inputData, context ) => {
        // ...implementation...
    },
});