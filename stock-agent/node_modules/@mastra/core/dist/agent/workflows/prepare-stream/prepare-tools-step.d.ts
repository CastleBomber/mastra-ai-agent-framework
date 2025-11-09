import { z } from 'zod';
import type { AISpan, AISpanType } from '../../../ai-tracing/index.js';
import type { MastraMemory } from '../../../memory/memory.js';
import type { StorageThreadType } from '../../../memory/types.js';
import type { RuntimeContext } from '../../../runtime-context/index.js';
import type { OutputSchema } from '../../../stream/base/schema.js';
import type { InnerAgentExecutionOptions } from '../../agent.types.js';
import type { AgentCapabilities } from './schema.js';
interface PrepareToolsStepOptions<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'aisdk' | 'mastra' | undefined = undefined> {
    capabilities: AgentCapabilities;
    options: InnerAgentExecutionOptions<OUTPUT, FORMAT>;
    threadFromArgs?: (Partial<StorageThreadType> & {
        id: string;
    }) | undefined;
    resourceId?: string;
    runId: string;
    runtimeContext: RuntimeContext;
    agentAISpan: AISpan<AISpanType.AGENT_RUN>;
    methodType: 'generate' | 'stream' | 'generateLegacy' | 'streamLegacy';
    memory?: MastraMemory;
}
export declare function createPrepareToolsStep<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'aisdk' | 'mastra' | undefined = undefined>({ capabilities, options, threadFromArgs, resourceId, runId, runtimeContext, agentAISpan, methodType, memory, }: PrepareToolsStepOptions<OUTPUT, FORMAT>): import("../../..").Step<"prepare-tools-step", z.ZodObject<any, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>, z.ZodObject<{
    convertedTools: z.ZodRecord<z.ZodString, z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        parameters: z.ZodUnion<[z.ZodRecord<z.ZodString, z.ZodAny>, z.ZodAny]>;
        outputSchema: z.ZodOptional<z.ZodUnion<[z.ZodRecord<z.ZodString, z.ZodAny>, z.ZodAny]>>;
        execute: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodAny, z.ZodAny], null>, z.ZodPromise<z.ZodAny>>>;
        type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"function">, z.ZodLiteral<"provider-defined">, z.ZodUndefined]>>;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        execute?: ((args_0: any, args_1: any) => Promise<any>) | undefined;
        outputSchema?: any;
        type?: "function" | "provider-defined" | undefined;
        id?: string | undefined;
        description?: string | undefined;
        args?: Record<string, any> | undefined;
        parameters?: any;
    }, {
        execute?: ((args_0: any, args_1: any) => Promise<any>) | undefined;
        outputSchema?: any;
        type?: "function" | "provider-defined" | undefined;
        id?: string | undefined;
        description?: string | undefined;
        args?: Record<string, any> | undefined;
        parameters?: any;
    }>>;
}, "strip", z.ZodTypeAny, {
    convertedTools: Record<string, {
        execute?: ((args_0: any, args_1: any) => Promise<any>) | undefined;
        outputSchema?: any;
        type?: "function" | "provider-defined" | undefined;
        id?: string | undefined;
        description?: string | undefined;
        args?: Record<string, any> | undefined;
        parameters?: any;
    }>;
}, {
    convertedTools: Record<string, {
        execute?: ((args_0: any, args_1: any) => Promise<any>) | undefined;
        outputSchema?: any;
        type?: "function" | "provider-defined" | undefined;
        id?: string | undefined;
        description?: string | undefined;
        args?: Record<string, any> | undefined;
        parameters?: any;
    }>;
}>, z.ZodType<any, z.ZodTypeDef, any>, z.ZodType<any, z.ZodTypeDef, any>, import("../../..").DefaultEngineType>;
export {};
//# sourceMappingURL=prepare-tools-step.d.ts.map