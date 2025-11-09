import { MastraBase } from '../../../base.js';
import type { EvalRow, PaginationArgs, PaginationInfo } from '../../types.js';
export declare abstract class LegacyEvalsStorage extends MastraBase {
    constructor();
    abstract getEvals(options: {
        agentName?: string;
        type?: 'test' | 'live';
    } & PaginationArgs): Promise<PaginationInfo & {
        evals: EvalRow[];
    }>;
    abstract getEvalsByAgentName(agentName: string, type?: 'test' | 'live'): Promise<EvalRow[]>;
}
//# sourceMappingURL=base.d.ts.map