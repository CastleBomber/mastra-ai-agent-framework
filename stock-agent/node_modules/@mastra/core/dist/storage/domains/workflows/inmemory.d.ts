import type { StepResult, WorkflowRunState } from '../../../workflows/index.js';
import type { StorageWorkflowRun, WorkflowRun, WorkflowRuns } from '../../types.js';
import type { StoreOperations } from '../operations/index.js';
import { WorkflowsStorage } from './base.js';
export type InMemoryWorkflows = Map<string, StorageWorkflowRun>;
export declare class WorkflowsInMemory extends WorkflowsStorage {
    operations: StoreOperations;
    collection: InMemoryWorkflows;
    constructor({ collection, operations }: {
        collection: InMemoryWorkflows;
        operations: StoreOperations;
    });
    updateWorkflowResults({ workflowName, runId, stepId, result, runtimeContext, }: {
        workflowName: string;
        runId: string;
        stepId: string;
        result: StepResult<any, any, any, any>;
        runtimeContext: Record<string, any>;
    }): Promise<Record<string, StepResult<any, any, any, any>>>;
    updateWorkflowState({ workflowName, runId, opts, }: {
        workflowName: string;
        runId: string;
        opts: {
            status: string;
            result?: StepResult<any, any, any, any>;
            error?: string;
            suspendedPaths?: Record<string, number[]>;
            waitingPaths?: Record<string, number[]>;
        };
    }): Promise<WorkflowRunState | undefined>;
    persistWorkflowSnapshot({ workflowName, runId, resourceId, snapshot, }: {
        workflowName: string;
        runId: string;
        resourceId?: string;
        snapshot: WorkflowRunState;
    }): Promise<void>;
    loadWorkflowSnapshot({ workflowName, runId, }: {
        workflowName: string;
        runId: string;
    }): Promise<WorkflowRunState | null>;
    getWorkflowRuns({ workflowName, fromDate, toDate, limit, offset, resourceId, }?: {
        workflowName?: string;
        fromDate?: Date;
        toDate?: Date;
        limit?: number;
        offset?: number;
        resourceId?: string;
    }): Promise<WorkflowRuns>;
    getWorkflowRunById({ runId, workflowName, }: {
        runId: string;
        workflowName?: string;
    }): Promise<WorkflowRun | null>;
}
//# sourceMappingURL=inmemory.d.ts.map