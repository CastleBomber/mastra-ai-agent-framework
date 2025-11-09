import type { Tracer, Context, Span, BaggageEntry } from '@opentelemetry/api';
import type { OtelConfig } from './types.js';
declare global {
    var __TELEMETRY__: Telemetry | undefined;
}
export declare class Telemetry {
    tracer: Tracer;
    name: string;
    private constructor();
    /**
     * @deprecated This method does not do anything
     */
    shutdown(): Promise<void>;
    /**
     * Initialize telemetry with the given configuration
     * @param config - Optional telemetry configuration object
     * @returns Telemetry instance that can be used for tracing
     */
    static init(config?: OtelConfig): Telemetry;
    static getActiveSpan(): Span | undefined;
    /**
     * Get the global telemetry instance
     * @throws {Error} If telemetry has not been initialized
     * @returns {Telemetry} The global telemetry instance
     */
    static get(): Telemetry;
    /**
     * Wraps a class instance with telemetry tracing
     * @param instance The class instance to wrap
     * @param options Optional configuration for tracing
     * @returns Wrapped instance with all methods traced
     */
    traceClass<T extends object>(instance: T, options?: {
        /** Base name for spans (e.g. 'integration', 'agent') */
        spanNamePrefix?: string;
        /** Additional attributes to add to all spans */
        attributes?: Record<string, string>;
        /** Methods to exclude from tracing */
        excludeMethods?: string[];
        /** Skip tracing if telemetry is not active */
        skipIfNoTelemetry?: boolean;
    }): T;
    static setBaggage(baggage: Record<string, BaggageEntry>, ctx?: Context): Context;
    static withContext(ctx: Context, fn: () => void): void;
    /**
     * method to trace individual methods with proper context
     * @param method The method to trace
     * @param context Additional context for the trace
     * @returns Wrapped method with tracing
     */
    traceMethod<TMethod extends Function>(method: TMethod, context: {
        spanName: string;
        attributes?: Record<string, string>;
        skipIfNoTelemetry?: boolean;
        parentSpan?: Span;
    }): TMethod;
    getBaggageTracer(): Tracer;
}
//# sourceMappingURL=telemetry.d.ts.map