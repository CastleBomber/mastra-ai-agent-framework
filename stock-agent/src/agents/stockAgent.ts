import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import * as tools from "../tools/stockPrices";
import { stockNews } from "../tools/stockNews";
import { stockPricesHistorical } from "../tools/stockPricesHistorical";

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
`,

  tools: {
    stockPrices: tools.stockPrices,
    stockNews,
    stockPricesHistorical
  },
});
