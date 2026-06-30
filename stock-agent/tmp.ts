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
 *   - Stock split context when split events exist
 *
 * Questions:
 *   - "What is the lowest price SPY?"
 *   - "What is the highest price ever of WPM?"
 *   - "What is the lowest ever price of GE?"
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
 *    - Prices + splits: Yahoo Finance (yahoo-finance2)
 *    - IPO date: Finnhub (profile2 endpoint)
 *
 * Key behavior:
 *    - NEVER assumes "all-time" if data is incomplete
 *    - Returns best-known extremes + explicit limitation note
 *    - Mentions split-adjusted history when stock splits exist
 *    - Agent decides how to present the note
 *
 * Notes:
 *    - Uses daily low/high for ATH/ATL, not close
 *    - Yahoo historical prices are generally split-adjusted
 *    - Prices may differ slightly across providers because of rounding/split adjustments
 */