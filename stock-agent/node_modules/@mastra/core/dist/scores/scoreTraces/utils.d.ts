import type { AISpanRecord, AITraceRecord } from '../../storage/index.js';
import type { ScorerRunInputForAgent, ScorerRunOutputForAgent } from '../types.js';
interface SpanTree {
    spanMap: Map<string, AISpanRecord>;
    childrenMap: Map<string, AISpanRecord[]>;
    rootSpans: AISpanRecord[];
}
/**
 * Build a hierarchical span tree with efficient lookup maps
 */
export declare function buildSpanTree(spans: AISpanRecord[]): SpanTree;
/**
 * Validate trace structure and throw descriptive errors
 */
export declare function validateTrace(trace: AITraceRecord): void;
export declare function transformTraceToScorerInputAndOutput(trace: AITraceRecord): {
    input: ScorerRunInputForAgent;
    output: ScorerRunOutputForAgent;
};
export {};
//# sourceMappingURL=utils.d.ts.map