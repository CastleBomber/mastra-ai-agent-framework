import type { Metric } from '../eval/index.js';
import type { ToolAction } from '../tools/index.js';
import type { AgentConfig } from './types.js';
import { Agent as BaseAgent } from './index.js';
/**
 * @deprecated Please import Agent from '@mastra/core/agent" instead of "@mastra/core'
 *
 * This import path has restricted types and may cause type errors with provider-defined tools.
 */
export declare class Agent<TAgentId extends string = string, TTools extends Record<string, ToolAction<any, any, any>> = Record<string, ToolAction<any, any, any>>, TMetrics extends Record<string, Metric> = Record<string, Metric>> extends BaseAgent<TAgentId, TTools, TMetrics> {
    constructor(config: AgentConfig<TAgentId, TTools, TMetrics>);
}
//# sourceMappingURL=index.warning.d.ts.map