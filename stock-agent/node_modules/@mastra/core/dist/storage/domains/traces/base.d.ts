import { MastraBase } from '../../../base.js';
import type { Trace } from '../../../telemetry/index.js';
import type { StorageGetTracesArg, PaginationInfo, StorageGetTracesPaginatedArg } from '../../types.js';
export declare abstract class TracesStorage extends MastraBase {
    constructor();
    abstract getTraces(args: StorageGetTracesArg): Promise<Trace[]>;
    abstract getTracesPaginated(args: StorageGetTracesPaginatedArg): Promise<PaginationInfo & {
        traces: Trace[];
    }>;
    abstract batchTraceInsert(args: {
        records: Record<string, any>[];
    }): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map