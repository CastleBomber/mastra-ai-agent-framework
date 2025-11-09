import EventEmitter from 'events';
import type { LoopConditionFunction, Mastra, Step, StepFlowEntry, StepResult } from '../../index.js';
import { MastraBase } from '../../base.js';
import type { RuntimeContext } from '../../di/index.js';
import type { PubSub } from '../../events/index.js';
export declare class StepExecutor extends MastraBase {
    protected mastra?: Mastra;
    constructor({ mastra }: {
        mastra?: Mastra;
    });
    __registerMastra(mastra: Mastra): void;
    execute(params: {
        workflowId: string;
        step: Step<any, any, any, any>;
        runId: string;
        input?: any;
        resumeData?: any;
        stepResults: Record<string, StepResult<any, any, any, any>>;
        state: Record<string, any>;
        emitter: EventEmitter;
        runtimeContext: RuntimeContext;
        runCount?: number;
        foreachIdx?: number;
        validateInputs?: boolean;
    }): Promise<StepResult<any, any, any, any>>;
    evaluateConditions(params: {
        workflowId: string;
        step: Extract<StepFlowEntry, {
            type: 'conditional';
        }>;
        runId: string;
        input?: any;
        resumeData?: any;
        stepResults: Record<string, StepResult<any, any, any, any>>;
        state: Record<string, any>;
        emitter: {
            runtime: PubSub;
            events: PubSub;
        };
        runtimeContext: RuntimeContext;
        runCount?: number;
    }): Promise<number[]>;
    evaluateCondition({ workflowId, condition, runId, inputData, resumeData, stepResults, state, runtimeContext, emitter, abortController, runCount, iterationCount, }: {
        workflowId: string;
        condition: LoopConditionFunction<any, any, any, any, any>;
        runId: string;
        inputData?: any;
        resumeData?: any;
        stepResults: Record<string, StepResult<any, any, any, any>>;
        state: Record<string, any>;
        emitter: EventEmitter;
        runtimeContext: RuntimeContext;
        abortController: AbortController;
        runCount?: number;
        iterationCount: number;
    }): Promise<boolean>;
    resolveSleep(params: {
        workflowId: string;
        step: Extract<StepFlowEntry, {
            type: 'sleep';
        }>;
        runId: string;
        input?: any;
        resumeData?: any;
        stepResults: Record<string, StepResult<any, any, any, any>>;
        emitter: {
            runtime: PubSub;
            events: PubSub;
        };
        runtimeContext: RuntimeContext;
        runCount?: number;
    }): Promise<number>;
    resolveSleepUntil(params: {
        workflowId: string;
        step: Extract<StepFlowEntry, {
            type: 'sleepUntil';
        }>;
        runId: string;
        input?: any;
        resumeData?: any;
        stepResults: Record<string, StepResult<any, any, any, any>>;
        emitter: {
            runtime: PubSub;
            events: PubSub;
        };
        runtimeContext: RuntimeContext;
        runCount?: number;
    }): Promise<number>;
}
//# sourceMappingURL=step-executor.d.ts.map