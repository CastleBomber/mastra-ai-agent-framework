/**
 * No Op Implementation for MastraAITracing
 */
import type { AITracing, AISpanType, CreateSpanOptions, EndSpanOptions, UpdateSpanOptions, ErrorSpanOptions } from '../types.js';
import { BaseAISpan } from './base.js';
export declare class NoOpAISpan<TType extends AISpanType = any> extends BaseAISpan<TType> {
    id: string;
    traceId: string;
    constructor(options: CreateSpanOptions<TType>, aiTracing: AITracing);
    end(_options?: EndSpanOptions<TType>): void;
    error(_options: ErrorSpanOptions<TType>): void;
    update(_options: UpdateSpanOptions<TType>): void;
    get isValid(): boolean;
}
//# sourceMappingURL=no-op.d.ts.map