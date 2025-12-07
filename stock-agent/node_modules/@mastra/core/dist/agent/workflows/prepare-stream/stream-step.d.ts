import { z } from 'zod';
import type { MastraMemory } from '../../../memory/memory.js';
import type { MemoryConfig } from '../../../memory/types.js';
import { AISDKV5OutputStream, MastraModelOutput } from '../../../stream/index.js';
import type { OutputSchema } from '../../../stream/base/schema.js';
import type { SaveQueueManager } from '../../save-queue/index.js';
import type { AgentMethodType } from '../../types.js';
import type { AgentCapabilities } from './schema.js';
interface StreamStepOptions<FORMAT extends 'aisdk' | 'mastra' | undefined = undefined> {
    capabilities: AgentCapabilities;
    runId: string;
    returnScorerData?: boolean;
    /**
     * @deprecated When using format: 'aisdk', use the `@mastra/ai-sdk` package instead. See https://mastra.ai/en/docs/frameworks/agentic-uis/ai-sdk#streaming
     */
    format?: FORMAT;
    requireToolApproval?: boolean;
    resumeContext?: {
        resumeData: any;
        snapshot: any;
    };
    agentId: string;
    toolCallId?: string;
    methodType: AgentMethodType;
    saveQueueManager?: SaveQueueManager;
    memoryConfig?: MemoryConfig;
    memory?: MastraMemory;
    resourceId?: string;
}
export declare function createStreamStep<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'aisdk' | 'mastra' | undefined = undefined>({ capabilities, runId, returnScorerData, format, requireToolApproval, resumeContext, agentId, toolCallId, methodType, saveQueueManager, memoryConfig, memory, resourceId, }: StreamStepOptions<FORMAT>): import("../../..").Step<"stream-text-step", z.ZodObject<any, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>, z.ZodAny, z.ZodUnion<[z.ZodType<MastraModelOutput<OUTPUT | undefined>, z.ZodTypeDef, MastraModelOutput<OUTPUT | undefined>>, z.ZodType<AISDKV5OutputStream<OUTPUT | undefined>, z.ZodTypeDef, AISDKV5OutputStream<OUTPUT | undefined>>]>, z.ZodType<any, z.ZodTypeDef, any>, z.ZodType<any, z.ZodTypeDef, any>, import("../../..").DefaultEngineType>;
export {};
//# sourceMappingURL=stream-step.d.ts.map