import z from 'zod';
import type { AgentExecutionOptions } from '../../agent/index.js';
import type { MultiPrimitiveExecutionOptions } from '../../agent/agent.types.js';
import { Agent } from '../../agent/index.js';
import type { MessageListInput } from '../../agent/message-list/index.js';
import type { TracingContext } from '../../ai-tracing/types.js';
import type { RuntimeContext } from '../../runtime-context/index.js';
import type { OutputSchema } from '../../stream/index.js';
import { MastraAgentNetworkStream } from '../../stream/MastraAgentNetworkStream.js';
export declare function getLastMessage(messages: MessageListInput): string;
export declare function prepareMemoryStep({ threadId, resourceId, messages, routingAgent, runtimeContext, generateId, tracingContext, memoryConfig, }: {
    threadId: string;
    resourceId: string;
    messages: MessageListInput;
    routingAgent: Agent;
    runtimeContext: RuntimeContext;
    generateId: () => string;
    tracingContext?: TracingContext;
    memoryConfig?: any;
}): Promise<{
    thread: import("../..").StorageThreadType | undefined;
}>;
export declare function createNetworkLoop({ networkName, runtimeContext, runId, agent, generateId, routingAgentOptions, }: {
    networkName: string;
    runtimeContext: RuntimeContext;
    runId: string;
    agent: Agent;
    routingAgentOptions?: Pick<MultiPrimitiveExecutionOptions, 'telemetry' | 'modelSettings'>;
    generateId: () => string;
}): Promise<{
    networkWorkflow: import("../../workflows").Workflow<import("../..").DefaultEngineType, import("../..").Step<string, any, any, any, any, any, import("../..").DefaultEngineType>[], "Agent-Network-Outer-Workflow", z.ZodObject<any, z.UnknownKeysParam, z.ZodTypeAny, {
        [x: string]: any;
    }, {
        [x: string]: any;
    }>, z.ZodObject<{
        task: z.ZodString;
        primitiveId: z.ZodString;
        primitiveType: z.ZodEnum<["agent", "workflow", "none", "tool"]>;
        result: z.ZodOptional<z.ZodString>;
        iteration: z.ZodNumber;
        threadId: z.ZodOptional<z.ZodString>;
        threadResourceId: z.ZodOptional<z.ZodString>;
        isOneOff: z.ZodBoolean;
        verboseIntrospection: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        iteration: number;
        task: string;
        primitiveId: string;
        primitiveType: "none" | "tool" | "workflow" | "agent";
        isOneOff: boolean;
        verboseIntrospection: boolean;
        threadId?: string | undefined;
        result?: string | undefined;
        threadResourceId?: string | undefined;
    }, {
        iteration: number;
        task: string;
        primitiveId: string;
        primitiveType: "none" | "tool" | "workflow" | "agent";
        isOneOff: boolean;
        verboseIntrospection: boolean;
        threadId?: string | undefined;
        result?: string | undefined;
        threadResourceId?: string | undefined;
    }>, z.ZodObject<{
        task: z.ZodString;
        primitiveId: z.ZodString;
        primitiveType: z.ZodEnum<["agent", "workflow", "none", "tool"]>;
        prompt: z.ZodString;
        result: z.ZodString;
        isComplete: z.ZodOptional<z.ZodBoolean>;
        completionReason: z.ZodOptional<z.ZodString>;
        iteration: z.ZodNumber;
        threadId: z.ZodOptional<z.ZodString>;
        threadResourceId: z.ZodOptional<z.ZodString>;
        isOneOff: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        result: string;
        prompt: string;
        iteration: number;
        task: string;
        primitiveId: string;
        primitiveType: "none" | "tool" | "workflow" | "agent";
        isOneOff: boolean;
        threadId?: string | undefined;
        threadResourceId?: string | undefined;
        isComplete?: boolean | undefined;
        completionReason?: string | undefined;
    }, {
        result: string;
        prompt: string;
        iteration: number;
        task: string;
        primitiveId: string;
        primitiveType: "none" | "tool" | "workflow" | "agent";
        isOneOff: boolean;
        threadId?: string | undefined;
        threadResourceId?: string | undefined;
        isComplete?: boolean | undefined;
        completionReason?: string | undefined;
    }>, z.ZodObject<{
        task: z.ZodString;
        primitiveId: z.ZodString;
        primitiveType: z.ZodEnum<["agent", "workflow", "none", "tool"]>;
        result: z.ZodOptional<z.ZodString>;
        iteration: z.ZodNumber;
        threadId: z.ZodOptional<z.ZodString>;
        threadResourceId: z.ZodOptional<z.ZodString>;
        isOneOff: z.ZodBoolean;
        verboseIntrospection: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        iteration: number;
        task: string;
        primitiveId: string;
        primitiveType: "none" | "tool" | "workflow" | "agent";
        isOneOff: boolean;
        verboseIntrospection: boolean;
        threadId?: string | undefined;
        result?: string | undefined;
        threadResourceId?: string | undefined;
    }, {
        iteration: number;
        task: string;
        primitiveId: string;
        primitiveType: "none" | "tool" | "workflow" | "agent";
        isOneOff: boolean;
        verboseIntrospection: boolean;
        threadId?: string | undefined;
        result?: string | undefined;
        threadResourceId?: string | undefined;
    }>>;
}>;
export declare function networkLoop<OUTPUT extends OutputSchema = undefined, FORMAT extends 'aisdk' | 'mastra' | undefined = undefined>({ networkName, runtimeContext, runId, routingAgent, routingAgentOptions, generateId, maxIterations, threadId, resourceId, messages, }: {
    networkName: string;
    runtimeContext: RuntimeContext;
    runId: string;
    routingAgent: Agent;
    routingAgentOptions?: AgentExecutionOptions<OUTPUT, FORMAT>;
    generateId: () => string;
    maxIterations: number;
    threadId?: string;
    resourceId?: string;
    messages: MessageListInput;
}): Promise<MastraAgentNetworkStream>;
//# sourceMappingURL=index.d.ts.map