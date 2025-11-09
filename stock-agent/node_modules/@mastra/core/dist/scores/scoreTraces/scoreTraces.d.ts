import type { Mastra } from '../../mastra/index.js';
export declare function scoreTraces({ scorerName, targets, mastra, }: {
    scorerName: string;
    targets: {
        traceId: string;
        spanId?: string;
    }[];
    mastra: Mastra;
}): Promise<void>;
//# sourceMappingURL=scoreTraces.d.ts.map