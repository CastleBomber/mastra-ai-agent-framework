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
    - Present headlines with title, date, and URL only.
    - Do NOT include summaries unless the user explicitly asks for a summary, explanation, or paragraph.
    - If the user asks for more detail about a specific article, you may then use the stored summary.
`,

  tools: {
    stockPricesCurrent: stockPricesCurrentTools.stockPricesCurrent,
    stockPricesHistorical: stockPricesHistoricalTools.stockPricesHistorical,
    stockNews,
  },
});
