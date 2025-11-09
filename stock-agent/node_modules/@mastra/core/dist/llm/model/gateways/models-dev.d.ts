import type { LanguageModelV2 } from '@ai-sdk/provider-v5';
import { MastraModelGateway } from './base.js';
import type { ProviderConfig } from './base.js';
export declare class ModelsDevGateway extends MastraModelGateway {
    readonly name = "models.dev";
    readonly prefix: undefined;
    private providerConfigs;
    constructor(providerConfigs?: Record<string, ProviderConfig>);
    fetchProviders(): Promise<Record<string, ProviderConfig>>;
    buildUrl(routerId: string, envVars?: typeof process.env): string | undefined;
    getApiKey(modelId: string): Promise<string>;
    resolveLanguageModel({ modelId, providerId, apiKey, }: {
        modelId: string;
        providerId: string;
        apiKey: string;
    }): Promise<LanguageModelV2>;
}
//# sourceMappingURL=models-dev.d.ts.map