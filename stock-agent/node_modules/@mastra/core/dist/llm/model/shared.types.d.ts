import type { LanguageModelV2 } from '@ai-sdk/provider-v5';
import type { LanguageModelV1 } from 'ai';
import type { JSONSchema7 } from 'json-schema';
import type { z, ZodSchema } from 'zod';
import type { TracingPolicy } from '../../ai-tracing/index.js';
import type { ScoringData } from './base.types.js';
import type { ModelRouterModelId } from './provider-registry.js';
export type inferOutput<Output extends ZodSchema | JSONSchema7 | undefined = undefined> = Output extends ZodSchema ? z.infer<Output> : Output extends JSONSchema7 ? unknown : undefined;
export type TripwireProperties = {
    tripwire?: boolean;
    tripwireReason?: string;
};
export type ScoringProperties = {
    scoringData?: ScoringData;
};
export type OpenAICompatibleConfig = {
    id: `${string}/${string}`;
    url?: string;
    apiKey?: string;
    headers?: Record<string, string>;
} | {
    providerId: string;
    modelId: string;
    url?: string;
    apiKey?: string;
    headers?: Record<string, string>;
};
export type MastraLanguageModel = LanguageModelV1 | LanguageModelV2;
export type MastraModelConfig = MastraLanguageModel | ModelRouterModelId | OpenAICompatibleConfig;
export type MastraLanguageModelV2 = LanguageModelV2;
export type MastraModelOptions = {
    tracingPolicy?: TracingPolicy;
};
//# sourceMappingURL=shared.types.d.ts.map