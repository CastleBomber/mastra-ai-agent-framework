/**
 * stockAgent.ts
 * -------------
 * Agent: Stock Analysis Assistant
 *
 * Primary conversational agent responsible for answering
 * stock-related questions using real market data.
 *
 * Capabilities:
 *   - Fetch current stock prices
 *   - Analyze historical price data (ex: lowest price)
 *   - Retrieve recent company news
 *
 * Memory:
 *   - Persists recent conversation context using LibSQL
 *   - Enables continuity across user interactions
 *
 * Designed to work alongside workflows and tools to provide
 * accurate, data-driven financial responses.
 */

import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import * as stockPricesCurrentTools from "../tools/stockPricesCurrent";
import { stockNews } from "../tools/stockNews";
import * as stockPricesHistoricalTools from "../tools/stockPricesHistorical";

// --- Memory Setup ---
const mem = new Memory({
  options: { lastMessages: 50 },
  storage: new LibSQLStore({ url: "file:./mastra.db" }),
});

export const stockAgent = new Agent({
  name: "Stock Agent",
  model: "openai/gpt-4o-mini",
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

    When using stockPricesHistorical:
    - If the user asks for "highest", "all-time high", "ATH", or "peak", you MUST report highest + highestDate.
    - If the user asks for "lowest", "all-time low", "ATL", or "bottom", you MUST report lowest + lowestDate.
    - Never swap highest/lowest. If the tool output does not include the requested metric, say you cannot answer.


    When using stockPricesHistorical:
    - If the user asks for "highest", "all-time high", "ATH", or "peak", you MUST report highest + highestDate.

`,

  tools: {
    stockPricesCurrent: stockPricesCurrentTools.stockPricesCurrent,
    stockPricesHistorical: stockPricesHistoricalTools.stockPricesHistorical,
    stockNews,
  },
});
