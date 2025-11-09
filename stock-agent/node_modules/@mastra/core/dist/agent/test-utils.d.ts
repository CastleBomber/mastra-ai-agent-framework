import { MastraMemory } from '../memory/index.js';
import type { StorageThreadType, MastraMessageV1, MastraMessageV2, MemoryConfig } from '../memory/index.js';
import type { StorageGetMessagesArg } from '../storage/index.js';
export declare class MockMemory extends MastraMemory {
    threads: Record<string, StorageThreadType>;
    messages: Map<string, MastraMessageV1 | MastraMessageV2>;
    constructor();
    getThreadById({ threadId }: {
        threadId: string;
    }): Promise<StorageThreadType | null>;
    saveThread({ thread }: {
        thread: StorageThreadType;
        memoryConfig?: MemoryConfig;
    }): Promise<StorageThreadType>;
    getMessages(args: StorageGetMessagesArg & {
        format?: 'v1';
    }): Promise<MastraMessageV1[]>;
    getMessages(args: StorageGetMessagesArg & {
        format: 'v2';
    }): Promise<MastraMessageV2[]>;
    getMessages(args: StorageGetMessagesArg & {
        format?: 'v1' | 'v2';
    }): Promise<MastraMessageV1[] | MastraMessageV2[]>;
    saveMessages(args: {
        messages: MastraMessageV1[];
        format?: undefined | 'v1';
    }): Promise<MastraMessageV1[]>;
    saveMessages(args: {
        messages: MastraMessageV2[];
        format: 'v2';
    }): Promise<MastraMessageV2[]>;
    rememberMessages(): Promise<{
        messages: MastraMessageV1[];
        messagesV2: MastraMessageV2[];
    }>;
    getThreadsByResourceId(): Promise<never[]>;
    getThreadsByResourceIdPaginated(args: {
        resourceId: string;
        page: number;
        perPage: number;
    } & any): Promise<any & {
        threads: StorageThreadType[];
    }>;
    query(): Promise<{
        messages: never[];
        uiMessages: never[];
        messagesV2: never[];
    }>;
    deleteThread(threadId: string): Promise<void>;
    deleteMessages(messageIds: string[]): Promise<void>;
    getWorkingMemory({ threadId: _threadId, resourceId: _resourceId, memoryConfig: _memoryConfig, }: {
        threadId: string;
        resourceId?: string;
        memoryConfig?: MemoryConfig;
    }): Promise<string | null>;
    getWorkingMemoryTemplate({ memoryConfig: _memoryConfig, }?: {
        memoryConfig?: MemoryConfig;
    }): Promise<any | null>;
    getMergedThreadConfig(config?: MemoryConfig): MemoryConfig;
    updateWorkingMemory({ threadId: _threadId, resourceId: _resourceId, workingMemory: _workingMemory, memoryConfig: _memoryConfig, }: {
        threadId: string;
        resourceId?: string;
        workingMemory: string;
        memoryConfig?: MemoryConfig;
    }): Promise<void>;
    __experimental_updateWorkingMemoryVNext({ threadId: _threadId, resourceId: _resourceId, workingMemory: _workingMemory, searchString: _searchString, memoryConfig: _memoryConfig, }: {
        threadId: string;
        resourceId?: string;
        workingMemory: string;
        searchString?: string;
        memoryConfig?: MemoryConfig;
    }): Promise<{
        success: boolean;
        reason: string;
    }>;
    updateMessages({ messages }: {
        messages: MastraMessageV2[];
    }): Promise<MastraMessageV2[]>;
}
export declare function assertNoDuplicateParts(parts: any[]): void;
//# sourceMappingURL=test-utils.d.ts.map