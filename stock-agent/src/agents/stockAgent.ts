/**
 * stockAgent.ts
 * -------------
 * Agent: Stock Analysis Assistant
 * 
 * Author: DeepSeek + ChatGPT + CBombs
 *
 * Primary conversational agent responsible for answering
 * stock-related questions using real market data.
 *
 * Capabilities:
 *   - Fetch current stock prices
 *   - Analyze all-time low/high extreme prices
 *   - Retrieve historical prices for specific dates
 *   - Retrieve recent company news
 *
 * Memory:
 *   - Persists recent conversation context using LibSQL (last 50 messages)
 *   - Enables continuity across user interactions
 *
 * Instructions (system prompt):
 *   - Use memory for personalized answers
 *   - Format news as bulleted list with clickable titles and italic dates
 *   - For ATH/ATL extreme queries: report highest+date or lowest+date
 *   - For date-based queries: use tool data only (no estimation)
 *   - Never swap or invent data
 * 
 * Tools:
 *   - stockPriceCurrent -> current closing price
 *   - stockExtremes -> all-time low/high extremes with dates
 *   - stockPriceOnDate -> closing price for a specific date
 *   - stockNews => recent headlines (14-day window, fallback to 90 days)
 * 
 * Built with Mastra v1.4.x Agent API, OpenAI GPT-4o
 */

import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { stockPriceCurrent } from "../tools/stockPriceCurrent";
import { stockNews } from "../tools/stockNews";
import { stockPriceOnDate } from "../tools/stockPriceOnDate";
import { stockExtremes } from "../tools/stockExtremes";

// --- Memory Setup ---
const mem = new Memory({
  options: { lastMessages: 50 },
  storage: new LibSQLStore({
    id: "stock-agent-storage",
    url: "file:./mastra.db",
  }),
});

const today = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const stockAgent = new Agent({
  id: "stock-agent",
  name: "Stock Agent",
  model: 'openai/gpt-4o',
  memory: mem,

  instructions: `
    Today's date is ${today}. Use this as the current real-world date.

    You are a helpful assistant.

    Use remembered conversation context when helpful. Do not invent memory or facts.

    General rules:
    - Never guess prices, dates, or market data.
    - If a tool returns no data, say you cannot confirm the answer.
    - Keep responses clean and easy to read.
    - Use this date format for all final answers: Month Day, Year (example: January 1, 1967).

    When using stockPriceCurrent:
    - Report the latest available price.
    - Format: <Symbol>: $<price>
    - Round to 2 decimals.


    When using stockPriceOnDate:
    - If the user asks for a specific date, report the closing price for that date.
    - If the user asks for a year, use the first available trading day of that year.
    - If the market was closed or no data exists, explain that no trading price is available.
    - Format: <Symbol>: $<price> on <Month Day, Year>

    When using stockExtremes:
    - If the user asks for highest / ATH / peak, use highest + highestDate.
    - If the user asks for lowest / ATL / bottom, use lowest + lowestDate.
    - Format: <Symbol>: $<price> on <Month Day, Year>
    - Round to 2 decimals.
    - If multiple symbols, place each on its own line.

    If the tool includes a note:
    - Always include it after a blank line.
    - Format exactly:
      Note: <note>
    - Reformat any dates inside the note to Month Day, Year.
    - Do not ignore, rewrite, summarize, or remove the note.

    When using stockNews:
    - Use bullet points.
    - Make article titles clickable links.
    - On the next line, show the publish date in italics.
    - Format dates like: JAN 25th
    - Do not add summaries unless requested.
    - Do not add a separate "Read more" line.

    Be confident, helpful, and concise.
  `,

  tools: {
    stockPriceCurrent,
    stockExtremes,
    stockNews,
    stockPriceOnDate,
  },
});
