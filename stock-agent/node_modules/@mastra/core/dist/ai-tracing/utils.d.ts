/**
 * Utility functions for cleaning and manipulating metadata objects
 * used in AI tracing and observability.
 */
import type { RuntimeContext } from '../runtime-context/index.js';
import type { AISpan, AISpanTypeMap, AnyAISpan, TracingContext, TracingOptions, TracingPolicy, AISpanType } from './types.js';
/**
 * Removes specific keys from an object.
 * @param obj - The original object
 * @param keysToOmit - Keys to exclude from the returned object
 * @returns A new object with the specified keys removed
 */
export declare function omitKeys<T extends Record<string, any>>(obj: T, keysToOmit: string[]): Partial<T>;
/**
 * Selectively extracts specific fields from an object using dot notation.
 * Does not error if fields don't exist - simply omits them from the result.
 * @param obj - The source object to extract fields from
 * @param fields - Array of field paths (supports dot notation like 'output.text')
 * @returns New object containing only the specified fields
 */
export declare function selectFields(obj: any, fields: string[]): any;
/**
 * Gets a nested value from an object using dot notation
 * @param obj - Source object
 * @param path - Dot notation path (e.g., 'output.text')
 * @returns The value at the path, or undefined if not found
 */
export declare function getNestedValue(obj: any, path: string): any;
/**
 * Sets a nested value in an object using dot notation
 * @param obj - Target object
 * @param path - Dot notation path (e.g., 'output.text')
 * @param value - Value to set
 */
export declare function setNestedValue(obj: any, path: string, value: any): void;
/**
 * Extracts the trace ID from a span if it is valid.
 *
 * This helper is typically used to safely retrieve the `traceId` from a span object,
 * while gracefully handling invalid spans — such as no-op spans — by returning `undefined`.
 *
 * A span is considered valid if `span.isValid` is `true`.
 *
 * @param span - The span object to extract the trace ID from. May be `undefined`.
 * @returns The `traceId` if the span is valid, otherwise `undefined`.
 */
export declare function getValidTraceId(span?: AnyAISpan): string | undefined;
/**
 * Creates or gets a child span from existing tracing context or starts a new trace.
 * This helper consolidates the common pattern of creating spans that can either be:
 * 1. Children of an existing span (when tracingContext.currentSpan exists)
 * 2. New root spans (when no current span exists)
 *
 * @param options - Configuration object for span creation
 * @returns The created AI span or undefined if tracing is disabled
 */
export declare function getOrCreateSpan<T extends AISpanType>(options: {
    type: T;
    name: string;
    input?: any;
    attributes?: AISpanTypeMap[T];
    metadata?: Record<string, any>;
    tracingPolicy?: TracingPolicy;
    tracingOptions?: TracingOptions;
    tracingContext?: TracingContext;
    runtimeContext?: RuntimeContext;
}): AISpan<T> | undefined;
//# sourceMappingURL=utils.d.ts.map