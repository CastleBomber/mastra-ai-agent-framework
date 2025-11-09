import type { Mastra } from '../../mastra/index.js';
import type { ZodLikeSchema, InferZodLikeSchema } from '../../types/zod-compat.js';
import type { RetryConfig, StepAction, StepExecutionContext } from './types.js';
export declare class LegacyStep<TStepId extends string = any, TSchemaIn extends ZodLikeSchema | undefined = undefined, TSchemaOut extends ZodLikeSchema | undefined = undefined, TContext extends StepExecutionContext<TSchemaIn> = StepExecutionContext<TSchemaIn>> implements StepAction<TStepId, TSchemaIn, TSchemaOut, TContext> {
    id: TStepId;
    description?: string;
    inputSchema?: TSchemaIn;
    outputSchema?: TSchemaOut;
    payload?: TSchemaIn extends ZodLikeSchema ? Partial<InferZodLikeSchema<TSchemaIn>> : unknown;
    execute: (context: TContext) => Promise<TSchemaOut extends ZodLikeSchema ? InferZodLikeSchema<TSchemaOut> : unknown>;
    retryConfig?: RetryConfig;
    mastra?: Mastra;
    constructor({ id, description, execute, payload, outputSchema, inputSchema, retryConfig, }: StepAction<TStepId, TSchemaIn, TSchemaOut, TContext>);
}
//# sourceMappingURL=step.d.ts.map