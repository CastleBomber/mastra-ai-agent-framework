import type { MastraMessageV1, MastraMessageV2, StorageThreadType } from '../../../memory/types.js';
import type { PaginationInfo, StorageGetMessagesArg, StorageMessageType, StorageResourceType, ThreadSortOptions } from '../../types.js';
import type { StoreOperations } from '../operations/index.js';
import { MemoryStorage } from './base.js';
export type InMemoryThreads = Map<string, StorageThreadType>;
export type InMemoryResources = Map<string, StorageResourceType>;
export type InMemoryMessages = Map<string, StorageMessageType>;
export declare class InMemoryMemory extends MemoryStorage {
    private collection;
    private operations;
    constructor({ collection, operations, }: {
        collection: {
            threads: InMemoryThreads;
            resources: InMemoryResources;
            messages: InMemoryMessages;
        };
        operations: StoreOperations;
    });
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
    getMessages<T extends MastraMessageV2[]>({ threadId, selectBy }: StorageGetMessagesArg): Promise<T>;
    protected parseStoredMessage(message: StorageMessageType): MastraMessageV2;
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
        messages: (Partial<MastraMessageV2> & {
            id: string;
        })[];
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
    private sortThreads;
}
//# sourceMappingURL=inmemory.d.ts.map