import type { TracingStrategy } from '../../../ai-tracing/index.js';
import type { AISpanRecord, AITraceRecord, AITracesPaginatedArg, CreateAISpanRecord, PaginationInfo, UpdateAISpanRecord } from '../../types.js';
import type { StoreOperations } from '../operations/index.js';
import { ObservabilityStorage } from './base.js';
export type InMemoryObservability = Map<string, AISpanRecord>;
export declare class ObservabilityInMemory extends ObservabilityStorage {
    operations: StoreOperations;
    collection: InMemoryObservability;
    constructor({ collection, operations }: {
        collection: InMemoryObservability;
        operations: StoreOperations;
    });
    get aiTracingStrategy(): {
        preferred: TracingStrategy;
        supported: TracingStrategy[];
    };
    createAISpan(span: CreateAISpanRecord): Promise<void>;
    batchCreateAISpans(args: {
        records: CreateAISpanRecord[];
    }): Promise<void>;
    private validateCreateAISpan;
    private generateId;
    getAITrace(traceId: string): Promise<AITraceRecord | null>;
    getAITracesPaginated({ filters, pagination, }: AITracesPaginatedArg): Promise<{
        pagination: PaginationInfo;
        spans: AISpanRecord[];
    }>;
    private filterForRootSpans;
    private filterSpansByDate;
    private filterSpansByFilter;
    private filterSpansByPagination;
    updateAISpan(params: {
        spanId: string;
        traceId: string;
        updates: Partial<UpdateAISpanRecord>;
    }): Promise<void>;
    batchUpdateAISpans(args: {
        records: {
            traceId: string;
            spanId: string;
            updates: Partial<UpdateAISpanRecord>;
        }[];
    }): Promise<void>;
    batchDeleteAITraces(args: {
        traceIds: string[];
    }): Promise<void>;
}
//# sourceMappingURL=inmemory.d.ts.map