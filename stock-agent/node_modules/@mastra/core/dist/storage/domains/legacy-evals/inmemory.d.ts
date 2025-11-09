import type { EvalRow, PaginationArgs, PaginationInfo, StorageEvalRow } from '../../types.js';
import { LegacyEvalsStorage } from './base.js';
export type InMemoryEvals = Map<string, StorageEvalRow>;
export declare class InMemoryLegacyEvals extends LegacyEvalsStorage {
    private collection;
    constructor({ collection }: {
        collection: InMemoryEvals;
    });
    getEvals(options: {
        agentName?: string;
        type?: 'test' | 'live';
    } & PaginationArgs): Promise<PaginationInfo & {
        evals: EvalRow[];
    }>;
    getEvalsByAgentName(agentName: string, type?: 'test' | 'live'): Promise<EvalRow[]>;
}
//# sourceMappingURL=inmemory.d.ts.map