import type { Span } from '@opentelemetry/api';
import type { Snapshot } from 'xstate';
import type { z } from 'zod';
import type { IMastraLogger } from '../../logger/index.js';
import type { Mastra } from '../../mastra/index.js';
import { RuntimeContext } from '../../runtime-context/index.js';
import { Machine } from './machine.js';
import type { LegacyStep as Step } from './step.js';
import type { RetryConfig, StepAction, StepGraph, StepNode, LegacyWorkflowRunResult as WorkflowRunResult, LegacyWorkflowRunState as WorkflowRunState } from './types.js';
export interface WorkflowResultReturn<TResult extends z.ZodObject<any>, T extends z.ZodObject<any>, TSteps extends Step<any, any, any>[]> {
    runId: string;
    start: (props?: {
        triggerData?: z.infer<T>;
        runtimeContext?: RuntimeContext;
    } | undefined) => Promise<WorkflowRunResult<T, TSteps, TResult>>;
    watch: (onTransition: (state: Pick<WorkflowRunResult<T, TSteps, TResult>, 'results' | 'activePaths' | 'runId' | 'timestamp'>) => void) => () => void;
    resume: (props: {
        stepId: string;
        context?: Record<string, any>;
        runtimeContext?: RuntimeContext;
    }) => Promise<Omit<WorkflowRunResult<T, TSteps, TResult>, 'runId'> | undefined>;
    resumeWithEvent: (eventName: string, data: any, runtimeContext?: RuntimeContext) => Promise<Omit<WorkflowRunResult<T, TSteps, TResult>, 'runId'> | undefined>;
}
export declare class WorkflowInstance<TSteps extends Step<any, any, any, any>[] = Step<any, any, any, any>[], TTriggerSchema extends z.ZodObject<any> = any, TResult extends z.ZodObject<any> = any> implements WorkflowResultReturn<TResult, TTriggerSchema, TSteps> {
    #private;
    name: string;
    logger: IMastraLogger;
    events?: Record<string, {
        schema: z.ZodObject<any>;
    }>;
    constructor({ name, logger, steps, runId, retryConfig, mastra, stepGraph, stepSubscriberGraph, onFinish, onStepTransition, resultMapping, events, }: {
        name: string;
        logger: IMastraLogger;
        steps: Record<string, StepNode>;
        mastra?: Mastra;
        retryConfig?: RetryConfig;
        runId?: string;
        stepGraph: StepGraph;
        stepSubscriberGraph: Record<string, StepGraph>;
        onFinish?: () => void;
        onStepTransition?: Set<(state: Pick<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, 'results' | 'activePaths' | 'runId' | 'timestamp'>) => void | Promise<void>>;
        resultMapping?: Record<string, {
            step: StepAction<any, any, any, any>;
            path: string;
        }>;
        events?: Record<string, {
            schema: z.ZodObject<any>;
        }>;
    });
    setState(state: any): void;
    get runId(): string;
    get executionSpan(): Span | undefined;
    watch(onTransition: (state: Pick<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, 'results' | 'activePaths' | 'runId' | 'timestamp'>) => void): () => void;
    start({ triggerData, runtimeContext, }?: {
        triggerData?: z.infer<TTriggerSchema>;
        runtimeContext?: RuntimeContext;
    }): Promise<{
        runId: string;
        result?: z.TypeOf<TResult> | undefined;
        timestamp: number;
        triggerData?: z.TypeOf<TTriggerSchema> | undefined;
        results: { [K in keyof import("./types").StepsRecord<TSteps>]: import("./types").StepsRecord<TSteps>[K]["outputSchema"] extends undefined ? import("./types").StepResult<unknown> : import("./types").StepResult<z.TypeOf<NonNullable<import("./types").StepsRecord<TSteps>[K]["outputSchema"]>>>; };
        activePaths: Map<TSteps[number]["id"], {
            status: string;
            suspendPayload?: any;
            stepPath: string[];
        }>;
    }>;
    private isCompoundDependencyMet;
    execute({ triggerData, snapshot, stepId, resumeData, runtimeContext, }?: {
        stepId?: string;
        triggerData?: z.infer<TTriggerSchema>;
        snapshot?: Snapshot<any>;
        resumeData?: any;
        runtimeContext: RuntimeContext;
    }): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, 'runId'>>;
    hasSubscribers(stepId: string): boolean;
    runMachine(parentStepId: string, input: any, runtimeContext?: RuntimeContext): Promise<(Pick<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, "runId" | "timestamp" | "results" | "activePaths"> | undefined)[]>;
    suspend(stepId: string, machine: Machine<TSteps, TTriggerSchema>): Promise<void>;
    /**
     * Persists the workflow state to the database
     */
    persistWorkflowSnapshot(): Promise<void>;
    getState(): Promise<WorkflowRunState | null>;
    resumeWithEvent(eventName: string, data: any, runtimeContext?: RuntimeContext): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, "runId"> | undefined>;
    resume({ stepId, context: resumeContext, runtimeContext, }: {
        stepId: string;
        context?: Record<string, any>;
        runtimeContext?: RuntimeContext;
    }): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, "runId"> | undefined>;
    _resume({ stepId, context: resumeContext, runtimeContext, }: {
        stepId: string;
        context?: Record<string, any>;
        runtimeContext: RuntimeContext;
    }): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, TResult>, "runId"> | undefined>;
}
//# sourceMappingURL=workflow-instance.d.ts.map