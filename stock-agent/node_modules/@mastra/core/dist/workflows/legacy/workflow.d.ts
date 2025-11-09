import type { Span } from '@opentelemetry/api';
import { z } from 'zod';
import type { MastraPrimitives } from '../../action/index.js';
import type { Agent } from '../../agent/index.js';
import { MastraBase } from '../../base.js';
import type { Mastra } from '../../mastra/index.js';
import { RuntimeContext } from '../../runtime-context/index.js';
import type { LegacyWorkflowRuns } from '../../storage/index.js';
import { LegacyStep as Step } from './step.js';
import type { StepAction, StepConfig, StepGraph, StepVariableType, WorkflowOptions, LegacyWorkflowRunResult as WorkflowRunResult, LegacyWorkflowRunState as WorkflowRunState } from './types.js';
import type { WorkflowResultReturn } from './workflow-instance.js';
import { WorkflowInstance } from './workflow-instance.js';
type WorkflowBuilder<T extends LegacyWorkflow<any, any>> = Pick<T, 'step' | 'then' | 'after' | 'while' | 'until' | 'if' | 'else' | 'afterEvent' | 'commit'>;
export declare class LegacyWorkflow<TSteps extends Step<string, any, any>[] = Step<string, any, any>[], TStepId extends string = string, TTriggerSchema extends z.ZodObject<any> = any, TResultSchema extends z.ZodObject<any> = any> extends MastraBase {
    #private;
    name: TStepId;
    triggerSchema?: TTriggerSchema;
    resultSchema?: TResultSchema;
    resultMapping?: Record<string, {
        step: StepAction<string, any, any, any>;
        path: string;
    }>;
    events?: Record<string, {
        schema: z.ZodObject<any>;
    }>;
    isNested: boolean;
    /**
     * Creates a new LegacyWorkflow instance
     * @param name - Identifier for the workflow (not necessarily unique)
     * @param logger - Optional logger instance
     */
    constructor({ name, triggerSchema, result, retryConfig, mastra, events, }: WorkflowOptions<TStepId, TSteps, TTriggerSchema, TResultSchema>);
    step<TWorkflow extends LegacyWorkflow<any, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>, Steps extends StepAction<any, any, any, any>[] = TSteps>(next: TWorkflow, config?: StepConfig<ReturnType<TWorkflow['toStep']>, CondStep, VarStep, TTriggerSchema, Steps>): WorkflowBuilder<this>;
    step<TAgent extends Agent<any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>, Steps extends StepAction<any, any, any, any>[] = TSteps>(next: TAgent, config?: StepConfig<ReturnType<TAgent['toStep']>, CondStep, VarStep, TTriggerSchema, Steps>): WorkflowBuilder<this>;
    step<TStep extends StepAction<any, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>, Steps extends StepAction<any, any, any, any>[] = TSteps>(step: TStep, config?: StepConfig<TStep, CondStep, VarStep, TTriggerSchema, Steps>): WorkflowBuilder<this>;
    then<TStep extends StepAction<string, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(next: TStep | TStep[], config?: StepConfig<TStep, CondStep, VarStep, TTriggerSchema>): this;
    then<TWorkflow extends LegacyWorkflow<any, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(next: TWorkflow | TWorkflow[], config?: StepConfig<StepAction<string, any, any, any>, CondStep, VarStep, TTriggerSchema>): this;
    then<TAgent extends Agent<any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(next: TAgent | TAgent[], config?: StepConfig<StepAction<string, any, any, any>, CondStep, VarStep, TTriggerSchema>): this;
    private loop;
    while<FallbackStep extends StepAction<string, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(condition: StepConfig<FallbackStep, CondStep, VarStep, TTriggerSchema, TSteps>['when'], fallbackStep: FallbackStep, variables?: StepConfig<FallbackStep, CondStep, VarStep, TTriggerSchema, TSteps>['variables']): Pick<WorkflowBuilder<this>, "then" | "commit">;
    until<FallbackStep extends StepAction<string, any, any, any>, CondStep extends StepVariableType<any, any, any, any>, VarStep extends StepVariableType<any, any, any, any>>(condition: StepConfig<FallbackStep, CondStep, VarStep, TTriggerSchema, TSteps>['when'], fallbackStep: FallbackStep, variables?: StepConfig<FallbackStep, CondStep, VarStep, TTriggerSchema, TSteps>['variables']): Pick<WorkflowBuilder<this>, "then" | "commit">;
    if<TStep extends StepAction<string, any, any, any>>(condition: StepConfig<TStep, any, any, TTriggerSchema>['when'], ifStep?: TStep | LegacyWorkflow, elseStep?: TStep | LegacyWorkflow): this | WorkflowBuilder<this>;
    else(): WorkflowBuilder<this>;
    after<TStep extends StepAction<string, any, any, any>>(steps: string | TStep | TStep[] | (TStep | string)[]): Omit<WorkflowBuilder<this>, 'then' | 'after'>;
    after<TWorkflow extends LegacyWorkflow<any, any, any, any>>(steps: TWorkflow | TWorkflow[]): Omit<WorkflowBuilder<this>, 'then' | 'after'>;
    after<TAgent extends Agent<any, any, any>>(steps: TAgent | TAgent[]): Omit<WorkflowBuilder<this>, 'then' | 'after'>;
    afterEvent(eventName: string): WorkflowBuilder<this>;
    /**
     * Executes the workflow with the given trigger data
     * @param triggerData - Initial data to start the workflow with
     * @returns Promise resolving to workflow results or rejecting with error
     * @throws Error if trigger schema validation fails
     */
    createRun({ runId, events, }?: {
        runId?: string;
        events?: Record<string, {
            schema: z.ZodObject<any>;
        }>;
    }): WorkflowResultReturn<TResultSchema, TTriggerSchema, TSteps>;
    /**
     * Gets a workflow run instance by ID
     * @param runId - ID of the run to retrieve
     * @returns The workflow run instance if found, undefined otherwise
     */
    getRun(runId: string): Promise<WorkflowInstance<TSteps, TTriggerSchema, any> | import("../..").WorkflowRun | null>;
    /**
     * Gets a workflow run instance by ID, from memory
     * @param runId - ID of the run to retrieve
     * @returns The workflow run instance if found, undefined otherwise
     */
    getMemoryRun(runId: string): WorkflowInstance<TSteps, TTriggerSchema, any> | undefined;
    /**
     * Rebuilds the machine with the current steps configuration and validates the workflow
     *
     * This is the last step of a workflow builder method chain
     * @throws Error if validation fails
     *
     * @returns this instance for method chaining
     */
    commit(): this;
    getWorkflowRuns(args?: {
        fromDate?: Date;
        toDate?: Date;
        limit?: number;
        offset?: number;
        resourceId?: string;
    }): Promise<LegacyWorkflowRuns>;
    getExecutionSpan(runId: string): Span | undefined;
    getState(runId: string): Promise<WorkflowRunState | null>;
    resume({ runId, stepId, context: resumeContext, runtimeContext, }: {
        runId: string;
        stepId: string;
        context?: Record<string, any>;
        runtimeContext: RuntimeContext;
    }): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, any>, "runId"> | undefined>;
    watch(onTransition: (state: Pick<WorkflowRunResult<TTriggerSchema, TSteps, TResultSchema>, 'results' | 'activePaths' | 'runId' | 'timestamp'>) => void): () => void;
    resumeWithEvent(runId: string, eventName: string, data: any): Promise<Omit<WorkflowRunResult<TTriggerSchema, TSteps, any>, "runId"> | undefined>;
    __registerMastra(mastra: Mastra): void;
    __registerPrimitives(p: MastraPrimitives): void;
    get stepGraph(): StepGraph;
    get stepSubscriberGraph(): Record<string, StepGraph>;
    get serializedStepGraph(): StepGraph;
    get serializedStepSubscriberGraph(): Record<string, StepGraph>;
    get steps(): Record<string, StepAction<string, any, any, any>>;
    setNested(isNested: boolean): void;
    toStep(): Step<TStepId, TTriggerSchema, z.ZodType<WorkflowRunResult<TTriggerSchema, TSteps, TResultSchema>>, any>;
}
export {};
//# sourceMappingURL=workflow.d.ts.map