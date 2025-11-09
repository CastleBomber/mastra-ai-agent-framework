import type { TracingStrategy } from '../../../ai-tracing/index.js';
import { MastraBase } from '../../../base.js';
import type { AISpanRecord, AITraceRecord, AITracesPaginatedArg, CreateAISpanRecord, PaginationInfo, UpdateAISpanRecord } from '../../types.js';
export declare class ObservabilityStorage extends MastraBase {
    constructor();
    /**
     * Provides hints for AI tracing strategy selection by the DefaultExporter.
     * Storage adapters can override this to specify their preferred and supported strategies.
     */
    get aiTracingStrategy(): {
        preferred: TracingStrategy;
        supported: TracingStrategy[];
    };
    /**
     * Creates a single AI span record in the storage provider.
     */
    createAISpan(_span: CreateAISpanRecord): Promise<void>;
    /**
     * Updates a single AI span with partial data. Primarily used for realtime trace creation.
     */
    updateAISpan(_params: {
        spanId: string;
        traceId: string;
        updates: Partial<UpdateAISpanRecord>;
    }): Promise<void>;
    /**
     * Retrieves a single AI trace with all its associated spans.
     */
    getAITrace(_traceId: string): Promise<AITraceRecord | null>;
    /**
     * Retrieves a paginated list of AI traces with optional filtering.
     */
    getAITracesPaginated(_args: AITracesPaginatedArg): Promise<{
        pagination: PaginationInfo;
        spans: AISpanRecord[];
    }>;
    /**
     * Creates multiple AI spans in a single batch.
     */
    batchCreateAISpans(_args: {
        records: CreateAISpanRecord[];
    }): Promise<void>;
    /**
     * Updates multiple AI spans in a single batch.
     */
    batchUpdateAISpans(_args: {
        records: {
            traceId: string;
            spanId: string;
            updates: Partial<UpdateAISpanRecord>;
        }[];
    }): Promise<void>;
    /**
     * Deletes multiple AI traces and all their associated spans in a single batch operation.
     */
    batchDeleteAITraces(_args: {
        traceIds: string[];
    }): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map