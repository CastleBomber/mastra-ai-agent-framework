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
 *   - stockPricesCurrent -> current closing price
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
import * as stockPricesCurrentTools from "../tools/stockPricesCurrent";
import { stockNews } from "../tools/stockNews";
import { stockPriceOnDate } from "../tools/stockPriceOnDate";
import * as stockExtremesTools from "../tools/stockExtremes";

// --- Memory Setup ---
const mem = new Memory({
  options: { lastMessages: 50 },
  storage: new LibSQLStore({
    id: "stock-agent-storage",
    url: "file:./mastra.db",
  }),
});

export const stockAgent = new Agent({
  id: "stock-agent",
  name: "Stock Agent",
  model: 'openai/gpt-4o',
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

    When using stockPriceOnDate:
    - If the user asks for a price on a specific date (e.g., "Jan 1 2020", "2020-01-01"), you MUST report close + date.
    - If the user asks for a year (e.g., "price in 2020"), use the first available trading day of that year.
    - If no data exists for the requested date (weekend/holiday), explain that the market was closed and no price is available.
    - Never invent or estimate prices. If the tool returns null, say you cannot answer.

    When using stockExtremes:
    - If the user asks for "highest", "all-time high", "ATH", or "peak", report highest + highestDate.
    - If the user asks for "lowest", "all-time low", "ATL", or "bottom", report lowest + lowestDate.

    - Output MUST follow this EXACT format (no deviations):
    <Symbol>: $<price> on <Month Day, Year>

    - Price rules:
      - Round to 2 decimal places
      - Do NOT say "approximately"
      - Do NOT add extra words

    - Date format:
      - "January 1, 1967" (full month, no abbreviations)

    - If multiple symbols:
      - Put each on its own line

    - Note handling:
      - If "note" exists:
        - Add a blank line after results
        - Then print exactly:
          Note: <note>
        - Do NOT rephrase the note
        - Do NOT summarize the note
      
    - Never ignore the note field
    
    - Before printing ANY note, convert ALL dates inside the note (including IPO date, earliestAvailable, latestAvailable, or any ISO date strings) into the format: "Month Day, Year".
    - Treat all tool-provided strings as raw data; always reformat dates inside them before output.

    - If no note:
      - Do not include a note section

    - Do NOT add any extra commentary, explanations, or adjectives


  `,

  tools: {
    stockPricesCurrent: stockPricesCurrentTools.stockPricesCurrent,
    stockExtremes: stockExtremesTools.stockExtremes,
    stockNews,
    stockPriceOnDate,
  },
});
