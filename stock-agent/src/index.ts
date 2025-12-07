/**
 * Author: CastleBomber
 * Project: Web-Pages-Unleashed
 * Date: November 26th, 2025
 * Acknowledgements: Mastra Course, ChatGPT
 * 
 */

import { Mastra } from "@mastra/core";
import { stockAgent } from "./agents/stockAgent";
import { stockWorkflow } from "./workflows/stockWorkflow"
import { LibSQLStore } from "@mastra/libsql";

export const mastra = new Mastra({
  agents: { stockAgent },
  workflows: { stockWorkflow },
  storage: new LibSQLStore({ url: "file:./mastra.db" }),
});

 