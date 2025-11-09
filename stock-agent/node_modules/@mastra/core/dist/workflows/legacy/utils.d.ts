import { z } from 'zod';
import type { ToolsInput } from '../../agent/index.js';
import { Agent } from '../../agent/index.js';
import type { Metric } from '../../eval/index.js';
import type { IMastraLogger } from '../../logger/index.js';
import type { Mastra } from '../../mastra/index.js';
import type { LegacyStep as Step } from './step.js';
import type { StepAction, StepResult, VariableReference, WorkflowContext, LegacyWorkflowRunResult as WorkflowRunResult } from './types.js';
import { LegacyWorkflow } from './workflow.js';
export declare function isErrorEvent(stateEvent: any): stateEvent is {
    type: `xstate.error.actor.${string}`;
    error: Error;
};
export declare function isTransitionEvent(stateEvent: any): stateEvent is {
    type: `xstate.done.actor.${string}`;
    output?: unknown;
};
export declare function isVariableReference(value: any): value is VariableReference<any, any>;
export declare function getStepResult(result?: StepResult<any>): any;
export declare function getSuspendedPaths({ value, path, suspendedPaths, }: {
    value: string | Record<string, string>;
    path: string;
    suspendedPaths: Set<string>;
}): void;
export declare function isFinalState(status: string): boolean;
export declare function isLimboState(status: string): boolean;
export declare function recursivelyCheckForFinalState({ value, suspendedPaths, path, }: {
    value: string | Record<string, string>;
    suspendedPaths: Set<string>;
    path: string;
}): boolean;
export declare function getActivePathsAndStatus(value: Record<string, any>): Array<{
    stepPath: string[];
    stepId: string;
    status: string;
}>;
export declare function mergeChildValue(startStepId: string, parent: Record<string, any>, child: Record<string, any>): Record<string, any>;
export declare const updateStepInHierarchy: (value: Record<string, any>, targetStepId: string) => Record<string, any>;
export declare function getResultActivePaths(state: {
    value: Record<string, string>;
    context: {
        steps: Record<string, any>;
    };
}): Map<string, {
    status: string;
    suspendPayload?: any;
    stepPath: string[];
}>;
export declare function isWorkflow(step: Step<any, any, any, any> | LegacyWorkflow<any, any, any, any> | Agent<any, any, any>): step is LegacyWorkflow<any, any, any, any>;
export declare function isAgent(step: Step<any, any, any, any> | Agent<any, any, any> | LegacyWorkflow<any, any, any, any>): step is Agent<any, any, any>;
export declare function resolveVariables({ runId, logger, variables, context, }: {
    runId: string;
    logger: IMastraLogger;
    variables: Record<string, VariableReference<any, any>>;
    context: WorkflowContext;
}): Record<string, any>;
export declare function agentToStep<TAgentId extends string = string, TTools extends ToolsInput = ToolsInput, TMetrics extends Record<string, Metric> = Record<string, Metric>>(agent: Agent<TAgentId, TTools, TMetrics>, { mastra }?: {
    mastra?: Mastra;
}): StepAction<TAgentId, z.ZodObject<{
    prompt: z.ZodString;
}>, z.ZodObject<{
    text: z.ZodString;
}>, any>;
export declare function workflowToStep<TSteps extends Step<any, any, any, any>[], TStepId extends string = any, TTriggerSchema extends z.ZodObject<any> = any, TResultSchema extends z.ZodObject<any> = any>(workflow: LegacyWorkflow<TSteps, TStepId, TTriggerSchema, TResultSchema>, { mastra }: {
    mastra?: Mastra;
}): StepAction<TStepId, TTriggerSchema, z.ZodType<WorkflowRunResult<TTriggerSchema, TSteps, TResultSchema>>, any>;
export declare function isConditionalKey(key: string): boolean;
//# sourceMappingURL=utils.d.ts.map