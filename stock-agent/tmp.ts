/**
 * index.ts
 * --------
 * Author: DeepSeek + ChatGPT + CBOMBS
 *
 * Entry point for the Mastra application.
 *
 * Registers and wires together all agents, workflows, storage,
 * and observability for the Stocks AI system.
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
 */