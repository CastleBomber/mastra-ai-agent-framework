import type { ModelMessage, ToolSet } from 'ai-v5';
import type { MastraPrimitives } from '../../action/index.js';
import { MastraBase } from '../../base.js';
import type { Mastra } from '../../mastra/index.js';
import type { MastraModelOutput } from '../../stream/base/output.js';
import type { OutputSchema } from '../../stream/base/schema.js';
import type { ModelManagerModelConfig } from '../../stream/types.js';
import type { ModelLoopStreamArgs } from './model.loop.types.js';
import type { MastraModelOptions } from './shared.types.js';
export declare class MastraLLMVNext extends MastraBase {
    #private;
    constructor({ mastra, models, options, }: {
        mastra?: Mastra;
        models: ModelManagerModelConfig[];
        options?: MastraModelOptions;
    });
    __registerPrimitives(p: MastraPrimitives): void;
    __registerMastra(p: Mastra): void;
    getProvider(): string;
    getModelId(): string;
    getModel(): import("@ai-sdk/provider-v5").LanguageModelV2;
    private _applySchemaCompat;
    convertToMessages(messages: string | string[] | ModelMessage[]): ModelMessage[];
    stream<Tools extends ToolSet, OUTPUT extends OutputSchema | undefined = undefined>({ resumeContext, runId, stopWhen, maxSteps, tools, modelSettings, toolChoice, telemetry_settings, threadId, resourceId, structuredOutput, options, outputProcessors, returnScorerData, providerOptions, tracingContext, messageList, requireToolApproval, _internal, agentId, toolCallId, }: ModelLoopStreamArgs<Tools, OUTPUT>): MastraModelOutput<OUTPUT>;
}
//# sourceMappingURL=model.loop.d.ts.map