/**
 * currentDateTime.ts
 * ------------------
 * Tool: Get current date and time (market-safe reference clock)
 *
 * Provides the current system date and time in a consistent format
 * using a fixed timezone (America/New_York) to ensure financial-market
 * alignment and eliminate server/client timezone inconsistencies.
 *
 * Answers questions like:
 *   - "What is today's date?"
 *   - "What time is it right now?"
 *   - "What day is it?"
 *
 * Behavior:
 *   1) Reads system clock via `new Date()`
 *   2) Formats date using America/New_York timezone
 *   3) Formats time in 12-hour format with seconds precision
 *   4) Returns both values as structured output
 *
 * Data source:
 *   System runtime clock (Node.js / server environment)
 *
 * Notes:
 *   - Uses America/New_York to align with U.S. market conventions
 *   - Prevents inconsistent timezone outputs across deployments
 *   - Intended as a deterministic "truth source" for time-based agent queries
 */

import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const currentDateTime = createTool({
  id: "current-date-time",
  description: "Returns the current date and time",

  inputSchema: z.object({}),

  outputSchema: z.object({
    date: z.string(),
    time: z.string(),
  }),

  execute: async () => {
    const now = new Date();

    return {
      date: now.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  },
});