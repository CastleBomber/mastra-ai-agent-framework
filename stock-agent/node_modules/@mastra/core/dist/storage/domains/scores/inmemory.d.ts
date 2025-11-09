import type { ScoreRowData, ScoringSource } from '../../../scores/types.js';
import type { PaginationInfo, StoragePagination } from '../../types.js';
import { ScoresStorage } from './base.js';
export type InMemoryScores = Map<string, ScoreRowData>;
export declare class ScoresInMemory extends ScoresStorage {
    scores: InMemoryScores;
    constructor({ collection }: {
        collection: InMemoryScores;
    });
    getScoreById({ id }: {
        id: string;
    }): Promise<ScoreRowData | null>;
    saveScore(score: Omit<ScoreRowData, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
        score: ScoreRowData;
    }>;
    getScoresByScorerId({ scorerId, pagination, entityId, entityType, source, }: {
        scorerId: string;
        pagination: StoragePagination;
        entityId?: string;
        entityType?: string;
        source?: ScoringSource;
    }): Promise<{
        pagination: PaginationInfo;
        scores: ScoreRowData[];
    }>;
    getScoresByRunId({ runId, pagination, }: {
        runId: string;
        pagination: StoragePagination;
    }): Promise<{
        pagination: PaginationInfo;
        scores: ScoreRowData[];
    }>;
    getScoresByEntityId({ entityId, entityType, pagination, }: {
        entityId: string;
        entityType: string;
        pagination: StoragePagination;
    }): Promise<{
        pagination: PaginationInfo;
        scores: ScoreRowData[];
    }>;
    getScoresBySpan({ traceId, spanId, pagination, }: {
        traceId: string;
        spanId: string;
        pagination: StoragePagination;
    }): Promise<{
        pagination: PaginationInfo;
        scores: ScoreRowData[];
    }>;
}
//# sourceMappingURL=inmemory.d.ts.map