import type { CoreMessage, LanguageModel } from 'ai';
import type { JSONSchema7 } from 'json-schema';
import type { ZodSchema } from 'zod';
import type { MastraPrimitives } from '../../action/index.js';
import { MastraBase } from '../../base.js';
import type { Mastra } from '../../mastra/index.js';
import type { GenerateObjectWithMessagesArgs, GenerateTextResult, GenerateObjectResult, GenerateTextWithMessagesArgs, ToolSet, GenerateReturn, StreamTextWithMessagesArgs, StreamTextResult, StreamObjectWithMessagesArgs, StreamObjectResult, StreamReturn } from './base.types.js';
import type { MastraModelOptions } from './shared.types.js';
export declare class MastraLLMV1 extends MastraBase {
    #private;
    constructor({ model, mastra, options }: {
        model: LanguageModel;
        mastra?: Mastra;
        options?: MastraModelOptions;
    });
    __registerPrimitives(p: MastraPrimitives): void;
    __registerMastra(p: Mastra): void;
    getProvider(): string;
    getModelId(): string;
    getModel(): import("ai").LanguageModelV1;
    private _applySchemaCompat;
    __text<Tools extends ToolSet, Z extends ZodSchema | JSONSchema7 | undefined>({ runId, messages, maxSteps, tools, temperature, toolChoice, onStepFinish, experimental_output, telemetry, threadId, resourceId, runtimeContext, tracingContext, ...rest }: GenerateTextWithMessagesArgs<Tools, Z>): Promise<GenerateTextResult<Tools, Z>>;
    __textObject<Z extends ZodSchema | JSONSchema7>({ messages, structuredOutput, runId, telemetry, threadId, resourceId, runtimeContext, tracingContext, ...rest }: GenerateObjectWithMessagesArgs<Z>): Promise<GenerateObjectResult<Z>>;
    __stream<Tools extends ToolSet, Z extends ZodSchema | JSONSchema7 | undefined = undefined>({ messages, onStepFinish, onFinish, maxSteps, tools, runId, temperature, toolChoice, experimental_output, telemetry, threadId, resourceId, runtimeContext, tracingContext, ...rest }: StreamTextWithMessagesArgs<Tools, Z>): StreamTextResult<Tools, Z>;
    __streamObject<T extends ZodSchema | JSONSchema7>({ messages, runId, runtimeContext, threadId, resourceId, onFinish, structuredOutput, telemetry, tracingContext, ...rest }: StreamObjectWithMessagesArgs<T>): StreamObjectResult<T>;
    convertToMessages(messages: string | string[] | CoreMessage[]): CoreMessage[];
    generate<Output extends ZodSchema | JSONSchema7 | undefined = undefined, StructuredOutput extends ZodSchema | JSONSchema7 | undefined = undefined, Tools extends ToolSet = ToolSet>(messages: string | string[] | CoreMessage[], { output, ...rest }: Omit<Output extends undefined ? GenerateTextWithMessagesArgs<Tools, StructuredOutput> : Omit<GenerateObjectWithMessagesArgs<NonNullable<Output>>, 'structuredOutput' | 'output'>, 'messages'> & {
        output?: Output;
    }): Promise<GenerateReturn<Tools, Output, StructuredOutput>>;
    stream<Output extends ZodSchema | JSONSchema7 | undefined = undefined, StructuredOutput extends ZodSchema | JSONSchema7 | undefined = undefined, Tools extends ToolSet = ToolSet>(messages: string | string[] | CoreMessage[], { maxSteps, output, onFinish, ...rest }: Omit<Output extends undefined ? StreamTextWithMessagesArgs<Tools, StructuredOutput> : Omit<StreamObjectWithMessagesArgs<NonNullable<Output>>, 'structuredOutput' | 'output'> & {
        maxSteps?: never;
    }, 'messages'> & {
        output?: Output;
    }): StreamReturn<Tools, Output, StructuredOutput>;
}
//# sourceMappingURL=model.d.ts.map