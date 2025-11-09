import { EventProcessor } from '../../../events/processor.js';
import type { Event } from '../../../events/types.js';
import type { Mastra } from '../../../mastra/index.js';
import type { StepResult, WorkflowRunState } from '../../../workflows/types.js';
import type { Workflow } from '../../../workflows/workflow.js';
export type ProcessorArgs = {
    activeSteps: Record<string, boolean>;
    workflow: Workflow;
    workflowId: string;
    runId: string;
    executionPath: number[];
    stepResults: Record<string, StepResult<any, any, any, any>>;
    resumeSteps: string[];
    prevResult: StepResult<any, any, any, any>;
    runtimeContext: Record<string, any>;
    resumeData?: any;
    parentWorkflow?: ParentWorkflow;
    parentContext?: {
        workflowId: string;
        input: any;
    };
    runCount?: number;
};
export type ParentWorkflow = {
    workflowId: string;
    runId: string;
    executionPath: number[];
    resume: boolean;
    stepResults: Record<string, StepResult<any, any, any, any>>;
    parentWorkflow?: ParentWorkflow;
    stepId: string;
};
export declare class WorkflowEventProcessor extends EventProcessor {
    private stepExecutor;
    constructor({ mastra }: {
        mastra: Mastra;
    });
    __registerMastra(mastra: Mastra): void;
    private errorWorkflow;
    protected processWorkflowCancel({ workflowId, runId }: ProcessorArgs): Promise<void>;
    protected processWorkflowStart({ workflow, parentWorkflow, workflowId, runId, resumeSteps, prevResult, resumeData, executionPath, stepResults, runtimeContext, }: ProcessorArgs): Promise<void>;
    protected endWorkflow(args: ProcessorArgs): Promise<void>;
    protected processWorkflowEnd(args: ProcessorArgs): Promise<void>;
    protected processWorkflowSuspend(args: ProcessorArgs): Promise<void>;
    protected processWorkflowFail(args: ProcessorArgs): Promise<void>;
    protected processWorkflowStepRun({ workflow, workflowId, runId, executionPath, stepResults, activeSteps, resumeSteps, prevResult, resumeData, parentWorkflow, runtimeContext, runCount, }: ProcessorArgs): Promise<void>;
    protected processWorkflowStepEnd({ workflow, workflowId, runId, executionPath, resumeSteps, prevResult, parentWorkflow, stepResults, activeSteps, parentContext, runtimeContext, }: ProcessorArgs): Promise<void>;
    loadData({ workflowId, runId, }: {
        workflowId: string;
        runId: string;
    }): Promise<WorkflowRunState | null | undefined>;
    process(event: Event, ack?: () => Promise<void>): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map