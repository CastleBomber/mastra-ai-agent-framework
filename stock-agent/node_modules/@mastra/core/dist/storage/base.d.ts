import type { MastraMessageContentV2, MastraMessageV2 } from '../agent/index.js';
import type { TracingStrategy } from '../ai-tracing/index.js';
import { MastraBase } from '../base.js';
import type { MastraMessageV1, StorageThreadType } from '../memory/types.js';
import type { ScoreRowData, ScoringSource, ValidatedSaveScorePayload } from '../scores/index.js';
import type { Trace } from '../telemetry/index.js';
import type { StepResult, WorkflowRunState } from '../workflows/types.js';
import type { TABLE_NAMES } from './constants.js';
import type { ScoresStorage, StoreOperations, WorkflowsStorage, TracesStorage, MemoryStorage, LegacyEvalsStorage, ObservabilityStorage } from './domains/index.js';
import type { EvalRow, PaginationInfo, StorageColumn, StorageGetMessagesArg, StorageResourceType, StoragePagination, ThreadSortOptions, WorkflowRun, WorkflowRuns, StorageGetTracesArg, PaginationArgs, StorageGetTracesPaginatedArg, AISpanRecord, AITraceRecord, AITracesPaginatedArg, CreateIndexOptions, IndexInfo, StorageIndexStats, UpdateAISpanRecord, CreateAISpanRecord } from './types.js';
export type StorageDomains = {
    legacyEvals: LegacyEvalsStorage;
    operations: StoreOperations;
    workflows: WorkflowsStorage;
    scores: ScoresStorage;
    traces: TracesStorage;
    memory: MemoryStorage;
    observability?: ObservabilityStorage;
};
export declare function ensureDate(date: Date | string | undefined): Date | undefined;
export declare function serializeDate(date: Date | string | undefined): string | undefined;
export declare function resolveMessageLimit({ last, defaultLimit, }: {
    last: number | false | undefined;
    defaultLimit: number;
}): number;
export declare abstract class MastraStorage extends MastraBase {
    /** @deprecated import from { TABLE_WORKFLOW_SNAPSHOT } '@mastra/core/storage' instead */
    static readonly TABLE_WORKFLOW_SNAPSHOT = "mastra_workflow_snapshot";
    /** @deprecated import from { TABLE_EVALS } '@mastra/core/storage' instead */
    static readonly TABLE_EVALS = "mastra_evals";
    /** @deprecated import from { TABLE_MESSAGES } '@mastra/core/storage' instead */
    static readonly TABLE_MESSAGES = "mastra_messages";
    /** @deprecated import from { TABLE_THREADS } '@mastra/core/storage' instead */
    static readonly TABLE_THREADS = "mastra_threads";
    /** @deprecated import { TABLE_TRACES } from '@mastra/core/storage' instead */
    static readonly TABLE_TRACES = "mastra_traces";
    protected hasInitialized: null | Promise<boolean>;
    protected shouldCacheInit: boolean;
    stores?: StorageDomains;
    constructor({ name }: {
        name: string;
    });
    get supports(): {
        selectByIncludeResourceScope: boolean;
        resourceWorkingMemory: boolean;
        hasColumn: boolean;
        createTable: boolean;
        deleteMessages: boolean;
        aiTracing?: boolean;
        indexManagement?: boolean;
        getScoresBySpan?: boolean;
    };
    protected ensureDate(date: Date | string | undefined): Date | undefined;
    protected serializeDate(date: Date | string | undefined): string | undefined;
    /**
     * Resolves limit for how many messages to fetch
     *
     * @param last The number of messages to fetch
     * @param defaultLimit The default limit to use if last is not provided
     * @returns The resolved limit
     */
    protected resolveMessageLimit({ last, defaultLimit, }: {
        last: number | false | undefined;
        defaultLimit: number;
    }): number;
    protected getSqlType(type: StorageColumn['type']): string;
    protected getDefaultValue(type: StorageColumn['type']): string;
    abstract createTable({ tableName }: {
        tableName: TABLE_NAMES;
        schema: Record<string, StorageColumn>;
    }): Promise<void>;
    abstract clearTable({ tableName }: {
        tableName: TABLE_NAMES;
    }): Promise<void>;
    abstract dropTable({ tableName }: {
        tableName: TABLE_NAMES;
    }): Promise<void>;
    abstract alterTable(args: {
        tableName: TABLE_NAMES;
        schema: Record<string, StorageColumn>;
        ifNotExists: string[];
    }): Promise<void>;
    abstract insert({ tableName, record }: {
        tableName: TABLE_NAMES;
        record: Record<string, any>;
    }): Promise<void>;
    abstract batchInsert({ tableName, records, }: {
        tableName: TABLE_NAMES;
        records: Record<string, any>[];
    }): Promise<void>;
    batchTraceInsert({ records }: {
        records: Record<string, any>[];
    }): Promise<void>;
    abstract load<R>({ tableName, keys }: {
        tableName: TABLE_NAMES;
        keys: Record<string, any>;
    }): Promise<R | null>;
    abstract getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    abstract getThreadsByResourceId({ resourceId, orderBy, sortDirection, }: {
        resourceId: string;
    } & ThreadSortOptions): Promise<StorageThreadType[]>;
    abstract saveThread({ thread }: {
        thread: StorageThreadType;
    }): Promise<StorageThreadType>;
    abstract updateThread({ id, title, metadata, }: {
        id: string;
        title: string;
        metadata: Record<string, unknown>;
    }): Promise<StorageThreadType>;
    abstract deleteThread({ threadId }: {
        threadId: string;
    }): Promise<void>;
    getResourceById(_: {
        resourceId: string;
    }): Promise<StorageResourceType | null>;
    saveResource(_: {
        resource: StorageResourceType;
    }): Promise<StorageResourceType>;
    updateResource(_: {
        resourceId: string;
        workingMemory?: string;
        metadata?: Record<string, unknown>;
    }): Promise<StorageResourceType>;
    abstract getMessages(args: StorageGetMessagesArg & {
        format?: 'v1';
    }): Promise<MastraMessageV1[]>;
    abstract getMessages(args: StorageGetMessagesArg & {
        format: 'v2';
    }): Promise<MastraMessageV2[]>;
    abstract getMessages({ threadId, resourceId, selectBy, format, }: StorageGetMessagesArg & {
        format?: 'v1' | 'v2';
    }): Promise<MastraMessageV1[] | MastraMessageV2[]>;
    abstract getMessagesById({ messageIds }: {
        messageIds: string[];
        format: 'v1';
    }): Promise<MastraMessageV1[]>;
    abstract getMessagesById({ messageIds }: {
        messageIds: string[];
        format?: 'v2';
    }): Promise<MastraMessageV2[]>;
    abstract getMessagesById({ messageIds, }: {
        messageIds: string[];
        format?: 'v1' | 'v2';
    }): Promise<MastraMessageV1[] | MastraMessageV2[]>;
    abstract saveMessages(args: {
        messages: MastraMessageV1[];
        format?: undefined | 'v1';
    }): Promise<MastraMessageV1[]>;
    abstract saveMessages(args: {
        messages: MastraMessageV2[];
        format: 'v2';
    }): Promise<MastraMessageV2[]>;
    abstract saveMessages(args: {
        messages: MastraMessageV1[];
        format?: undefined | 'v1';
    } | {
        messages: MastraMessageV2[];
        format: 'v2';
    }): Promise<MastraMessageV2[] | MastraMessageV1[]>;
    abstract updateMessages(args: {
        messages: Partial<Omit<MastraMessageV2, 'createdAt'>> & {
            id: string;
            content?: {
                metadata?: MastraMessageContentV2['metadata'];
                content?: MastraMessageContentV2['content'];
            };
        }[];
    }): Promise<MastraMessageV2[]>;
    deleteMessages(_messageIds: string[]): Promise<void>;
    abstract getTraces(args: StorageGetTracesArg): Promise<Trace[]>;
    abstract getTracesPaginated(args: StorageGetTracesPaginatedArg): Promise<PaginationInfo & {
        traces: Trace[];
    }>;
    init(): Promise<void>;
    persistWorkflowSnapshot({ workflowName, runId, resourceId, snapshot, }: {
        workflowName: string;
        runId: string;
        resourceId?: string;
        snapshot: WorkflowRunState;
    }): Promise<void>;
    abstract updateWorkflowResults({ workflowName, runId, stepId, result, }: {
        workflowName: string;
        runId: string;
        stepId: string;
        result: StepResult<any, any, any, any>;
        runtimeContext: Record<string, any>;
    }): Promise<Record<string, StepResult<any, any, any, any>>>;
    abstract updateWorkflowState({ workflowName, runId, opts, }: {
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
    loadWorkflowSnapshot({ workflowName, runId, }: {
        workflowName: string;
        runId: string;
    }): Promise<WorkflowRunState | null>;
    /**
     * SCORERS
     */
    abstract getScoreById({ id }: {
        id: string;
    }): Promise<ScoreRowData | null>;
    abstract saveScore(score: ValidatedSaveScorePayload): Promise<{
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
    abstract getEvals(options: {
        agentName?: string;
        type?: 'test' | 'live';
    } & PaginationArgs): Promise<PaginationInfo & {
        evals: EvalRow[];
    }>;
    abstract getEvalsByAgentName(agentName: string, type?: 'test' | 'live'): Promise<EvalRow[]>;
    abstract getWorkflowRuns(args?: {
        workflowName?: string;
        fromDate?: Date;
        toDate?: Date;
        limit?: number;
        offset?: number;
        resourceId?: string;
    }): Promise<WorkflowRuns>;
    abstract getWorkflowRunById(args: {
        runId: string;
        workflowName?: string;
    }): Promise<WorkflowRun | null>;
    abstract getThreadsByResourceIdPaginated(args: {
        resourceId: string;
        page: number;
        perPage: number;
    } & ThreadSortOptions): Promise<PaginationInfo & {
        threads: StorageThreadType[];
    }>;
    abstract getMessagesPaginated(args: StorageGetMessagesArg & {
        format?: 'v1' | 'v2';
    }): Promise<PaginationInfo & {
        messages: MastraMessageV1[] | MastraMessageV2[];
    }>;
    /**
     * OBSERVABILITY
     */
    /**
     * Provides hints for AI tracing strategy selection by the DefaultExporter.
     * Storage adapters can override this to specify their preferred and supported strategies.
     */
    get aiTracingStrategy(): {
        preferred: TracingStrategy;
        supported: TracingStrategy[];
    };
    /**
     * Creates a single AI span record in the storage provider.
     */
    createAISpan(span: CreateAISpanRecord): Promise<void>;
    /**
     * Updates a single AI span with partial data. Primarily used for realtime trace creation.
     */
    updateAISpan(params: {
        spanId: string;
        traceId: string;
        updates: Partial<UpdateAISpanRecord>;
    }): Promise<void>;
    /**
     * Retrieves a single AI trace with all its associated spans.
     */
    getAITrace(traceId: string): Promise<AITraceRecord | null>;
    /**
     * Retrieves a paginated list of AI traces with optional filtering.
     */
    getAITracesPaginated(args: AITracesPaginatedArg): Promise<{
        pagination: PaginationInfo;
        spans: AISpanRecord[];
    }>;
    /**
     * Creates multiple AI spans in a single batch.
     */
    batchCreateAISpans(args: {
        records: CreateAISpanRecord[];
    }): Promise<void>;
    /**
     * Updates multiple AI spans in a single batch.
     */
    batchUpdateAISpans(args: {
        records: {
            traceId: string;
            spanId: string;
            updates: Partial<UpdateAISpanRecord>;
        }[];
    }): Promise<void>;
    /**
     * Deletes multiple AI traces and all their associated spans in a single batch operation.
     */
    batchDeleteAITraces(args: {
        traceIds: string[];
    }): Promise<void>;
    /**
     * DATABASE INDEX MANAGEMENT
     * These methods delegate to the operations store for index management.
     * Storage adapters that support indexes should implement these in their operations class.
     */
    /**
     * Creates a database index on specified columns
     * @throws {MastraError} if not supported by the storage adapter
     */
    createIndex(options: CreateIndexOptions): Promise<void>;
    /**
     * Drops a database index by name
     * @throws {MastraError} if not supported by the storage adapter
     */
    dropIndex(indexName: string): Promise<void>;
    /**
     * Lists database indexes for a table or all tables
     * @throws {MastraError} if not supported by the storage adapter
     */
    listIndexes(tableName?: string): Promise<IndexInfo[]>;
    /**
     * Gets detailed statistics for a specific index
     * @throws {MastraError} if not supported by the storage adapter
     */
    describeIndex(indexName: string): Promise<StorageIndexStats>;
}
//# sourceMappingURL=base.d.ts.map