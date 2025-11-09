import type { z } from 'zod';
import type { Step } from './step.js';
import type { DefaultEngineType, WorkflowConfig } from './types.js';
import { Workflow as BaseWorkflow } from './workflow.js';
export * from './index.js';
export declare class Workflow<TEngineType = DefaultEngineType, TSteps extends Step<string, any, any, any, any, any, TEngineType>[] = Step<string, any, any, any, any, any, TEngineType>[], TWorkflowId extends string = string, TState extends z.ZodObject<any> = z.ZodObject<any>, TInput extends z.ZodType<any> = z.ZodType<any>, TOutput extends z.ZodType<any> = z.ZodType<any>, TPrevSchema extends z.ZodType<any> = TInput> extends BaseWorkflow<TEngineType, TSteps, TWorkflowId, TState, TInput, TOutput, TPrevSchema> {
    constructor(args: WorkflowConfig<TWorkflowId, TState, TInput, TOutput, TSteps>);
}
//# sourceMappingURL=workflow.warning.d.ts.map