import type { AISpanType, AISpan, TracingConfig, CreateSpanOptions } from '../types.js';
import { BaseAITracing } from './base.js';
export declare class DefaultAITracing extends BaseAITracing {
    constructor(config: TracingConfig);
    protected createSpan<TType extends AISpanType>(options: CreateSpanOptions<TType>): AISpan<TType>;
}
//# sourceMappingURL=default.d.ts.map