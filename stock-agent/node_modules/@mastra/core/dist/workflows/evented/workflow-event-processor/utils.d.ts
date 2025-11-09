import type { Workflow } from '../../index.js';
import type { Mastra, Step, StepFlowEntry } from '../../../index.js';
import type { ParentWorkflow } from '.';
export declare function getNestedWorkflow(mastra: Mastra, { workflowId, executionPath, parentWorkflow }: ParentWorkflow): Workflow | null;
export declare function getStep(workflow: Workflow, executionPath: number[]): Step<string, any, any, any, any, any> | null;
export declare function isExecutableStep(step: StepFlowEntry<any>): step is {
    type: "step";
    step: Step;
} | {
    type: "waitForEvent";
    event: string;
    step: Step;
    timeout?: number;
} | {
    type: "foreach";
    step: Step;
    opts: {
        concurrency: number;
    };
} | {
    type: "loop";
    step: Step;
    condition: import("../..").LoopConditionFunction<any, any, any, any, any>;
    serializedCondition: {
        id: string;
        fn: string;
    };
    loopType: "dowhile" | "dountil";
};
//# sourceMappingURL=utils.d.ts.map