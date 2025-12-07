import type { WritableStream } from 'stream/web';
import type { CoreMessage, StreamObjectResult, UIMessage } from 'ai';
import type { JSONSchema7 } from 'json-schema';
import { z } from 'zod';
import type { ZodSchema } from 'zod';
import type { MastraPrimitives } from '../action/index.js';
import { AISpanType } from '../ai-tracing/index.js';
import type { AISpan, TracingContext, TracingOptions, TracingProperties } from '../ai-tracing/index.js';
import { MastraBase } from '../base.js';
import type { Metric } from '../eval/index.js';
import { MastraLLMV1 } from '../llm/model/index.js';
import type { GenerateObjectResult, GenerateTextResult, StreamTextResult } from '../llm/model/base.types.js';
import { MastraLLMVNext } from '../llm/model/model.loop.js';
import type { MastraLanguageModel, MastraModelConfig } from '../llm/model/shared.types.js';
import type { Mastra } from '../mastra/index.js';
import type { MastraMemory } from '../memory/memory.js';
import type { MemoryConfig, StorageThreadType } from '../memory/types.js';
import type { InputProcessor, OutputProcessor } from '../processors/index.js';
import { RuntimeContext } from '../runtime-context/index.js';
import type { ScorerRunInputForAgent, ScorerRunOutputForAgent, MastraScorers, MastraScorer } from '../scores/index.js';
import type { AISDKV5OutputStream } from '../stream/index.js';
import type { MastraModelOutput } from '../stream/base/output.js';
import type { OutputSchema } from '../stream/base/schema.js';
import type { ChunkType } from '../stream/types.js';
import type { CoreTool } from '../tools/types.js';
import type { DynamicArgument } from '../types/index.js';
import type { CompositeVoice } from '../voice/index.js';
import { DefaultVoice } from '../voice/index.js';
import type { Workflow } from '../workflows/index.js';
import { LegacyStep as Step } from '../workflows/legacy/index.js';
import type { AgentExecutionOptions, DeprecatedOutputOptions, MultiPrimitiveExecutionOptions } from './agent.types.js';
import { MessageList } from './message-list/index.js';
import type { MessageInput, MessageListInput, UIMessageWithMetadata } from './message-list/index.js';
import { SaveQueueManager } from './save-queue/index.js';
import type { AgentConfig, AgentGenerateOptions, AgentStreamOptions, ToolsetsInput, ToolsInput, AgentModelManagerConfig, AgentInstructions, AgentMethodType } from './types.js';
export type MastraLLM = MastraLLMV1 | MastraLLMVNext;
type ModelFallbacks = {
    id: string;
    model: DynamicArgument<MastraModelConfig>;
    maxRetries: number;
    enabled: boolean;
}[];
/**
 * The Agent class is the foundation for creating AI agents in Mastra. It provides methods for generating responses,
 * streaming interactions, managing memory, and handling voice capabilities.
 *
 * @example
 * ```typescript
 * import { Agent } from '@mastra/core/agent';
 * import { Memory } from '@mastra/memory';
 *
 * const agent = new Agent({
 *   name: 'my-agent',
 *   instructions: 'You are a helpful assistant',
 *   model: 'openai/gpt-5',
 *   tools: {
 *     calculator: calculatorTool,
 *   },
 *   memory: new Memory(),
 * });
 * ```
 */
export declare class Agent<TAgentId extends string = string, TTools extends ToolsInput = ToolsInput, TMetrics extends Record<string, Metric> = Record<string, Metric>> extends MastraBase {
    #private;
    id: TAgentId;
    name: TAgentId;
    model: DynamicArgument<MastraModelConfig> | ModelFallbacks;
    maxRetries?: number;
    evals: TMetrics;
    private _agentNetworkAppend;
    /**
     * Creates a new Agent instance with the specified configuration.
     *
     * @example
     * ```typescript
     * import { Agent } from '@mastra/core/agent';
     * import { Memory } from '@mastra/memory';
     *
     * const agent = new Agent({
     *   name: 'weatherAgent',
     *   instructions: 'You help users with weather information',
     *   model: 'openai/gpt-5',
     *   tools: { getWeather },
     *   memory: new Memory(),
     *   maxRetries: 2,
     * });
     * ```
     */
    constructor(config: AgentConfig<TAgentId, TTools, TMetrics>);
    getMastraInstance(): Mastra<Record<string, Agent<any, ToolsInput, Record<string, Metric>>>, Record<string, import("../workflows/legacy").LegacyWorkflow<Step<string, any, any, import("../workflows/legacy").StepExecutionContext<any, import("../workflows/legacy").WorkflowContext<any, Step<string, any, any, any>[], Record<string, any>>>>[], string, any, any>>, Record<string, Workflow<any, any, any, any, any, any, any>>, Record<string, import("../vector").MastraVector<any>>, Record<string, import("../tts").MastraTTS>, import("../logger").IMastraLogger, Record<string, import("../mcp").MCPServerBase>, Record<string, MastraScorer<any, any, any, any>>> | undefined;
    /**
     * Returns the agents configured for this agent, resolving function-based agents if necessary.
     * Used in multi-agent collaboration scenarios where this agent can delegate to other agents.
     *
     * @example
     * ```typescript
     * const agents = await agent.listAgents();
     * console.log(Object.keys(agents)); // ['agent1', 'agent2']
     * ```
     */
    listAgents({ runtimeContext }?: {
        runtimeContext?: RuntimeContext;
    }): Record<string, Agent<string, ToolsInput, Record<string, Metric>>> | Promise<Record<string, Agent<string, ToolsInput, Record<string, Metric>>>>;
    /**
     * Creates and returns a ProcessorRunner with resolved input/output processors.
     * @internal
     */
    private getProcessorRunner;
    /**
     * Resolves and returns output processors from agent configuration.
     * @internal
     */
    private getResolvedOutputProcessors;
    /**
     * Resolves and returns input processors from agent configuration.
     * @internal
     */
    private getResolvedInputProcessors;
    /**
     * Returns the input processors for this agent, resolving function-based processors if necessary.
     */
    getInputProcessors(runtimeContext?: RuntimeContext): Promise<InputProcessor[]>;
    /**
     * Returns the output processors for this agent, resolving function-based processors if necessary.
     */
    getOutputProcessors(runtimeContext?: RuntimeContext): Promise<OutputProcessor[]>;
    /**
     * Returns whether this agent has its own memory configured.
     *
     * @example
     * ```typescript
     * if (agent.hasOwnMemory()) {
     *   const memory = await agent.getMemory();
     * }
     * ```
     */
    hasOwnMemory(): boolean;
    /**
     * Gets the memory instance for this agent, resolving function-based memory if necessary.
     * The memory system enables conversation persistence, semantic recall, and working memory.
     *
     * @example
     * ```typescript
     * const memory = await agent.getMemory();
     * if (memory) {
     *   // Memory is configured
     * }
     * ```
     */
    getMemory({ runtimeContext }?: {
        runtimeContext?: RuntimeContext;
    }): Promise<MastraMemory | undefined>;
    get voice(): CompositeVoice;
    /**
     * Gets the workflows configured for this agent, resolving function-based workflows if necessary.
     * Workflows are step-based execution flows that can be triggered by the agent.
     *
     * @example
     * ```typescript
     * const workflows = await agent.getWorkflows();
     * const workflow = workflows['myWorkflow'];
     * ```
     */
    getWorkflows({ runtimeContext, }?: {
        runtimeContext?: RuntimeContext;
    }): Promise<Record<string, Workflow<any, any, any, any, any, any>>>;
    getScorers({ runtimeContext, }?: {
        runtimeContext?: RuntimeContext;
    }): Promise<MastraScorers>;
    /**
     * Gets the voice instance for this agent with tools and instructions configured.
     * The voice instance enables text-to-speech and speech-to-text capabilities.
     *
     * @example
     * ```typescript
     * const voice = await agent.getVoice();
     * const audioStream = await voice.speak('Hello world');
     * ```
     */
    getVoice({ runtimeContext }?: {
        runtimeContext?: RuntimeContext;
    }): Promise<CompositeVoice | DefaultVoice>;
    get instructions(): string;
    /**
     * Gets the instructions for this agent, resolving function-based instructions if necessary.
     * Instructions define the agent's behavior and capabilities.
     *
     * @example
     * ```typescript
     * const instructions = await agent.getInstructions();
     * console.log(instructions); // 'You are a helpful assistant'
     * ```
     */
    getInstructions({ runtimeContext }?: {
        runtimeContext?: RuntimeContext;
    }): AgentInstructions | Promise<AgentInstructions>;
    /**
     * Returns the description of the agent.
     *
     * @example
     * ```typescript
     * const description = agent.getDescription();
     * console.log(description); // 'A helpful weather assistant'
     * ```
     */
    getDescription(): string;
    /**
     * Gets the default generate options for this agent, resolving function-based options if necessary.
     * These options are used as defaults when calling `generate()` without explicit options.
     *
     * @example
     * ```typescript
     * const options = await agent.getDefaultGenerateOptions();
     * console.log(options.maxSteps); // 5
     * ```
     */
    getDefaultGenerateOptions({ runtimeContext, }?: {
        runtimeContext?: RuntimeContext;
    }): AgentGenerateOptions | Promise<AgentGenerateOptions>;
    /**
     * Gets the default stream options for this agent, resolving function-based options if necessary.
     * These options are used as defaults when calling `stream()` without explicit options.
     *
     * @example
     * ```typescript
     * const options = await agent.getDefaultStreamOptions();
     * console.log(options.temperature); // 0.7
     * ```
     */
    getDefaultStreamOptions({ runtimeContext }?: {
        runtimeContext?: RuntimeContext;
    }): AgentStreamOptions | Promise<AgentStreamOptions>;
    /**
     * Gets the default VNext stream options for this agent, resolving function-based options if necessary.
     * These options are used as defaults when calling `streamVNext()` or `generateVNext()` without explicit options.
     *
     * @example
     * ```typescript
     * const options = await agent.getDefaultVNextStreamOptions();
     * console.log(options.maxSteps); // 5
     * ```
     */
    getDefaultVNextStreamOptions<OUTPUT extends OutputSchema = undefined>({ runtimeContext, }?: {
        runtimeContext?: RuntimeContext;
    }): AgentExecutionOptions<OUTPUT> | Promise<AgentExecutionOptions<OUTPUT>>;
    get tools(): TTools;
    /**
     * Gets the tools configured for this agent, resolving function-based tools if necessary.
     * Tools extend the agent's capabilities, allowing it to perform specific actions or access external systems.
     *
     * @example
     * ```typescript
     * const tools = await agent.getTools();
     * console.log(Object.keys(tools)); // ['calculator', 'weather']
     * ```
     */
    getTools({ runtimeContext }?: {
        runtimeContext?: RuntimeContext;
    }): TTools | Promise<TTools>;
    get llm(): MastraLLM | Promise<MastraLLM>;
    /**
     * Gets or creates an LLM instance based on the provided or configured model.
     * The LLM wraps the language model with additional capabilities like telemetry and error handling.
     *
     * @example
     * ```typescript
     * const llm = await agent.getLLM();
     * // Use with custom model
     * const customLlm = await agent.getLLM({ model: 'openai/gpt-5' });
     * ```
     */
    getLLM({ runtimeContext, model, }?: {
        runtimeContext?: RuntimeContext;
        model?: DynamicArgument<MastraModelConfig>;
    }): MastraLLM | Promise<MastraLLM>;
    /**
     * Resolves a model configuration to a LanguageModel instance
     * @param modelConfig The model configuration (magic string, config object, or LanguageModel)
     * @returns A LanguageModel instance
     * @internal
     */
    private resolveModelConfig;
    /**
     * Gets the model instance, resolving it if it's a function or model configuration.
     * When the agent has multiple models configured, returns the first enabled model.
     *
     * @example
     * ```typescript
     * const model = await agent.getModel();
     * // Get with custom model config
     * const customModel = await agent.getModel({
     *   modelConfig: 'openai/gpt-5'
     * });
     * ```
     */
    getModel({ runtimeContext, modelConfig, }?: {
        runtimeContext?: RuntimeContext;
        modelConfig?: Agent['model'];
    }): MastraLanguageModel | Promise<MastraLanguageModel>;
    /**
     * Gets the list of configured models if the agent has multiple models, otherwise returns null.
     * Used for model fallback and load balancing scenarios.
     *
     * @example
     * ```typescript
     * const models = await agent.getModelList();
     * if (models) {
     *   console.log(models.map(m => m.id));
     * }
     * ```
     */
    getModelList(runtimeContext?: RuntimeContext): Promise<Array<AgentModelManagerConfig> | null>;
    /**
     * Updates the agent's instructions.
     * @internal
     */
    __updateInstructions(newInstructions: string): void;
    /**
     * Updates the agent's model configuration.
     * @internal
     */
    __updateModel({ model }: {
        model: DynamicArgument<MastraModelConfig>;
    }): void;
    /**
     * Resets the agent's model to the original model set during construction.
     * Clones arrays to prevent reordering mutations from affecting the original snapshot.
     * @internal
     */
    __resetToOriginalModel(): void;
    reorderModels(modelIds: string[]): void;
    updateModelInModelList({ id, model, enabled, maxRetries, }: {
        id: string;
        model?: DynamicArgument<MastraModelConfig>;
        enabled?: boolean;
        maxRetries?: number;
    }): void;
    /**
     * Registers telemetry and logger primitives with the agent.
     * @internal
     */
    __registerPrimitives(p: MastraPrimitives): void;
    /**
     * Registers the Mastra instance with the agent.
     * @internal
     */
    __registerMastra(mastra: Mastra): void;
    /**
     * Set the concrete tools for the agent
     * @param tools
     * @internal
     */
    __setTools(tools: TTools): void;
    generateTitleFromUserMessage({ message, runtimeContext, tracingContext, model, instructions, }: {
        message: string | MessageInput;
        runtimeContext?: RuntimeContext;
        tracingContext: TracingContext;
        model?: DynamicArgument<MastraModelConfig>;
        instructions?: DynamicArgument<string>;
    }): Promise<string>;
    getMostRecentUserMessage(messages: Array<UIMessage | UIMessageWithMetadata>): UIMessage | UIMessageWithMetadata | undefined;
    genTitle(userMessage: string | MessageInput | undefined, runtimeContext: RuntimeContext, tracingContext: TracingContext, model?: DynamicArgument<MastraModelConfig>, instructions?: DynamicArgument<string>): Promise<string | undefined>;
    __setMemory(memory: DynamicArgument<MastraMemory>): void;
    fetchMemory({ threadId, thread: passedThread, memoryConfig, resourceId, runId, userMessages, systemMessage, messageList, runtimeContext, }: {
        resourceId: string;
        threadId: string;
        thread?: StorageThreadType;
        memoryConfig?: MemoryConfig;
        userMessages?: CoreMessage[];
        systemMessage?: CoreMessage;
        runId?: string;
        messageList?: MessageList;
        runtimeContext?: RuntimeContext;
    }): Promise<{
        threadId: string;
        messages: CoreMessage[];
    }>;
    /**
     * Retrieves and converts memory tools to CoreTool format.
     * @internal
     */
    private getMemoryTools;
    /**
     * Executes input processors on the message list before LLM processing.
     * @internal
     */
    private __runInputProcessors;
    /**
     * Executes output processors on the message list after LLM processing.
     * @internal
     */
    private __runOutputProcessors;
    /**
     * Fetches remembered messages from memory for the current thread.
     * @internal
     */
    private getMemoryMessages;
    /**
     * Retrieves and converts assigned tools to CoreTool format.
     * @internal
     */
    private getAssignedTools;
    /**
     * Retrieves and converts toolset tools to CoreTool format.
     * @internal
     */
    private getToolsets;
    /**
     * Retrieves and converts client-side tools to CoreTool format.
     * @internal
     */
    private getClientTools;
    /**
     * Retrieves and converts agent tools to CoreTool format.
     * @internal
     */
    private getAgentTools;
    /**
     * Retrieves and converts workflow tools to CoreTool format.
     * @internal
     */
    private getWorkflowTools;
    /**
     * Assembles all tools from various sources into a unified CoreTool dictionary.
     * @internal
     */
    private convertTools;
    /**
     * Formats and validates tool names to comply with naming restrictions.
     * @internal
     */
    private formatTools;
    /**
     * Adds response messages from a step to the MessageList and schedules persistence.
     * This is used for incremental saving: after each agent step, messages are added to a save queue
     * and a debounced save operation is triggered to avoid redundant writes.
     *
     * @param result - The step result containing response messages.
     * @param messageList - The MessageList instance for the current thread.
     * @param threadId - The thread ID.
     * @param memoryConfig - The memory configuration for saving.
     * @param runId - (Optional) The run ID for logging.
     * @internal
     */
    private saveStepMessages;
    /**
     * Prepares message list and tools before LLM execution and handles memory persistence after.
     * @internal
     */
    __primitive({ instructions, messages, context, thread, memoryConfig, resourceId, runId, toolsets, clientTools, runtimeContext, saveQueueManager, writableStream, methodType, tracingContext, tracingOptions, }: {
        instructions: AgentInstructions;
        toolsets?: ToolsetsInput;
        clientTools?: ToolsInput;
        resourceId?: string;
        thread?: (Partial<StorageThreadType> & {
            id: string;
        }) | undefined;
        memoryConfig?: MemoryConfig;
        context?: CoreMessage[];
        runId?: string;
        messages: MessageListInput;
        runtimeContext: RuntimeContext;
        saveQueueManager: SaveQueueManager;
        writableStream?: WritableStream<ChunkType>;
        methodType: 'generate' | 'stream';
        tracingContext?: TracingContext;
        tracingOptions?: TracingOptions;
    }): {
        before: () => Promise<{
            tripwire?: boolean | undefined;
            tripwireReason?: string | undefined;
            messageObjects: CoreMessage[];
            convertedTools: Record<string, CoreTool>;
            threadExists: boolean;
            thread: undefined;
            messageList: MessageList;
            agentAISpan: AISpan<AISpanType.AGENT_RUN> | undefined;
        } | {
            threadExists: boolean;
            tripwire?: boolean | undefined;
            tripwireReason?: string | undefined;
            convertedTools: Record<string, CoreTool>;
            thread: StorageThreadType;
            messageList: MessageList;
            messageObjects: CoreMessage[];
            agentAISpan: AISpan<AISpanType.AGENT_RUN> | undefined;
        }>;
        after: ({ result, thread: threadAfter, threadId, memoryConfig, outputText, runId, messageList, threadExists, structuredOutput, overrideScorers, agentAISpan, }: {
            runId: string;
            result: Record<string, any>;
            thread: StorageThreadType | null | undefined;
            threadId?: string;
            memoryConfig: MemoryConfig | undefined;
            outputText: string;
            messageList: MessageList;
            threadExists: boolean;
            structuredOutput?: boolean;
            overrideScorers?: MastraScorers;
            agentAISpan?: AISpan<AISpanType.AGENT_RUN>;
        }) => Promise<{
            scoringData: {
                input: Omit<ScorerRunInputForAgent, "runId">;
                output: ScorerRunOutputForAgent;
            };
        }>;
    };
    /**
     * Resolves scorer name references to actual scorer instances from Mastra.
     * @internal
     */
    private resolveOverrideScorerReferences;
    /**
     * Prepares options and handlers for LLM text/object generation or streaming.
     * @internal
     */
    private prepareLLMOptions;
    /**
     * Resolves and prepares model configurations for the LLM.
     * @internal
     */
    private prepareModels;
    /**
     * Executes a network loop where multiple agents can collaborate to handle messages.
     * The routing agent delegates tasks to appropriate sub-agents based on the conversation.
     *
     * @experimental
     *
     * @example
     * ```typescript
     * const result = await agent.network('Find the weather in Tokyo and plan an activity', {
     *   memory: {
     *     thread: 'user-123',
     *     resource: 'my-app'
     *   },
     *   maxSteps: 10
     * });
     *
     * for await (const chunk of result.stream) {
     *   console.log(chunk);
     * }
     * ```
     */
    network(messages: MessageListInput, options?: MultiPrimitiveExecutionOptions): Promise<import("../stream").MastraAgentNetworkStream>;
    /**
     * @deprecated `generateVNext()` has been renamed to `generate()`. Please use `generate()` instead.
     */
    generateVNext<OUTPUT extends OutputSchema = undefined, FORMAT extends 'aisdk' | 'mastra' = 'mastra'>(_messages: MessageListInput, _options?: AgentExecutionOptions<OUTPUT, FORMAT>): Promise<FORMAT extends 'aisdk' ? Awaited<ReturnType<AISDKV5OutputStream<OUTPUT>['getFullOutput']>> : Awaited<ReturnType<MastraModelOutput<OUTPUT>['getFullOutput']>>>;
    generate<OUTPUT extends OutputSchema = undefined, FORMAT extends 'aisdk' | 'mastra' = 'mastra'>(messages: MessageListInput, options?: AgentExecutionOptions<OUTPUT, FORMAT> & DeprecatedOutputOptions<OUTPUT>): Promise<FORMAT extends 'aisdk' ? Awaited<ReturnType<AISDKV5OutputStream<OUTPUT>['getFullOutput']>> : Awaited<ReturnType<MastraModelOutput<OUTPUT>['getFullOutput']>>>;
    /**
     * @deprecated `streamVNext()` has been renamed to `stream()`. Please use `stream()` instead.
     */
    streamVNext<OUTPUT extends OutputSchema = undefined, FORMAT extends 'mastra' | 'aisdk' | undefined = undefined>(_messages: MessageListInput, _streamOptions?: AgentExecutionOptions<OUTPUT, FORMAT>): Promise<FORMAT extends 'aisdk' ? AISDKV5OutputStream<OUTPUT> : MastraModelOutput<OUTPUT>>;
    stream<OUTPUT extends OutputSchema = undefined, FORMAT extends 'mastra' | 'aisdk' | undefined = undefined>(messages: MessageListInput, streamOptions?: AgentExecutionOptions<OUTPUT, FORMAT> & DeprecatedOutputOptions<OUTPUT> & {
        methodType?: AgentMethodType;
    }): Promise<FORMAT extends 'aisdk' ? AISDKV5OutputStream<OUTPUT> : MastraModelOutput<OUTPUT>>;
    /**
     * Resumes a previously suspended VNext stream execution.
     * Used to continue execution after a suspension point (e.g., tool approval, workflow suspend).
     *
     * @example
     * ```typescript
     * // Resume after suspension
     * const stream = await agent.resumeStreamVNext(
     *   { approved: true },
     *   { runId: 'previous-run-id' }
     * );
     * ```
     */
    resumeStream<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'mastra' | 'aisdk' | undefined = undefined>(resumeData: any, streamOptions?: AgentExecutionOptions<OUTPUT, FORMAT> & {
        toolCallId?: string;
    }): Promise<FORMAT extends 'aisdk' ? AISDKV5OutputStream<OUTPUT> : MastraModelOutput<OUTPUT>>;
    /**
     * Approves a pending tool call and resumes execution.
     * Used when `requireToolApproval` is enabled to allow the agent to proceed with a tool call.
     *
     * @example
     * ```typescript
     * const stream = await agent.approveToolCall({
     *   runId: 'pending-run-id'
     * });
     *
     * for await (const chunk of stream) {
     *   console.log(chunk);
     * }
     * ```
     */
    approveToolCall<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'mastra' | 'aisdk' | undefined = undefined>(options: AgentExecutionOptions<OUTPUT, FORMAT> & {
        runId: string;
        toolCallId?: string;
    }): Promise<FORMAT extends 'aisdk' ? AISDKV5OutputStream<OUTPUT> : MastraModelOutput<OUTPUT>>;
    /**
     * Declines a pending tool call and resumes execution.
     * Used when `requireToolApproval` is enabled to prevent the agent from executing a tool call.
     *
     * @example
     * ```typescript
     * const stream = await agent.declineToolCall({
     *   runId: 'pending-run-id'
     * });
     *
     * for await (const chunk of stream) {
     *   console.log(chunk);
     * }
     * ```
     */
    declineToolCall<OUTPUT extends OutputSchema | undefined = undefined, FORMAT extends 'mastra' | 'aisdk' | undefined = undefined>(options: AgentExecutionOptions<OUTPUT, FORMAT> & {
        runId: string;
        toolCallId?: string;
    }): Promise<FORMAT extends 'aisdk' ? AISDKV5OutputStream<OUTPUT> : MastraModelOutput<OUTPUT>>;
    /**
     * Legacy implementation of generate method using AI SDK v4 models.
     * Use this method if you need to continue using AI SDK v4 models after `generate()` switches to VNext.
     *
     * @example
     * ```typescript
     * const result = await agent.generateLegacy('What is 2+2?');
     * console.log(result.text);
     * ```
     */
    generateLegacy(messages: MessageListInput, args?: AgentGenerateOptions<undefined, undefined> & {
        output?: never;
        experimental_output?: never;
    }): Promise<GenerateTextResult<any, undefined>>;
    generateLegacy<OUTPUT extends ZodSchema | JSONSchema7>(messages: MessageListInput, args?: AgentGenerateOptions<OUTPUT, undefined> & {
        output?: OUTPUT;
        experimental_output?: never;
    }): Promise<GenerateObjectResult<OUTPUT>>;
    generateLegacy<EXPERIMENTAL_OUTPUT extends ZodSchema | JSONSchema7>(messages: MessageListInput, args?: AgentGenerateOptions<undefined, EXPERIMENTAL_OUTPUT> & {
        output?: never;
        experimental_output?: EXPERIMENTAL_OUTPUT;
    }): Promise<GenerateTextResult<any, EXPERIMENTAL_OUTPUT>>;
    /**
     * Legacy implementation of stream method using AI SDK v4 models.
     * Use this method if you need to continue using AI SDK v4 models after `stream()` switches to VNext.
     *
     * @example
     * ```typescript
     * const result = await agent.streamLegacy('Tell me a story');
     * for await (const chunk of result.textStream) {
     *   process.stdout.write(chunk);
     * }
     * ```
     */
    streamLegacy<OUTPUT extends ZodSchema | JSONSchema7 | undefined = undefined, EXPERIMENTAL_OUTPUT extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: MessageListInput, args?: AgentStreamOptions<OUTPUT, EXPERIMENTAL_OUTPUT> & {
        output?: never;
        experimental_output?: never;
    }): Promise<StreamTextResult<any, OUTPUT extends ZodSchema ? z.infer<OUTPUT> : unknown>>;
    streamLegacy<OUTPUT extends ZodSchema | JSONSchema7 | undefined = undefined, EXPERIMENTAL_OUTPUT extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: MessageListInput, args?: AgentStreamOptions<OUTPUT, EXPERIMENTAL_OUTPUT> & {
        output?: OUTPUT;
        experimental_output?: never;
    }): Promise<StreamObjectResult<any, OUTPUT extends ZodSchema ? z.infer<OUTPUT> : unknown, any> & TracingProperties>;
    streamLegacy<OUTPUT extends ZodSchema | JSONSchema7 | undefined = undefined, EXPERIMENTAL_OUTPUT extends ZodSchema | JSONSchema7 | undefined = undefined>(messages: MessageListInput, args?: AgentStreamOptions<OUTPUT, EXPERIMENTAL_OUTPUT> & {
        output?: never;
        experimental_output?: EXPERIMENTAL_OUTPUT;
    }): Promise<StreamTextResult<any, OUTPUT extends ZodSchema ? z.infer<OUTPUT> : unknown> & {
        partialObjectStream: StreamTextResult<any, OUTPUT extends ZodSchema ? z.infer<OUTPUT> : EXPERIMENTAL_OUTPUT extends ZodSchema ? z.infer<EXPERIMENTAL_OUTPUT> : unknown>['experimental_partialOutputStream'];
    }>;
    /**
     * Convert text to speech using the configured voice provider
     * @param input Text or text stream to convert to speech
     * @param options Speech options including speaker and provider-specific options
     * @returns Audio stream
     * @deprecated Use agent.voice.speak() instead
     */
    speak(input: string | NodeJS.ReadableStream, options?: {
        speaker?: string;
        [key: string]: any;
    }): Promise<NodeJS.ReadableStream | void>;
    /**
     * Convert speech to text using the configured voice provider
     * @param audioStream Audio stream to transcribe
     * @param options Provider-specific transcription options
     * @returns Text or text stream
     * @deprecated Use agent.voice.listen() instead
     */
    listen(audioStream: NodeJS.ReadableStream, options?: {
        [key: string]: any;
    }): Promise<string | NodeJS.ReadableStream | void>;
    /**
     * Get a list of available speakers from the configured voice provider
     * @throws {Error} If no voice provider is configured
     * @returns {Promise<Array<{voiceId: string}>>} List of available speakers
     * @deprecated Use agent.voice.getSpeakers() instead
     */
    getSpeakers(): Promise<{
        voiceId: string;
    }[]>;
    /**
     * Converts the agent to a workflow step for use in legacy workflows.
     * The step accepts a prompt and returns text output.
     *
     * @deprecated Use agent directly in workflows instead
     *
     * @example
     * ```typescript
     * const agentStep = agent.toStep();
     * const workflow = new Workflow({
     *   steps: {
     *     analyze: agentStep
     *   }
     * });
     * ```
     */
    toStep(): Step<TAgentId, z.ZodObject<{
        prompt: z.ZodString;
    }>, z.ZodObject<{
        text: z.ZodString;
    }>, any>;
    /**
     * Resolves the configuration for title generation.
     * @internal
     */
    resolveTitleGenerationConfig(generateTitleConfig: boolean | {
        model: DynamicArgument<MastraModelConfig>;
        instructions?: DynamicArgument<string>;
    } | undefined): {
        shouldGenerate: boolean;
        model?: DynamicArgument<MastraModelConfig>;
        instructions?: DynamicArgument<string>;
    };
    /**
     * Resolves title generation instructions, handling both static strings and dynamic functions
     * @internal
     */
    resolveTitleInstructions(runtimeContext: RuntimeContext, instructions?: DynamicArgument<string>): Promise<string>;
}
export {};
//# sourceMappingURL=agent.d.ts.map