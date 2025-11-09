import type { LanguageModelV2, LanguageModelV2Prompt, SharedV2ProviderOptions } from '@ai-sdk/provider-v5';
import type { Span } from '@opentelemetry/api';
import type { CallSettings, TelemetrySettings, ToolChoice, ToolSet } from 'ai-v5';
import type { StructuredOutputOptions } from '../../../agent/types.js';
import type { OutputSchema } from '../../base/schema.js';
import type { OnResult } from '../../types.js';
type ExecutionProps<OUTPUT extends OutputSchema = undefined> = {
    runId: string;
    model: LanguageModelV2;
    providerOptions?: SharedV2ProviderOptions;
    inputMessages: LanguageModelV2Prompt;
    tools?: ToolSet;
    toolChoice?: ToolChoice<ToolSet>;
    options?: {
        activeTools?: string[];
        abortSignal?: AbortSignal;
    };
    modelStreamSpan: Span;
    telemetry_settings?: TelemetrySettings;
    includeRawChunks?: boolean;
    modelSettings?: Omit<CallSettings, 'abortSignal'> & {
        /**
         * @deprecated Use top-level `abortSignal` instead.
         */
        abortSignal?: AbortSignal;
    };
    onResult: OnResult;
    structuredOutput?: StructuredOutputOptions<OUTPUT>;
    /**
    Additional HTTP headers to be sent with the request.
    Only applicable for HTTP-based providers.
    */
    headers?: Record<string, string | undefined>;
    shouldThrowError?: boolean;
};
export declare function execute<OUTPUT extends OutputSchema = undefined>({ runId, model, providerOptions, inputMessages, tools, toolChoice, options, onResult, modelStreamSpan, telemetry_settings, includeRawChunks, modelSettings, structuredOutput, headers, shouldThrowError, }: ExecutionProps<OUTPUT>): ReadableStream<import("../..").ChunkType>;
export {};
//# sourceMappingURL=execute.d.ts.map