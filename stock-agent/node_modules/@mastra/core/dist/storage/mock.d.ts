import type { MastraMessageV2 } from '../agent/index.js';
import type { MastraMessageV1, StorageThreadType } from '../memory/types.js';
import type { ScoreRowData, ScoringSource } from '../scores/types.js';
import type { Trace } from '../telemetry/index.js';
import type { StepResult, WorkflowRunState } from '../workflows/types.js';
import { MastraStorage } from './base.js';
import type { StorageDomains } from './base.js';
import type { TABLE_NAMES } from './constants.js';
import type { AISpanRecord, AITraceRecord, EvalRow, PaginationArgs, PaginationInfo, StorageColumn, StorageGetMessagesArg, StorageGetTracesPaginatedArg, StoragePagination, StorageResourceType, ThreadSortOptions, WorkflowRun, WorkflowRuns } from './types.js';
export declare class InMemoryStore extends MastraStorage {
    stores: StorageDomains;
    constructor();
    get supports(): {
        selectByIncludeResourceScope: boolean;
        resourceWorkingMemory: boolean;
        hasColumn: boolean;
        createTable: boolean;
        deleteMessages: boolean;
        aiTracing: boolean;
        indexManagement: boolean;
        getScoresBySpan: boolean;
    };
    persistWorkflowSnapshot({ workflowName, runId, resourceId, snapshot, }: {
        workflowName: string;
        runId: string;
        resourceId?: string;
        snapshot: WorkflowRunState;
    }): Promise<void>;
    loadWorkflowSnapshot({ workflowName, runId, }: {
        workflowName: string;
        runId: string;
    }): Promise<WorkflowRunState | null>;
    createTable({ tableName, schema, }: {
        tableName: TABLE_NAMES;
        schema: Record<string, StorageColumn>;
    }): Promise<void>;
    alterTable({ tableName, schema, ifNotExists, }: {
        tableName: TABLE_NAMES;
        schema: Record<string, StorageColumn>;
        ifNotExists: string[];
    }): Promise<void>;
    clearTable({ tableName }: {
        tableName: TABLE_NAMES;
    }): Promise<void>;
    dropTable({ tableName }: {
        tableName: TABLE_NAMES;
    }): Promise<void>;
    insert({ tableName, record }: {
        tableName: TABLE_NAMES;
        record: Record<string, any>;
    }): Promise<void>;
    updateWorkflowResults({ workflowName, runId, stepId, result, runtimeContext, }: {
        workflowName: string;
        runId: string;
        stepId: string;
        result: StepResult<any, any, any, any>;
        runtimeContext: Record<string, any>;
    }): Promise<Record<string, StepResult<any, any, any, any>>>;
    updateWorkflowState({ workflowName, runId, opts, }: {
        workflowName: string;
        runId: string;
        opts: {
            status: string;
            result?: StepResult<any, any, any, any>;
            error?: string;
            suspendedPaths?: Record<string, number[]>;
            waitingPaths?: Record<string, number[]>;
        };
    }): Promise<WorkflowRunState | undefined>;
    batchInsert({ tableName, records }: {
        tableName: TABLE_NAMES;
        records: Record<string, any>[];
    }): Promise<void>;
    load<R>({ tableName, keys }: {
        tableName: TABLE_NAMES;
        keys: Record<string, string>;
    }): Promise<R | null>;
    getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    getThreadsByResourceId({ resourceId, orderBy, sortDirection, }: {
        resourceId: string;
    } & ThreadSortOptions): Promise<StorageThreadType[]>;
    saveThread({ thread }: {
        thread: StorageThreadType;
    }): Promise<StorageThreadType>;
    updateThread({ id, title, metadata, }: {
        id: string;
        title: string;
        metadata: Record<string, unknown>;
    }): Promise<StorageThreadType>;
    deleteThread({ threadId }: {
        threadId: string;
    }): Promise<void>;
    getResourceById({ resourceId }: {
        resourceId: string;
    }): Promise<StorageResourceType | null>;
    saveResource({ resource }: {
        resource: StorageResourceType;
    }): Promise<StorageResourceType>;
    updateResource({ resourceId, workingMemory, metadata, }: {
        resourceId: string;
        workingMemory?: string;
        metadata?: Record<string, unknown>;
    }): Promise<StorageResourceType>;
    getMessages(args: StorageGetMessagesArg & {
        format?: 'v1';
    }): Promise<MastraMessageV1[]>;
    getMessages(args: StorageGetMessagesArg & {
        format: 'v2';
    }): Promise<MastraMessageV2[]>;
    getMessagesById({ messageIds, format }: {
        messageIds: string[];
        format: 'v1';
    }): Promise<MastraMessageV1[]>;
    getMessagesById({ messageIds, format }: {
        messageIds: string[];
        format?: 'v2';
    }): Promise<MastraMessageV2[]>;
    saveMessages(args: {
        messages: MastraMessageV1[];
        format?: undefined | 'v1';
    }): Promise<MastraMessageV1[]>;
    saveMessages(args: {
        messages: MastraMessageV2[];
        format: 'v2';
    }): Promise<MastraMessageV2[]>;
    updateMessages(args: {
        messages: Partial<MastraMessageV2> & {
            id: string;
        }[];
    }): Promise<MastraMessageV2[]>;
    deleteMessages(messageIds: string[]): Promise<void>;
    getThreadsByResourceIdPaginated(args: {
        resourceId: string;
        page: number;
        perPage: number;
    } & ThreadSortOptions): Promise<PaginationInfo & {
        threads: StorageThreadType[];
    }>;
    getMessagesPaginated({ threadId, selectBy, }: StorageGetMessagesArg & {
        format?: 'v1' | 'v2';
    }): Promise<PaginationInfo & {
        messages: MastraMessageV1[] | MastraMessageV2[];
    }>;
    getTraces({ name, scope, page, perPage, attributes, filters, fromDate, toDate, }: {
        name?: string;
        scope?: string;
        page: number;
        perPage: number;
        attributes?: Record<string, string>;
        filters?: Record<string, any>;
        fromDate?: Date;
        toDate?: Date;
    }): Promise<any[]>;
    getTracesPaginated(args: StorageGetTracesPaginatedArg): Promise<PaginationInfo & {
        traces: Trace[];
    }>;
    batchTraceInsert(args: {
        records: Record<string, any>[];
    }): Promise<void>;
    getScoreById({ id }: {
        id: string;
    }): Promise<ScoreRowData | null>;
    saveScore(score: ScoreRowData): Promise<{
        score: ScoreRowData;
    }>;
    getScoresByScorerId({ scorerId, entityId, entityType, source, pagination, }: {
        scorerId: string;
        entityId?: string;
        entityType?: string;
        source?: ScoringSource;
        pagination: StoragePagination;
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
    getEvals(options: {
        agentName?: string;
        type?: 'test' | 'live';
    } & PaginationArgs): Promise<PaginationInfo & {
        evals: EvalRow[];
    }>;
    getEvalsByAgentName(agentName: string, type?: 'test' | 'live'): Promise<EvalRow[]>;
    getWorkflowRuns({ workflowName, fromDate, toDate, limit, offset, resourceId, }?: {
        workflowName?: string;
        fromDate?: Date;
        toDate?: Date;
        limit?: number;
        offset?: number;
        resourceId?: string;
    }): Promise<WorkflowRuns>;
    getWorkflowRunById({ runId, workflowName, }: {
        runId: string;
        workflowName?: string;
    }): Promise<WorkflowRun | null>;
    createAISpan(span: AISpanRecord): Promise<void>;
    updateAISpan(params: {
        spanId: string;
        traceId: string;
        updates: Partial<Omit<AISpanRecord, 'spanId' | 'traceId'>>;
    }): Promise<void>;
    getAITrace(traceId: string): Promise<AITraceRecord | null>;
    batchCreateAISpans(args: {
        records: AISpanRecord[];
    }): Promise<void>;
    batchUpdateAISpans(args: {
        records: {
            traceId: string;
            spanId: string;
            updates: Partial<Omit<AISpanRecord, 'spanId' | 'traceId'>>;
        }[];
    }): Promise<void>;
    batchDeleteAITraces(args: {
        traceIds: string[];
    }): Promise<void>;
}
export declare const MockStore: typeof InMemoryStore;
//# sourceMappingURL=mock.d.ts.map