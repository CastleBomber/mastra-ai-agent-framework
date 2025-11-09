import type { Agent } from '../agent/index.js';
import type { Metric } from './metric.js';
import type { TestInfo, EvaluationResult } from './types.js';
export declare function evaluate<T extends Agent>({ agentName, input, metric, output, runId, globalRunId, testInfo, instructions, }: {
    agentName: string;
    input: Parameters<T['generate']>[0];
    metric: Metric;
    output: string;
    globalRunId: string;
    runId?: string;
    testInfo?: TestInfo;
    instructions: string;
}): Promise<EvaluationResult>;
//# sourceMappingURL=evaluation.d.ts.map