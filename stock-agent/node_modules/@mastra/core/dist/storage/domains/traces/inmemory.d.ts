import type { Trace } from '../../../telemetry/index.js';
import type { StorageGetTracesArg, PaginationInfo, StorageGetTracesPaginatedArg } from '../../types.js';
import type { StoreOperations } from '../operations/index.js';
import { TracesStorage } from './base.js';
export type InMemoryTraces = Map<string, Trace>;
export declare class TracesInMemory extends TracesStorage {
    traces: InMemoryTraces;
    operations: StoreOperations;
    collection: InMemoryTraces;
    constructor({ collection, operations }: {
        collection: InMemoryTraces;
        operations: StoreOperations;
    });
    getTraces({ name, scope, page, perPage, attributes, filters, fromDate, toDate, }: StorageGetTracesArg): Promise<Trace[]>;
    getTracesPaginated({ name, scope, attributes, page, perPage, dateRange, }: StorageGetTracesPaginatedArg): Promise<PaginationInfo & {
        traces: Trace[];
    }>;
    batchTraceInsert({ records }: {
        records: Record<string, any>[];
    }): Promise<void>;
}
//# sourceMappingURL=inmemory.d.ts.map