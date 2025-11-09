import type { TracingContext } from '../ai-tracing/types.js';
import type { MastraScorerEntry } from './base.js';
import type { ScoringEntityType, ScoringSource } from './types.js';
export declare function runScorer({ runId, scorerId, scorerObject, input, output, runtimeContext, entity, structuredOutput, source, entityType, threadId, resourceId, tracingContext, }: {
    scorerId: string;
    scorerObject: MastraScorerEntry;
    runId: string;
    input: any;
    output: any;
    runtimeContext: Record<string, any>;
    entity: Record<string, any>;
    structuredOutput: boolean;
    source: ScoringSource;
    entityType: ScoringEntityType;
    threadId?: string;
    resourceId?: string;
    tracingContext?: TracingContext;
}): void;
//# sourceMappingURL=hooks.d.ts.map