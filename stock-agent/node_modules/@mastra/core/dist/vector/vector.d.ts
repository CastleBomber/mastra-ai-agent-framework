import type { EmbeddingModelV2 } from '@ai-sdk/provider-v5';
import type { EmbeddingModel as EmbeddingModelV1 } from 'ai';
import { MastraBase } from '../base.js';
import type { VectorFilter } from './filter/index.js';
import type { CreateIndexParams, UpsertVectorParams, QueryVectorParams, IndexStats, QueryResult, UpdateVectorParams, DeleteVectorParams, DescribeIndexParams, DeleteIndexParams } from './types.js';
export type MastraEmbeddingModel<T> = EmbeddingModelV1<T> | EmbeddingModelV2<T>;
export declare abstract class MastraVector<Filter = VectorFilter> extends MastraBase {
    constructor();
    get indexSeparator(): string;
    abstract query(params: QueryVectorParams<Filter>): Promise<QueryResult[]>;
    abstract upsert(params: UpsertVectorParams): Promise<string[]>;
    abstract createIndex(params: CreateIndexParams): Promise<void>;
    abstract listIndexes(): Promise<string[]>;
    abstract describeIndex(params: DescribeIndexParams): Promise<IndexStats>;
    abstract deleteIndex(params: DeleteIndexParams): Promise<void>;
    abstract updateVector(params: UpdateVectorParams): Promise<void>;
    abstract deleteVector(params: DeleteVectorParams): Promise<void>;
    protected validateExistingIndex(indexName: string, dimension: number, metric: string): Promise<void>;
}
//# sourceMappingURL=vector.d.ts.map