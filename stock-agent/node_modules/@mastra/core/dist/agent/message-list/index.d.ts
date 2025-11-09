import type { LanguageModelV1Message } from '@ai-sdk/provider';
import type { LanguageModelV2Prompt } from '@ai-sdk/provider-v5';
import * as AIV4 from 'ai';
import * as AIV5 from 'ai-v5';
import type { AIV4Type, AIV5Type } from './types.js';
type AIV5LanguageModelV2Message = LanguageModelV2Prompt[0];
export type AIV5ResponseMessage = AIV5.StepResult<any>['response']['messages'][number];
type MastraMessageShared = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    createdAt: Date;
    threadId?: string;
    resourceId?: string;
    type?: string;
};
export type MastraMessageContentV2 = {
    format: 2;
    parts: (AIV4Type.UIMessage['parts'][number] & {
        providerMetadata?: AIV5Type.ProviderMetadata;
    })[];
    experimental_attachments?: AIV4Type.UIMessage['experimental_attachments'];
    content?: AIV4Type.UIMessage['content'];
    toolInvocations?: AIV4Type.UIMessage['toolInvocations'];
    reasoning?: AIV4Type.UIMessage['reasoning'];
    annotations?: AIV4Type.UIMessage['annotations'];
    metadata?: Record<string, unknown>;
};
export type MastraMessageV2 = MastraMessageShared & {
    content: MastraMessageContentV2;
};
export type MastraMessageContentV3 = {
    format: 3;
    parts: AIV5Type.UIMessage['parts'];
    metadata?: AIV5Type.UIMessage['metadata'];
};
export type MastraMessageV3 = MastraMessageShared & {
    role: AIV5Type.UIMessage['role'];
    content: MastraMessageContentV3;
};
export type MastraMessageV1 = {
    id: string;
    content: string | AIV4Type.CoreMessage['content'];
    role: 'system' | 'user' | 'assistant' | 'tool';
    createdAt: Date;
    threadId?: string;
    resourceId?: string;
    toolCallIds?: string[];
    toolCallArgs?: Record<string, unknown>[];
    toolNames?: string[];
    type: 'text' | 'tool-call' | 'tool-result';
};
export type UIMessageWithMetadata = AIV4Type.UIMessage & {
    metadata?: Record<string, unknown>;
};
export type MessageInput = AIV5Type.UIMessage | AIV5Type.ModelMessage | UIMessageWithMetadata | AIV4Type.Message | AIV4Type.CoreMessage | MastraMessageV1 | MastraMessageV2 | MastraMessageV3;
export { convertMessages } from './utils/convert-messages.js';
export type { OutputFormat } from './utils/convert-messages.js';
type MessageSource = 'memory' | 'response' | 'input' | 'system' | 'context' | 'user';
type MemoryInfo = {
    threadId: string;
    resourceId?: string;
};
export type MessageListInput = string | string[] | MessageInput | MessageInput[];
export declare class MessageList {
    private messages;
    private systemMessages;
    private taggedSystemMessages;
    private memoryInfo;
    private memoryMessages;
    private newUserMessages;
    private newResponseMessages;
    private userContextMessages;
    private memoryMessagesPersisted;
    private newUserMessagesPersisted;
    private newResponseMessagesPersisted;
    private userContextMessagesPersisted;
    private generateMessageId?;
    private _agentNetworkAppend;
    constructor({ threadId, resourceId, generateMessageId, _agentNetworkAppend, }?: {
        threadId?: string;
        resourceId?: string;
        generateMessageId?: AIV4Type.IdGenerator;
    });
    add(messages: MessageListInput, messageSource: MessageSource): this;
    private serializeSet;
    private deserializeSet;
    private serializeMessage;
    private deserializeMessage;
    serialize(): {
        messages: {
            createdAt: string;
            id: string;
            role: "user" | "assistant" | "system";
            threadId?: string;
            resourceId?: string;
            type?: string;
            content: MastraMessageContentV2;
        }[];
        systemMessages: AIV4.CoreSystemMessage[];
        taggedSystemMessages: Record<string, AIV4.CoreSystemMessage[]>;
        memoryInfo: MemoryInfo | null;
        _agentNetworkAppend: boolean;
        memoryMessages: string[];
        newUserMessages: string[];
        newResponseMessages: string[];
        userContextMessages: string[];
        memoryMessagesPersisted: string[];
        newUserMessagesPersisted: string[];
        newResponseMessagesPersisted: string[];
        userContextMessagesPersisted: string[];
    };
    deserialize(state: ReturnType<typeof this.serialize>): this;
    getLatestUserContent(): string | null;
    get get(): {
        all: {
            v3: () => MastraMessageV3[];
            v2: () => MastraMessageV2[];
            v1: () => MastraMessageV1[];
            aiV5: {
                model: () => AIV5Type.ModelMessage[];
                ui: () => AIV5Type.UIMessage[];
                prompt: () => AIV5Type.ModelMessage[];
                llmPrompt: (options?: {
                    downloadConcurrency?: number;
                    downloadRetries?: number;
                    supportedUrls?: Record<string, RegExp[]>;
                }) => Promise<LanguageModelV2Prompt>;
            };
            prompt: () => AIV4.CoreMessage[];
            ui: () => UIMessageWithMetadata[];
            core: () => AIV4Type.CoreMessage[];
            aiV4: {
                ui: () => UIMessageWithMetadata[];
                core: () => AIV4Type.CoreMessage[];
                prompt: () => AIV4.CoreMessage[];
                llmPrompt: () => AIV4Type.LanguageModelV1Prompt;
            };
        };
        remembered: {
            v3: () => MastraMessageV3[];
            v2: () => MastraMessageV2[];
            v1: () => import("../..").MastraMessageV1[];
            aiV5: {
                model: () => AIV5.ModelMessage[];
                ui: () => AIV5Type.UIMessage[];
            };
            ui: () => UIMessageWithMetadata[];
            core: () => AIV4Type.CoreMessage[];
            aiV4: {
                ui: () => UIMessageWithMetadata[];
                core: () => AIV4Type.CoreMessage[];
            };
        };
        input: {
            v3: () => MastraMessageV3[];
            v2: () => MastraMessageV2[];
            v1: () => import("../..").MastraMessageV1[];
            aiV5: {
                model: () => AIV5.ModelMessage[];
                ui: () => AIV5Type.UIMessage[];
            };
            ui: () => UIMessageWithMetadata[];
            core: () => AIV4.CoreMessage[];
            aiV4: {
                ui: () => UIMessageWithMetadata[];
                core: () => AIV4Type.CoreMessage[];
            };
        };
        response: {
            v3: () => MastraMessageV3[];
            v2: () => MastraMessageV2[];
            v1: () => MastraMessageV1[];
            aiV5: {
                ui: () => AIV5Type.UIMessage[];
                model: () => AIV5ResponseMessage[];
                modelContent: (stepNumber?: number) => AIV5Type.StepResult<any>["content"];
                stepContent: (message?: AIV5Type.ModelMessage) => AIV5Type.StepResult<any>["content"];
            };
            aiV4: {
                ui: () => UIMessageWithMetadata[];
                core: () => AIV4Type.CoreMessage[];
            };
        };
    };
    get getPersisted(): {
        remembered: {
            v2: () => MastraMessageV2[];
            v1: () => import("../..").MastraMessageV1[];
            ui: () => UIMessageWithMetadata[];
            core: () => AIV4.CoreMessage[];
        };
        input: {
            v3: () => MastraMessageV3[];
            v2: () => MastraMessageV2[];
            v1: () => MastraMessageV1[];
            ui: () => UIMessageWithMetadata[];
            core: () => AIV4.CoreMessage[];
        };
        taggedSystemMessages: Record<string, AIV4.CoreSystemMessage[]>;
        response: {
            v3: () => MastraMessageV3[];
            v2: () => MastraMessageV2[];
            ui: () => UIMessageWithMetadata[];
        };
    };
    get clear(): {
        input: {
            v2: () => MastraMessageV2[];
        };
        response: {
            v2: () => MastraMessageV2[];
        };
    };
    private all;
    private remembered;
    private rememberedPersisted;
    private input;
    private inputPersisted;
    private response;
    private responsePersisted;
    drainUnsavedMessages(): MastraMessageV2[];
    getEarliestUnsavedMessageTimestamp(): number | undefined;
    getSystemMessages(tag?: string): AIV4Type.CoreMessage[];
    addSystem(messages: AIV4Type.CoreMessage | AIV4Type.CoreMessage[] | AIV5Type.ModelMessage | AIV5Type.ModelMessage[] | MastraMessageV2 | MastraMessageV2[] | string | string[] | null, tag?: string): this;
    private aiV4UIMessagesToAIV4CoreMessages;
    private sanitizeAIV4UIMessages;
    /**
     * Converts various message formats to AIV4 CoreMessage format for system messages
     * @param message - The message to convert (can be string, MastraMessageV2, or AI SDK message types)
     * @returns AIV4 CoreMessage in the proper format
     */
    private systemMessageToAICore;
    private addOneSystem;
    private isDuplicateSystem;
    private static mastraMessageV2ToAIV4UIMessage;
    /**
     * Converts a MastraMessageV2 system message directly to AIV4 CoreMessage format
     * This is more efficient than converting to UI message first and then to core
     * @param message - The MastraMessageV2 message to convert
     * @returns AIV4 CoreMessage with system role
     */
    private static mastraMessageV2SystemToV4Core;
    private getMessageById;
    private shouldReplaceMessage;
    private addOne;
    private pushMessageToSource;
    /**
     * Pushes a new message part to the latest message.
     * @param latestMessage - The latest message to push the part to.
     * @param newMessage - The new message to push the part from.
     * @param part - The part to push.
     * @param insertAt - The index at which to insert the part. Optional.
     */
    private pushNewMessagePart;
    /**
     * Upserts parts of messageV2 into latestMessage based on the anchorMap.
     * This is used when appending a message to the last assistant message to ensure that parts are inserted in the correct order.
     * @param latestMessage - The latest message to upsert parts into.
     * @param messageV2 - The message to upsert parts from.
     * @param anchorMap - The anchor map to use for upserting parts.
     */
    private addPartsToLatestMessage;
    private inputToMastraMessageV2;
    private lastCreatedAt?;
    private generateCreatedAt;
    private newMessageId;
    private mastraMessageV1ToMastraMessageV2;
    private hydrateMastraMessageV3Fields;
    private hydrateMastraMessageV2Fields;
    private aiV4UIMessageToMastraMessageV2;
    private aiV4CoreMessageToMastraMessageV2;
    static isAIV4UIMessage(msg: MessageInput): msg is AIV4Type.UIMessage;
    static isAIV5CoreMessage(msg: MessageInput): msg is AIV5Type.ModelMessage;
    static isAIV4CoreMessage(msg: MessageInput): msg is AIV4Type.CoreMessage;
    static isMastraMessage(msg: MessageInput): msg is MastraMessageV2 | MastraMessageV1 | MastraMessageV3;
    static isMastraMessageV1(msg: MessageInput): msg is MastraMessageV1;
    static isMastraMessageV2(msg: MessageInput): msg is MastraMessageV2;
    static isMastraMessageV3(msg: MessageInput): msg is MastraMessageV3;
    private static getRole;
    private static cacheKeyFromAIV4Parts;
    static coreContentToString(content: AIV4Type.CoreMessage['content']): string;
    private static cacheKeyFromAIV4CoreMessageContent;
    private static messagesAreEqual;
    private cleanV3Metadata;
    static aiV4CoreMessageToV1PromptMessage(coreMessage: AIV4Type.CoreMessage): LanguageModelV1Message;
    static aiV5ModelMessageToV2PromptMessage(modelMessage: AIV5Type.ModelMessage): AIV5LanguageModelV2Message;
    private static mastraMessageV3ToV2;
    private mastraMessageV2ToMastraMessageV3;
    private aiV5UIMessagesToAIV5ModelMessages;
    private addStartStepPartsForAIV5;
    private sanitizeV5UIMessages;
    private static mastraMessageV3ToAIV5UIMessage;
    private aiV5ModelMessagesToAIV4CoreMessages;
    private aiV4CoreMessagesToAIV5ModelMessages;
    private aiV5UIMessageToMastraMessageV3;
    private aiV5ModelMessageToMastraMessageV3;
    static hasAIV5UIMessageCharacteristics(msg: AIV5Type.UIMessage | AIV4Type.UIMessage | AIV4Type.Message): msg is AIV5Type.UIMessage;
    static isAIV5UIMessage(msg: MessageInput): msg is AIV5Type.UIMessage;
    static hasAIV5CoreMessageCharacteristics(msg: AIV4Type.CoreMessage | AIV5Type.ModelMessage | AIV4Type.Message): msg is AIV5Type.ModelMessage;
    private static cacheKeyFromAIV5Parts;
    private static cacheKeyFromAIV5ModelMessageContent;
}
//# sourceMappingURL=index.d.ts.map