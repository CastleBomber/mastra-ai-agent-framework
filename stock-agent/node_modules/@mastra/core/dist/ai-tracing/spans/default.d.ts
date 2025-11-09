import type { AISpanType, AITracing, EndSpanOptions, ErrorSpanOptions, UpdateSpanOptions, CreateSpanOptions } from '../types.js';
import { BaseAISpan } from './base.js';
export declare class DefaultAISpan<TType extends AISpanType> extends BaseAISpan<TType> {
    id: string;
    traceId: string;
    constructor(options: CreateSpanOptions<TType>, aiTracing: AITracing);
    end(options?: EndSpanOptions<TType>): void;
    error(options: ErrorSpanOptions<TType>): void;
    update(options: UpdateSpanOptions<TType>): void;
    get isValid(): boolean;
    export(): Promise<string>;
}
//# sourceMappingURL=default.d.ts.map