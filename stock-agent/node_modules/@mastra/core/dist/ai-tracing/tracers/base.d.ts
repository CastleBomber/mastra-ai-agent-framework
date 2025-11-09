/**
 * MastraAITracing - Abstract base class for AI Tracing implementations
 */
import { MastraBase } from '../../base.js';
import type { IMastraLogger } from '../../logger/index.js';
import type { RuntimeContext } from '../../runtime-context/index.js';
import type { TracingConfig, AISpan, AISpanType, AITracingExporter, AISpanProcessor, AITracingEvent, AnyAISpan, StartSpanOptions, CreateSpanOptions, AITracing, CustomSamplerOptions, AnyExportedAISpan, TraceState, TracingOptions } from '../types.js';
/**
 * Abstract base class for all AI Tracing implementations in Mastra.
 */
export declare abstract class BaseAITracing extends MastraBase implements AITracing {
    protected config: Required<TracingConfig>;
    constructor(config: TracingConfig);
    /**
     * Override setLogger to add AI tracing specific initialization log
     * and propagate logger to exporters
     */
    __setLogger(logger: IMastraLogger): void;
    protected get exporters(): AITracingExporter[];
    protected get processors(): AISpanProcessor[];
    /**
     * Start a new span of a specific AISpanType
     */
    startSpan<TType extends AISpanType>(options: StartSpanOptions<TType>): AISpan<TType>;
    /**
     * Create a new span (called after sampling)
     *
     * Implementations should:
     * 1. Create a plain span with the provided attributes
     * 2. Return the span - base class handles all tracing lifecycle automatically
     *
     * The base class will automatically:
     * - Set trace relationships
     * - Wire span lifecycle callbacks
     * - Emit span_started event
     */
    protected abstract createSpan<TType extends AISpanType>(options: CreateSpanOptions<TType>): AISpan<TType>;
    /**
     * Get current configuration
     */
    getConfig(): Readonly<Required<TracingConfig>>;
    /**
     * Get all exporters
     */
    getExporters(): readonly AITracingExporter[];
    /**
     * Get all processors
     */
    getProcessors(): readonly AISpanProcessor[];
    /**
     * Get the logger instance (for exporters and other components)
     */
    getLogger(): IMastraLogger;
    /**
     * Automatically wires up AI tracing lifecycle events for any span
     * This ensures all spans emit events regardless of implementation
     */
    private wireSpanLifecycle;
    /**
     * Check if an AI trace should be sampled
     */
    protected shouldSample(options?: CustomSamplerOptions): boolean;
    /**
     * Compute TraceState for a new trace based on configured and per-request keys
     */
    protected computeTraceState(tracingOptions?: TracingOptions): TraceState | undefined;
    /**
     * Extract metadata from RuntimeContext using TraceState
     */
    protected extractMetadataFromRuntimeContext(runtimeContext: RuntimeContext | undefined, explicitMetadata: Record<string, any> | undefined, traceState: TraceState | undefined): Record<string, any> | undefined;
    /**
     * Extract specific keys from RuntimeContext
     */
    protected extractKeys(runtimeContext: RuntimeContext, keys: string[]): Record<string, any>;
    /**
     * Process a span through all processors
     */
    private processSpan;
    getSpanForExport(span: AnyAISpan): AnyExportedAISpan | undefined;
    /**
     * Emit a span started event
     */
    protected emitSpanStarted(span: AnyAISpan): void;
    /**
     * Emit a span ended event (called automatically when spans end)
     */
    protected emitSpanEnded(span: AnyAISpan): void;
    /**
     * Emit a span updated event
     */
    protected emitSpanUpdated(span: AnyAISpan): void;
    /**
     * Export tracing event through all exporters (realtime mode)
     */
    protected exportEvent(event: AITracingEvent): Promise<void>;
    /**
     * Initialize AI tracing (called by Mastra during component registration)
     */
    init(): void;
    /**
     * Shutdown AI tracing and clean up resources
     */
    shutdown(): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map