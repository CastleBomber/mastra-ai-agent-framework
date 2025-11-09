import type { Metric, MetricResult } from '../eval/metric.js';
import type { TestInfo } from '../eval/types.js';
import type { ScoringHookInput } from '../scores/index.js';
import type { Handler } from './mitt.js';
export declare enum AvailableHooks {
    ON_EVALUATION = "onEvaluation",
    ON_GENERATION = "onGeneration",
    ON_SCORER_RUN = "onScorerRun"
}
type EvaluationHookData = {
    input: string;
    output: string;
    result: MetricResult;
    agentName: string;
    metricName: string;
    instructions: string;
    runId: string;
    globalRunId: string;
    testInfo?: TestInfo;
};
type GenerationHookData = {
    input: string;
    output: string;
    metric: Metric;
    runId: string;
    agentName: string;
    instructions: string;
};
export declare function registerHook(hook: AvailableHooks.ON_EVALUATION, action: Handler<EvaluationHookData>): void;
export declare function registerHook(hook: AvailableHooks.ON_GENERATION, action: Handler<GenerationHookData>): void;
export declare function registerHook(hook: AvailableHooks.ON_SCORER_RUN, action: Handler<ScoringHookInput>): void;
export declare function executeHook(hook: AvailableHooks.ON_EVALUATION, action: EvaluationHookData): void;
export declare function executeHook(hook: AvailableHooks.ON_GENERATION, action: GenerationHookData): void;
export declare function executeHook(hook: AvailableHooks.ON_SCORER_RUN, action: ScoringHookInput): void;
export {};
//# sourceMappingURL=index.d.ts.map