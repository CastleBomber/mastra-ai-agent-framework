/**
 * index.ts
 * --------
 * Author: DeepSeek + ChatGPT CBOMBS
 * 
 * Entry point for the Mastra application
 *
 * Registers and wires together all agents, workflows, storage,
 * and observability for the Stocks-AI system
 *
 * Core components:
 *   - stockAgent: conversational stock analysis agent
 *   - stockWorkflow: structured multi-step stock analysis workflow
 * 
 * ============================================
 * NOTES: Composite Storage Setup
 * ============================================
 *
 * - LibSQLStore:
 *     Handles primary application data (memory, workflow state, etc.)
 *     Lightweight file-based storage ideal for local development.
 *
 * - DuckDB (Observability Store):
 *     Used for observability traces (spans, logs, metrics) in local dev.
 *     Fully supported by Mastra Studio.
 *     Stores traces in a local embedded analytical database.
 *
 * - Observability (Mastra class):
 *     Configures tracing and span exporting.
 *     DefaultExporter automatically selects the optimal strategy
 *     supported by the DuckDB observability adapter.
 *
 * - Composite Storage:
 *     Routes each data domain to the appropriate backend:
 *       memory/state → LibSQL
 *       observability → DuckDB
 *
 * Result:
 *   Clean local development setup with:
 *   - persistent memory
 *   - workflow state
 *   - full tracing in Mastra Studio
 *
 */

import "dotenv/config";
import { Mastra } from "@mastra/core";
import { MastraCompositeStore } from "@mastra/core/storage";
import { LibSQLStore } from "@mastra/libsql";
import { Observability, DefaultExporter, SensitiveDataFilter } from "@mastra/observability";
import { stockAgent } from "./agents/stockAgent";
import { stockWorkflow } from "./workflows/stockWorkflow";
import { DuckDBStore } from "@mastra/duckdb";

const compositeStorage = new MastraCompositeStore({
  id: "composite-storage",
  default: new LibSQLStore({
    id: "default-storage",
    url: "file:./mastra.db",
  }),
  domains: {
    observability: new DuckDBStore().observability,
  },
});

export const mastra = new Mastra({
  agents: { stockAgent },
  workflows: { stockWorkflow },
  storage: compositeStorage,
  observability: new Observability({
    configs: {
      default: {
        serviceName: "stocks-ai",
        exporters: [
          new DefaultExporter(),
        ],
        spanOutputProcessors: [new SensitiveDataFilter()],
      },
    },
  }),
});

