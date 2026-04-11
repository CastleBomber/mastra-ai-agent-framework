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
 *   - Analyze all-time low/high prices
 *   - Retrieve recent company news
 *
 * Memory:
 *   - Persists recent conversation context using LibSQL (last 50 messages)
 *   - Enables continuity across user interactions
 *
 * Instructions (system prompt):
 *   - Use memory for personalized answers
 *   - Format news as bulleted list with clickable titles and italic dates
 *   - For historical queries: report highest+date from ATH, lowest+date for ATL
 *   - Never swap or invent data
 * 
 * Tools:
 *   = stockPricesCurrent -> current closing price
 *   - stockPricesHistorical -> all-time low/high with dates
 *   = stockNews => recent headlines (14-day window, fallback to 90 days)
 * 
 * Built with Mastra v1.3.4 Agent API, OpenAI GPT-4o
 */

import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai"; 
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import * as stockPricesCurrentTools from "../tools/stockPricesCurrent";
import { stockNews } from "../tools/stockNews";
import * as stockPricesHistoricalTools from "../tools/stockPricesHistorical";

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

    When using stockPricesHistorical:
    - If the user asks for "highest", "all-time high", "ATH", or "peak", you MUST report highest + highestDate.
    - If the user asks for "lowest", "all-time low", "ATL", or "bottom", you MUST report lowest + lowestDate.
    - Never swap highest/lowest. If the tool output does not include the requested metric, say you cannot answer.`,

  tools: {
    stockPricesCurrent: stockPricesCurrentTools.stockPricesCurrent,
    stockPricesHistorical: stockPricesHistoricalTools.stockPricesHistorical,
    stockNews,
  },
});
