import type { OutputSchema } from '../stream/index.js';
import type { Agent } from './agent.js';
import type { AgentExecutionOptions } from './agent.types.js';
import type { MessageListInput } from './message-list/index.js';
export declare function tryGenerateWithJsonFallback<OUTPUT extends OutputSchema = undefined, FORMAT extends 'aisdk' | 'mastra' = 'mastra'>(agent: Agent, prompt: MessageListInput, options: AgentExecutionOptions<OUTPUT, FORMAT>): Promise<FORMAT extends "aisdk" ? {
    object?: NonNullable<Awaited<import("../stream/base/schema").InferSchemaOutput<OUTPUT>>> | undefined;
    text: string;
    usage: import("../stream/types").LanguageModelUsage;
    steps: import("./types").LLMStepResult[];
    finishReason: string | undefined;
    warnings: import("@ai-sdk/provider-v5").LanguageModelV2CallWarning[];
    providerMetadata: import("@ai-sdk/provider-v5").SharedV2ProviderMetadata | undefined;
    request: {
        body?: unknown;
    };
    reasoning: {
        providerMetadata: import("@ai-sdk/provider-v5").SharedV2ProviderMetadata | undefined;
        text: string;
        type: "reasoning";
    }[];
    reasoningText: string | undefined;
    toolCalls: import("../stream/aisdk/v5/transform").OutputChunkType<undefined>[];
    toolResults: import("../stream/aisdk/v5/transform").OutputChunkType<undefined>[];
    sources: import("../stream/aisdk/v5/transform").OutputChunkType<undefined>[];
    files: (import("ai-v5").Experimental_GeneratedImage | undefined)[];
    response: {
        [key: string]: unknown;
        headers?: Record<string, string>;
        messages?: import("ai-v5").StepResult<import("ai-v5").ToolSet>["response"]["messages"];
        uiMessages?: import("ai-v5").UIMessage<OUTPUT extends OutputSchema ? {
            structuredOutput?: import("../stream/base/schema").InferSchemaOutput<OUTPUT> | undefined;
        } & Record<string, unknown> : unknown, import("ai-v5").UIDataTypes, import("ai-v5").UITools>[] | undefined;
        id?: string;
        timestamp?: Date;
        modelId?: string;
    };
    content: ({
        type: "text";
        text: string;
        providerMetadata?: import("ai-v5").ProviderMetadata;
    } | import("ai-v5").ReasoningOutput | ({
        type: "source";
    } & import("@ai-sdk/provider-v5").LanguageModelV2Source) | {
        type: "file";
        file: import("ai-v5").Experimental_GeneratedImage;
        providerMetadata?: import("ai-v5").ProviderMetadata;
    } | ({
        type: "tool-call";
    } & (import("ai-v5").TypedToolCall<any> & {
        providerMetadata?: import("ai-v5").ProviderMetadata;
    })) | ({
        type: "tool-result";
    } & (import("ai-v5").TypedToolResult<any> & {
        providerMetadata?: import("ai-v5").ProviderMetadata;
    })) | ({
        type: "tool-error";
    } & (import("ai-v5").TypedToolError<any> & {
        providerMetadata?: import("ai-v5").ProviderMetadata;
    })))[];
    totalUsage: import("../stream/types").LanguageModelUsage;
    error: Error | undefined;
    tripwire: boolean;
    tripwireReason: string;
    traceId: string | undefined;
} : {
    traceId: string | undefined;
    scoringData?: {
        input: Omit<import("../scores").ScorerRunInputForAgent, "runId">;
        output: import("../scores").ScorerRunOutputForAgent;
    } | undefined;
    text: string;
    usage: import("../stream/types").LanguageModelUsage;
    steps: import("./types").LLMStepResult[];
    finishReason: string | undefined;
    warnings: import("@ai-sdk/provider-v5").LanguageModelV2CallWarning[];
    providerMetadata: import("@ai-sdk/provider-v5").SharedV2ProviderMetadata | undefined;
    request: {
        body?: unknown;
    };
    reasoning: import("../stream/types").ReasoningChunk[];
    reasoningText: string | undefined;
    toolCalls: import("../stream/types").ToolCallChunk[];
    toolResults: import("../stream/types").ToolResultChunk[];
    sources: import("../stream/types").SourceChunk[];
    files: import("../stream/types").FileChunk[];
    response: {
        [key: string]: unknown;
        headers?: Record<string, string>;
        messages?: import("ai-v5").StepResult<import("ai-v5").ToolSet>["response"]["messages"];
        uiMessages?: import("ai-v5").UIMessage<OUTPUT extends OutputSchema ? {
            structuredOutput?: import("../stream/base/schema").InferSchemaOutput<OUTPUT> | undefined;
        } & Record<string, unknown> : unknown, import("ai-v5").UIDataTypes, import("ai-v5").UITools>[] | undefined;
        id?: string;
        timestamp?: Date;
        modelId?: string;
    };
    totalUsage: import("../stream/types").LanguageModelUsage;
    object: Awaited<import("../stream/base/schema").InferSchemaOutput<OUTPUT>>;
    error: Error | undefined;
    tripwire: boolean;
    tripwireReason: string;
}>;
export declare function tryStreamWithJsonFallback<OUTPUT extends OutputSchema = undefined, FORMAT extends 'aisdk' | 'mastra' = 'mastra'>(agent: Agent, prompt: MessageListInput, options: AgentExecutionOptions<OUTPUT, FORMAT>): Promise<FORMAT extends "aisdk" ? import("../stream").AISDKV5OutputStream<OUTPUT> : import("../stream").MastraModelOutput<OUTPUT>>;
//# sourceMappingURL=utils.d.ts.map