import type { RelevanceScoreProvider } from '../relevance-score-provider.js';
/** @deprecated Import from `@mastra/rag` instead */
export declare class CohereRelevanceScorer implements RelevanceScoreProvider {
    private model;
    private apiKey?;
    constructor(model: string, apiKey?: string);
    getRelevanceScore(query: string, text: string): Promise<number>;
}
//# sourceMappingURL=index.d.ts.map