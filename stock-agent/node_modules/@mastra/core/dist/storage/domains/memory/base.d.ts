import type { MastraMessageContentV2 } from '../../../agent/index.js';
import { MastraBase } from '../../../base.js';
import type { MastraMessageV1, MastraMessageV2, StorageThreadType } from '../../../memory/types.js';
import type { StorageGetMessagesArg, PaginationInfo, StorageResourceType, ThreadOrderBy, ThreadSortDirection, ThreadSortOptions } from '../../types.js';
export declare abstract class MemoryStorage extends MastraBase {
    constructor();
    abstract getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    abstract getThreadsByResourceId({ resourceId, }: {
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
    protected castThreadOrderBy(v: unknown): ThreadOrderBy;
    protected castThreadSortDirection(v: unknown): ThreadSortDirection;
}
//# sourceMappingURL=base.d.ts.map