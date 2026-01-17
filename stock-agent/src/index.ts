/**
 * index.ts
 * --------
 * Author: CastleBomber
 * Project: Web-Pages-Unleashed
 * Date: November 26th, 2025
 * 
 * Entry point for the Mastra application.
 *
 * Registers and wires together all agents, workflows, and shared storage.
 * This file serves as the bootstrap layer that initializes the system
 * and exposes the configured Mastra instance.
 *
 * Core components:
 *   - stockAgent: conversational stock analysis agent
 *   - stockWorkflow: structured multi-step stock analysis workflow
 *   - LibSQLStore: persistent storage for memory and state
 *
 * Acknowledgements:
 *   - Mastra Course
 *   - ChatGPT
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

 