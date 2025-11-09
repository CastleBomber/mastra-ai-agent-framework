import type { LanguageModelV2, LanguageModelV2CallOptions } from '@ai-sdk/provider-v5';
import { ModelsDevGateway } from './gateways/models-dev.js';
import { NetlifyGateway } from './gateways/netlify.js';
import type { ModelRouterModelId } from './provider-registry.js';
import type { OpenAICompatibleConfig } from './shared.types.js';
export declare const gateways: (ModelsDevGateway | NetlifyGateway)[];
export declare class ModelRouterLanguageModel implements LanguageModelV2 {
    readonly specificationVersion: "v2";
    readonly defaultObjectGenerationMode: "json";
    readonly supportsStructuredOutputs = true;
    readonly supportsImageUrls = true;
    readonly supportedUrls: Record<string, RegExp[]>;
    readonly modelId: string;
    readonly provider: string;
    private config;
    private gateway;
    constructor(config: ModelRouterModelId | OpenAICompatibleConfig);
    doGenerate(): Promise<never>;
    doStream(options: LanguageModelV2CallOptions): Promise<Awaited<ReturnType<LanguageModelV2['doStream']>>>;
    private resolveLanguageModel;
    private static modelInstances;
}
//# sourceMappingURL=router.d.ts.map