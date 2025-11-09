import type { CoreMessage } from 'ai';
import type { Agent, AiMessageType, UIMessageWithMetadata } from '../../agent/index.js';
import type { TracingContext } from '../../ai-tracing/index.js';
import type { RuntimeContext } from '../../runtime-context/index.js';
import { Workflow } from '../../workflows/index.js';
import type { WorkflowResult } from '../../workflows/index.js';
import type { MastraScorer } from '../base.js';
type RunExperimentDataItem<TTarget = unknown> = {
    input: TTarget extends Workflow<any, any> ? any : TTarget extends Agent ? string | string[] | CoreMessage[] | AiMessageType[] | UIMessageWithMetadata[] : unknown;
    groundTruth?: any;
    runtimeContext?: RuntimeContext;
    tracingContext?: TracingContext;
};
type WorkflowScorerConfig = {
    workflow?: MastraScorer<any, any, any, any>[];
    steps?: Record<string, MastraScorer<any, any, any, any>[]>;
};
type RunExperimentResult = {
    scores: Record<string, any>;
    summary: {
        totalItems: number;
    };
};
export declare function runExperiment<TAgent extends Agent>(config: {
    data: RunExperimentDataItem<TAgent>[];
    scorers: MastraScorer<any, any, any, any>[];
    target: TAgent;
    onItemComplete?: (params: {
        item: RunExperimentDataItem<TAgent>;
        targetResult: ReturnType<Agent['generate']>;
        scorerResults: Record<string, any>;
    }) => void | Promise<void>;
    concurrency?: number;
}): Promise<RunExperimentResult>;
export declare function runExperiment<TWorkflow extends Workflow>(config: {
    data: RunExperimentDataItem<TWorkflow>[];
    scorers: MastraScorer<any, any, any, any>[];
    target: TWorkflow;
    onItemComplete?: (params: {
        item: RunExperimentDataItem<TWorkflow>;
        targetResult: WorkflowResult<any, any, any, any>;
        scorerResults: Record<string, any>;
    }) => void | Promise<void>;
    concurrency?: number;
}): Promise<RunExperimentResult>;
export declare function runExperiment<TWorkflow extends Workflow>(config: {
    data: RunExperimentDataItem<TWorkflow>[];
    scorers: WorkflowScorerConfig;
    target: TWorkflow;
    onItemComplete?: (params: {
        item: RunExperimentDataItem<TWorkflow>;
        targetResult: WorkflowResult<any, any, any, any>;
        scorerResults: {
            workflow?: Record<string, any>;
            steps?: Record<string, Record<string, any>>;
        };
    }) => void | Promise<void>;
    concurrency?: number;
}): Promise<RunExperimentResult>;
export {};
//# sourceMappingURL=index.d.ts.map