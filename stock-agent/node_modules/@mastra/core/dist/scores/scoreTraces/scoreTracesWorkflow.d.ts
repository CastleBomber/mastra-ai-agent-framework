import z from 'zod';
import type { TracingContext } from '../../ai-tracing/index.js';
import type { MastraStorage } from '../../storage/index.js';
import type { MastraScorer } from '../base.js';
export declare function runScorerOnTarget({ storage, scorer, target, tracingContext, }: {
    storage: MastraStorage;
    scorer: MastraScorer;
    target: {
        traceId: string;
        spanId?: string;
    };
    tracingContext: TracingContext;
}): Promise<void>;
export declare const scoreTracesWorkflow: import("../../workflows/evented").EventedWorkflow<import("../../workflows/evented").EventedEngineType, import("../..").Step<"__process-trace-scoring", z.ZodObject<any, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>, z.ZodObject<{
    targets: z.ZodArray<z.ZodObject<{
        traceId: z.ZodString;
        spanId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        traceId: string;
        spanId?: string | undefined;
    }, {
        traceId: string;
        spanId?: string | undefined;
    }>, "many">;
    scorerName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    scorerName: string;
    targets: {
        traceId: string;
        spanId?: string | undefined;
    }[];
}, {
    scorerName: string;
    targets: {
        traceId: string;
        spanId?: string | undefined;
    }[];
}>, z.ZodAny, z.ZodType<any, z.ZodTypeDef, any>, z.ZodType<any, z.ZodTypeDef, any>, import("../../workflows/evented").EventedEngineType>[], "__batch-scoring-traces", z.ZodObject<any, z.UnknownKeysParam, z.ZodTypeAny, {
    [x: string]: any;
}, {
    [x: string]: any;
}>, z.ZodObject<{
    targets: z.ZodArray<z.ZodObject<{
        traceId: z.ZodString;
        spanId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        traceId: string;
        spanId?: string | undefined;
    }, {
        traceId: string;
        spanId?: string | undefined;
    }>, "many">;
    scorerName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    scorerName: string;
    targets: {
        traceId: string;
        spanId?: string | undefined;
    }[];
}, {
    scorerName: string;
    targets: {
        traceId: string;
        spanId?: string | undefined;
    }[];
}>, z.ZodAny, z.ZodObject<{
    targets: z.ZodArray<z.ZodObject<{
        traceId: z.ZodString;
        spanId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        traceId: string;
        spanId?: string | undefined;
    }, {
        traceId: string;
        spanId?: string | undefined;
    }>, "many">;
    scorerName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    scorerName: string;
    targets: {
        traceId: string;
        spanId?: string | undefined;
    }[];
}, {
    scorerName: string;
    targets: {
        traceId: string;
        spanId?: string | undefined;
    }[];
}>>;
//# sourceMappingURL=scoreTracesWorkflow.d.ts.map