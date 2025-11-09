/**
 * Model Span Tracing
 *
 * Provides span tracking for Model generations, including:
 * - MODEL_STEP spans (one per Model API call)
 * - MODEL_CHUNK spans (individual streaming chunks within a step)
 *
 * Hierarchy: MODEL_GENERATION -> MODEL_STEP -> MODEL_CHUNK
 */
import type { MastraError } from '../error/index.js';
import { AISpanType } from './types.js';
import type { AISpan, AnyAISpan, ModelGenerationAttributes } from './types.js';
/**
 * Manages MODEL_STEP and MODEL_CHUNK span tracking for streaming Model responses.
 *
 * Should be instantiated once per MODEL_GENERATION span and shared across
 * all streaming steps (including after tool calls).
 */
export declare class ModelSpanTracker {
    #private;
    constructor(modelSpan?: AISpan<AISpanType.MODEL_GENERATION>);
    /**
     * Get the tracing context for creating child spans.
     * Returns the current step span if active, otherwise the model span.
     */
    getTracingContext(): {
        currentSpan?: AnyAISpan;
    };
    /**
     * Report an error on the generation span
     */
    reportGenerationError(options: {
        error: MastraError | Error;
        endSpan?: boolean;
    }): void;
    /**
     * End the generation span
     */
    endGeneration(options?: {
        output?: any;
        attributes?: Partial<ModelGenerationAttributes>;
        metadata?: Record<string, any>;
    }): void;
    /**
     * Update the generation span
     */
    updateGeneration(options: {
        input?: any;
        output?: any;
        attributes?: Partial<ModelGenerationAttributes>;
        metadata?: Record<string, any>;
    }): void;
    /**
     * Wraps a stream with model tracing transform to track MODEL_STEP and MODEL_CHUNK spans.
     *
     * This should be added to the stream pipeline to automatically
     * create MODEL_STEP and MODEL_CHUNK spans for each semantic unit in the stream.
     */
    wrapStream<T extends {
        pipeThrough: Function;
    }>(stream: T): T;
}
//# sourceMappingURL=model-tracing.d.ts.map