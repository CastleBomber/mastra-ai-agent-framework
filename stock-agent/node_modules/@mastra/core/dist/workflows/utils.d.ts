import type z from 'zod';
import type { ExecutionGraph } from './execution-engine.js';
import type { Step } from './step.js';
import type { StepFlowEntry, TimeTravelContext, TimeTravelExecutionParams, WorkflowRunState } from './types.js';
export declare function getZodErrors(error: z.ZodError): z.ZodIssue[];
export declare function validateStepInput({ prevOutput, step, validateInputs, }: {
    prevOutput: any;
    step: Step<string, any, any>;
    validateInputs: boolean;
}): Promise<{
    inputData: any;
    validationError: Error | undefined;
}>;
export declare function validateStepResumeData({ resumeData, step }: {
    resumeData?: any;
    step: Step<string, any, any>;
}): Promise<{
    resumeData: any;
    validationError: Error | undefined;
}>;
export declare function getResumeLabelsByStepId(resumeLabels: Record<string, {
    stepId: string;
    foreachIndex?: number;
}>, stepId: string): Record<string, {
    stepId: string;
    foreachIndex?: number;
}>;
export declare const getStepIds: (entry: StepFlowEntry) => string[];
export declare const createTimeTravelExecutionParams: (params: {
    steps: string[];
    inputData?: any;
    resumeData?: any;
    context?: TimeTravelContext<any, any, any, any>;
    nestedStepsContext?: Record<string, TimeTravelContext<any, any, any, any>>;
    snapshot: WorkflowRunState;
    initialState?: any;
    graph: ExecutionGraph;
}) => TimeTravelExecutionParams;
//# sourceMappingURL=utils.d.ts.map