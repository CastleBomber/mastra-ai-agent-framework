import type { AISpan, AISpanType, TracingContext } from '../../../ai-tracing/index.js';
import type { SystemMessage } from '../../../llm/index.js';
import type { ModelLoopStreamArgs } from '../../../llm/model/model.loop.types.js';
import type { MastraMemory } from '../../../memory/memory.js';
import type { MemoryConfig } from '../../../memory/types.js';
import type { RuntimeContext } from '../../../runtime-context/index.js';
import type { OutputSchema } from '../../../stream/base/schema.js';
import type { InnerAgentExecutionOptions } from '../../agent.types.js';
import type { SaveQueueManager } from '../../save-queue/index.js';
import type { AgentCapabilities, PrepareMemoryStepOutput, PrepareToolsStepOutput } from './schema.js';
interface MapResultsStepOptions<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'aisdk' | 'mastra' | undefined = undefined> {
    capabilities: AgentCapabilities;
    options: InnerAgentExecutionOptions<OUTPUT, FORMAT>;
    resourceId?: string;
    runId: string;
    runtimeContext: RuntimeContext;
    memory?: MastraMemory;
    memoryConfig?: MemoryConfig;
    saveQueueManager: SaveQueueManager;
    agentAISpan: AISpan<AISpanType.AGENT_RUN>;
    instructions: SystemMessage;
    agentId: string;
}
export declare function createMapResultsStep<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'aisdk' | 'mastra' | undefined = undefined>({ capabilities, options, resourceId, runId, runtimeContext, memory, memoryConfig, saveQueueManager, agentAISpan, instructions, agentId, }: MapResultsStepOptions<OUTPUT, FORMAT>): ({ inputData, bail, tracingContext, }: {
    inputData: {
        "prepare-tools-step": PrepareToolsStepOutput;
        "prepare-memory-step": PrepareMemoryStepOutput;
    };
    bail: <T>(value: T) => T;
    tracingContext: TracingContext;
}) => Promise<import("../../../stream").MastraModelOutput<OUTPUT> | ModelLoopStreamArgs<any, OUTPUT>>;
export {};
//# sourceMappingURL=map-results-step.d.ts.map