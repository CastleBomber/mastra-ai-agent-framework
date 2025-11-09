import type { AISpan, AISpanTypeMap, AnyAISpan, ChildSpanOptions, ChildEventOptions, EndSpanOptions, ErrorSpanOptions, UpdateSpanOptions, CreateSpanOptions, AITracing, ExportedAISpan, TraceState } from '../types.js';
import { AISpanType } from '../types.js';
export declare abstract class BaseAISpan<TType extends AISpanType = any> implements AISpan<TType> {
    abstract id: string;
    abstract traceId: string;
    name: string;
    type: TType;
    attributes: AISpanTypeMap[TType];
    parent?: AnyAISpan;
    startTime: Date;
    endTime?: Date;
    isEvent: boolean;
    isInternal: boolean;
    aiTracing: AITracing;
    input?: any;
    output?: any;
    errorInfo?: {
        message: string;
        id?: string;
        domain?: string;
        category?: string;
        details?: Record<string, any>;
    };
    metadata?: Record<string, any>;
    traceState?: TraceState;
    /** Parent span ID (for root spans that are children of external spans) */
    protected parentSpanId?: string;
    constructor(options: CreateSpanOptions<TType>, aiTracing: AITracing);
    /** End the span */
    abstract end(options?: EndSpanOptions<TType>): void;
    /** Record an error for the span, optionally end the span as well */
    abstract error(options: ErrorSpanOptions<TType>): void;
    /** Update span attributes */
    abstract update(options: UpdateSpanOptions<TType>): void;
    createChildSpan<TChildType extends AISpanType>(options: ChildSpanOptions<TChildType>): AISpan<TChildType>;
    createEventSpan<TChildType extends AISpanType>(options: ChildEventOptions<TChildType>): AISpan<TChildType>;
    /** Returns `TRUE` if the span is the root span of a trace */
    get isRootSpan(): boolean;
    /** Returns `TRUE` if the span is a valid span (not a NO-OP Span) */
    abstract get isValid(): boolean;
    /** Get the closest parent spanId that isn't an internal span */
    getParentSpanId(includeInternalSpans?: boolean): string | undefined;
    /** Find the closest parent span of a specific type by walking up the parent chain */
    findParent<T extends AISpanType>(spanType: T): AISpan<T> | undefined;
    /** Returns a lightweight span ready for export */
    exportSpan(includeInternalSpans?: boolean): ExportedAISpan<TType>;
}
export interface DeepCleanOptions {
    keysToStrip?: Set<string>;
    maxDepth?: number;
}
/**
 * Recursively cleans a value by removing circular references and stripping problematic or sensitive keys.
 * Circular references are replaced with "[Circular]". Unserializable values are replaced with error messages.
 * Keys like "logger" and "tracingContext" are stripped by default.
 * A maximum recursion depth is enforced to avoid stack overflow or excessive memory usage.
 *
 * @param value - The value to clean (object, array, primitive, etc.)
 * @param options - Optional configuration:
 *   - keysToStrip: Set of keys to remove from objects (default: logger, tracingContext)
 *   - maxDepth: Maximum recursion depth before values are replaced with "[MaxDepth]" (default: 10)
 * @returns A cleaned version of the input with circular references, specified keys, and overly deep values handled
 */
export declare function deepClean(value: any, options?: DeepCleanOptions, _seen?: WeakSet<any>, _depth?: number): any;
//# sourceMappingURL=base.d.ts.map