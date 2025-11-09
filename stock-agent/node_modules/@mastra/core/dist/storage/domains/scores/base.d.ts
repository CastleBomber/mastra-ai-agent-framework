import { MastraBase } from '../../../base.js';
import type { ScoreRowData, ScoringSource } from '../../../scores/types.js';
import type { PaginationInfo, StoragePagination } from '../../types.js';
export declare abstract class ScoresStorage extends MastraBase {
    constructor();
    abstract getScoreById({ id }: {
        id: string;
    }): Promise<ScoreRowData | null>;
    abstract saveScore(score: Omit<ScoreRowData, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
        score: ScoreRowData;
    }>;
    abstract getScoresByScorerId({ scorerId, pagination, entityId, entityType, source, }: {
        scorerId: string;
        pagination: StoragePagination;
        entityId?: string;
        entityType?: string;
        source?: ScoringSource;
    }): Promise<{
        pagination: PaginationInfo;
        scores: ScoreRowData[];
    }>;
    abstract getScoresByRunId({ runId, pagination, }: {
        runId: string;
        pagination: StoragePagination;
    }): Promise<{
        pagination: PaginationInfo;
        scores: ScoreRowData[];
    }>;
    abstract getScoresByEntityId({ entityId, entityType, pagination, }: {
        pagination: StoragePagination;
        entityId: string;
        entityType: string;
    }): Promise<{
        pagination: PaginationInfo;
        scores: ScoreRowData[];
    }>;
    getScoresBySpan({ traceId, spanId, pagination: _pagination, }: {
        traceId: string;
        spanId: string;
        pagination: StoragePagination;
    }): Promise<{
        pagination: PaginationInfo;
        scores: ScoreRowData[];
    }>;
}
//# sourceMappingURL=base.d.ts.map