import type { MetricResult } from './metric.js';
export interface TestInfo {
    testName?: string;
    testPath?: string;
}
export interface EvaluationResult extends MetricResult {
    output: string;
}
//# sourceMappingURL=types.d.ts.map