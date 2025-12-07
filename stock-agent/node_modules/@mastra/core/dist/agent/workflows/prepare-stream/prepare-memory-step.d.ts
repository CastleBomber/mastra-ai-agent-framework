import { z } from 'zod';
import type { AISpan, AISpanType } from '../../../ai-tracing/index.js';
import type { SystemMessage } from '../../../llm/index.js';
import type { MastraMemory } from '../../../memory/memory.js';
import type { MemoryConfig, StorageThreadType } from '../../../memory/types.js';
import type { RuntimeContext } from '../../../runtime-context/index.js';
import type { OutputSchema } from '../../../stream/base/schema.js';
import type { InnerAgentExecutionOptions } from '../../agent.types.js';
import { MessageList } from '../../message-list/index.js';
import type { AgentMethodType } from '../../types.js';
import type { AgentCapabilities } from './schema.js';
interface PrepareMemoryStepOptions<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'aisdk' | 'mastra' | undefined = undefined> {
    capabilities: AgentCapabilities;
    options: InnerAgentExecutionOptions<OUTPUT, FORMAT>;
    threadFromArgs?: (Partial<StorageThreadType> & {
        id: string;
    }) | undefined;
    resourceId?: string;
    runId: string;
    runtimeContext: RuntimeContext;
    agentAISpan: AISpan<AISpanType.AGENT_RUN>;
    methodType: AgentMethodType;
    /**
     * @deprecated When using format: 'aisdk', use the `@mastra/ai-sdk` package instead. See https://mastra.ai/en/docs/frameworks/agentic-uis/ai-sdk#streaming
     */
    format?: FORMAT;
    instructions: SystemMessage;
    memoryConfig?: MemoryConfig;
    memory?: MastraMemory;
}
export declare function createPrepareMemoryStep<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'aisdk' | 'mastra' | undefined = undefined>({ capabilities, options, threadFromArgs, resourceId, runId, runtimeContext, instructions, memoryConfig, memory, }: PrepareMemoryStepOptions<OUTPUT, FORMAT>): import("../../..").Step<"prepare-memory-step", z.ZodObject<any, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
    threadExists: z.ZodBoolean;
    thread: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        resourceId: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        resourceId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title?: string | undefined;
        metadata?: Record<string, any> | undefined;
    }, {
        resourceId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title?: string | undefined;
        metadata?: Record<string, any> | undefined;
    }>>;
    messageList: z.ZodType<MessageList, z.ZodTypeDef, MessageList>;
    tripwire: z.ZodOptional<z.ZodBoolean>;
    tripwireReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    messageList: MessageList;
    threadExists: boolean;
    thread?: {
        resourceId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title?: string | undefined;
        metadata?: Record<string, any> | undefined;
    } | undefined;
    tripwireReason?: string | undefined;
    tripwire?: boolean | undefined;
}, {
    messageList: MessageList;
    threadExists: boolean;
    thread?: {
        resourceId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title?: string | undefined;
        metadata?: Record<string, any> | undefined;
    } | undefined;
    tripwireReason?: string | undefined;
    tripwire?: boolean | undefined;
}>, z.ZodType<any, z.ZodTypeDef, any>, z.ZodType<any, z.ZodTypeDef, any>, import("../../..").DefaultEngineType>;
export {};
//# sourceMappingURL=prepare-memory-step.d.ts.map