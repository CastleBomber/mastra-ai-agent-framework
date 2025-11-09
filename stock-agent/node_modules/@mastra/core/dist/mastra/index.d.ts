import type { Agent } from '../agent/index.js';
import type { ObservabilityRegistryConfig } from '../ai-tracing/index.js';
import type { BundlerConfig } from '../bundler/types.js';
import type { MastraServerCache } from '../cache/index.js';
import type { MastraDeployer } from '../deployer/index.js';
import type { PubSub } from '../events/pubsub.js';
import type { Event } from '../events/types.js';
import { LogLevel } from '../logger/index.js';
import type { IMastraLogger } from '../logger/index.js';
import type { MCPServerBase } from '../mcp/index.js';
import type { MastraMemory } from '../memory/memory.js';
import type { MastraScorer } from '../scores/index.js';
import type { Middleware, ServerConfig } from '../server/types.js';
import type { MastraStorage } from '../storage/index.js';
import { Telemetry } from '../telemetry/index.js';
import type { OtelConfig } from '../telemetry/index.js';
import type { MastraTTS } from '../tts/index.js';
import type { MastraIdGenerator } from '../types/index.js';
import type { MastraVector } from '../vector/index.js';
import type { Workflow } from '../workflows/index.js';
import type { LegacyWorkflow } from '../workflows/legacy/index.js';
/**
 * Configuration interface for initializing a Mastra instance.
 *
 * The Config interface defines all the optional components that can be registered
 * with a Mastra instance, including agents, workflows, storage, logging, and more.
 *
 * @template TAgents - Record of agent instances keyed by their names
 * @template TLegacyWorkflows - Record of legacy workflow instances
 * @template TWorkflows - Record of workflow instances
 * @template TVectors - Record of vector store instances
 * @template TTTS - Record of text-to-speech instances
 * @template TLogger - Logger implementation type
 * @template TVNextNetworks - Record of agent network instances
 * @template TMCPServers - Record of MCP server instances
 * @template TScorers - Record of scorer instances
 *
 * @example
 * ```typescript
 * const mastra = new Mastra({
 *   agents: {
 *     weatherAgent: new Agent({
 *       name: 'weather-agent',
 *       instructions: 'You help with weather information',
 *       model: 'openai/gpt-5'
 *     })
 *   },
 *   storage: new LibSQLStore({ url: ':memory:' }),
 *   logger: new PinoLogger({ name: 'MyApp' })
 * });
 * ```
 */
export interface Config<TAgents extends Record<string, Agent<any>> = Record<string, Agent<any>>, TLegacyWorkflows extends Record<string, LegacyWorkflow> = Record<string, LegacyWorkflow>, TWorkflows extends Record<string, Workflow<any, any, any, any, any, any>> = Record<string, Workflow<any, any, any, any, any, any>>, TVectors extends Record<string, MastraVector> = Record<string, MastraVector>, TTTS extends Record<string, MastraTTS> = Record<string, MastraTTS>, TLogger extends IMastraLogger = IMastraLogger, TMCPServers extends Record<string, MCPServerBase> = Record<string, MCPServerBase>, TScorers extends Record<string, MastraScorer<any, any, any, any>> = Record<string, MastraScorer<any, any, any, any>>> {
    /**
     * Agents are autonomous systems that can make decisions and take actions.
     */
    agents?: TAgents;
    /**
     * Storage provider for persisting data, conversation history, and workflow state.
     * Required for agent memory and workflow persistence.
     */
    storage?: MastraStorage;
    /**
     * Vector stores for semantic search and retrieval-augmented generation (RAG).
     * Used for storing and querying embeddings.
     */
    vectors?: TVectors;
    /**
     * Logger implementation for application logging and debugging.
     * Set to `false` to disable logging entirely.
     * @default `INFO` level in development, `WARN` in production.
     */
    logger?: TLogger | false;
    /**
     * Legacy workflow definitions for backward compatibility.
     * @deprecated Use `workflows` instead.
     */
    legacy_workflows?: TLegacyWorkflows;
    /**
     * Workflows provide type-safe, composable task execution with built-in error handling.
     */
    workflows?: TWorkflows;
    /**
     * Text-to-speech providers for voice synthesis capabilities.
     */
    tts?: TTTS;
    /**
     * OpenTelemetry configuration for distributed tracing and observability.
     *
     * @deprecated Use {@link observability} instead.
     */
    telemetry?: OtelConfig;
    /**
     * AI-specific observability configuration for tracking model interactions.
     */
    observability?: ObservabilityRegistryConfig;
    /**
     * Custom ID generator function for creating unique identifiers.
     * @default `crypto.randomUUID()`
     */
    idGenerator?: MastraIdGenerator;
    /**
     * Deployment provider for publishing applications to cloud platforms.
     */
    deployer?: MastraDeployer;
    /**
     * Server configuration for HTTP endpoints and middleware.
     */
    server?: ServerConfig;
    /**
     * MCP servers provide tools and resources that agents can use.
     */
    mcpServers?: TMCPServers;
    /**
     * Bundler configuration for packaging and deployment.
     */
    bundler?: BundlerConfig;
    /**
     * Pub/sub system for event-driven communication between components.
     * @default EventEmitterPubSub
     */
    pubsub?: PubSub;
    /**
     * Scorers help assess the quality of agent responses and workflow outputs.
     */
    scorers?: TScorers;
    /**
     * Server middleware functions to be applied to API routes
     * Each middleware can specify a path pattern (defaults to '/api/*')
     * @deprecated use server.middleware instead
     */
    serverMiddleware?: Array<{
        handler: (c: any, next: () => Promise<void>) => Promise<Response | void>;
        path?: string;
    }>;
    memory?: never;
    /**
     * Event handlers for custom application events.
     * Maps event topics to handler functions for event-driven architectures.
     */
    events?: {
        [topic: string]: (event: Event, cb?: () => Promise<void>) => Promise<void> | ((event: Event, cb?: () => Promise<void>) => Promise<void>)[];
    };
}
export declare class Mastra<TAgents extends Record<string, Agent<any>> = Record<string, Agent<any>>, TLegacyWorkflows extends Record<string, LegacyWorkflow> = Record<string, LegacyWorkflow>, TWorkflows extends Record<string, Workflow<any, any, any, any, any, any>> = Record<string, Workflow<any, any, any, any, any, any>>, TVectors extends Record<string, MastraVector> = Record<string, MastraVector>, TTTS extends Record<string, MastraTTS> = Record<string, MastraTTS>, TLogger extends IMastraLogger = IMastraLogger, TMCPServers extends Record<string, MCPServerBase> = Record<string, MCPServerBase>, TScorers extends Record<string, MastraScorer<any, any, any, any>> = Record<string, MastraScorer<any, any, any, any>>> {
    #private;
    /**
     * @deprecated use {@link getAITracing()} instead
     */
    get telemetry(): Telemetry | undefined;
    /**
     * @deprecated use getStorage() instead
     */
    get storage(): MastraStorage | undefined;
    /**
     * @deprecated use getMemory() instead
     */
    get memory(): MastraMemory | undefined;
    get pubsub(): PubSub;
    /**
     * Gets the currently configured ID generator function.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   idGenerator: () => `custom-${Date.now()}`
     * });
     * const generator = mastra.getIdGenerator();
     * console.log(generator?.()); // "custom-1234567890"
     * ```
     */
    getIdGenerator(): MastraIdGenerator | undefined;
    /**
     * Generates a unique identifier using the configured generator or defaults to `crypto.randomUUID()`.
     *
     * This method is used internally by Mastra for creating unique IDs for various entities
     * like workflow runs, agent conversations, and other resources that need unique identification.
     *
     * @throws {MastraError} When the custom ID generator returns an empty string
     *
     * @example
     * ```typescript
     * const mastra = new Mastra();
     * const id = mastra.generateId();
     * console.log(id); // "550e8400-e29b-41d4-a716-446655440000"
     * ```
     */
    generateId(): string;
    /**
     * Sets a custom ID generator function for creating unique identifiers.
     *
     * The ID generator function will be used by `generateId()` instead of the default
     * `crypto.randomUUID()`. This is useful for creating application-specific ID formats
     * or integrating with existing ID generation systems.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra();
     * mastra.setIdGenerator(() => `custom-${Date.now()}`);
     * const id = mastra.generateId();
     * console.log(id); // "custom-1234567890"
     * ```
     */
    setIdGenerator(idGenerator: MastraIdGenerator): void;
    /**
     * Creates a new Mastra instance with the provided configuration.
     *
     * The constructor initializes all the components specified in the config, sets up
     * internal systems like logging and telemetry, and registers components with each other.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   agents: {
     *     assistant: new Agent({
     *       name: 'assistant',
     *       instructions: 'You are a helpful assistant',
     *       model: 'openai/gpt-5'
     *     })
     *   },
     *   storage: new PostgresStore({
     *     connectionString: process.env.DATABASE_URL
     *   }),
     *   logger: new PinoLogger({ name: 'MyApp' })
     * });
     * ```
     */
    constructor(config?: Config<TAgents, TLegacyWorkflows, TWorkflows, TVectors, TTTS, TLogger, TMCPServers, TScorers>);
    /**
     * Register this Mastra instance with AI tracing exporters that need it
     */
    private registerAITracingExporters;
    /**
     * Initialize all AI tracing exporters after registration is complete
     */
    private initAITracingExporters;
    /**
     * Retrieves a registered agent by its name.
     *
     * @template TAgentName - The specific agent name type from the registered agents
     * @throws {MastraError} When the agent with the specified name is not found
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   agents: {
     *     weatherAgent: new Agent({
     *       name: 'weather-agent',
     *       instructions: 'You provide weather information',
     *       model: 'openai/gpt-5'
     *     })
     *   }
     * });
     * const agent = mastra.getAgent('weatherAgent');
     * const response = await agent.generate('What is the weather?');
     * ```
     */
    getAgent<TAgentName extends keyof TAgents>(name: TAgentName): TAgents[TAgentName];
    /**
     * Retrieves a registered agent by its unique ID.
     *
     * This method searches for an agent using its internal ID property. If no agent
     * is found with the given ID, it also attempts to find an agent using the ID as
     * a name (for backward compatibility).
     *
     * @throws {MastraError} When no agent is found with the specified ID
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   agents: {
     *     assistant: new Agent({
     *       name: 'assistant',
     *       instructions: 'You are a helpful assistant',
     *       model: 'openai/gpt-5'
     *     })
     *   }
     * });
     *
     * const assistant = mastra.getAgent('assistant');
     * const sameAgent = mastra.getAgentById(assistant.id);
     * ```
     */
    getAgentById(id: string): Agent;
    /**
     * Returns all registered agents as a record keyed by their names.
     *
     * This method provides access to the complete registry of agents, allowing you to
     * iterate over them, check what agents are available, or perform bulk operations.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   agents: {
     *     weatherAgent: new Agent({ name: 'weather', model: openai('gpt-4o') }),
     *     supportAgent: new Agent({ name: 'support', model: openai('gpt-4o') })
     *   }
     * });
     *
     * const allAgents = mastra.getAgents();
     * console.log(Object.keys(allAgents)); // ['weatherAgent', 'supportAgent']
     * ```
     */
    getAgents(): TAgents;
    /**
     * Retrieves a registered vector store by its name.
     *
     * @template TVectorName - The specific vector store name type from the registered vectors
     * @throws {MastraError} When the vector store with the specified name is not found
     *
     * @example Using a vector store for semantic search
     * ```typescript
     * import { PineconeVector } from '@mastra/pinecone';
     * import { OpenAIEmbedder } from '@mastra/embedders';
     *
     * const mastra = new Mastra({
     *   vectors: {
     *     knowledge: new PineconeVector({
     *       apiKey: process.env.PINECONE_API_KEY,
     *       indexName: 'knowledge-base',
     *       embedder: new OpenAIEmbedder({
     *         apiKey: process.env.OPENAI_API_KEY,
     *         model: 'text-embedding-3-small'
     *       })
     *     }),
     *     products: new PineconeVector({
     *       apiKey: process.env.PINECONE_API_KEY,
     *       indexName: 'product-catalog'
     *     })
     *   }
     * });
     *
     * // Get a vector store and perform semantic search
     * const knowledgeBase = mastra.getVector('knowledge');
     * const results = await knowledgeBase.query({
     *   query: 'How to reset password?',
     *   topK: 5
     * });
     *
     * console.log('Relevant documents:', results);
     * ```
     */
    getVector<TVectorName extends keyof TVectors>(name: TVectorName): TVectors[TVectorName];
    /**
     * Returns all registered vector stores as a record keyed by their names.
     *
     * @example Listing all vector stores
     * ```typescript
     * const mastra = new Mastra({
     *   vectors: {
     *     documents: new PineconeVector({ indexName: 'docs' }),
     *     images: new PineconeVector({ indexName: 'images' }),
     *     products: new ChromaVector({ collectionName: 'products' })
     *   }
     * });
     *
     * const allVectors = mastra.getVectors();
     * console.log(Object.keys(allVectors)); // ['documents', 'images', 'products']
     *
     * // Check vector store types and configurations
     * for (const [name, vectorStore] of Object.entries(allVectors)) {
     *   console.log(`Vector store ${name}:`, vectorStore.constructor.name);
     * }
     * ```
     */
    getVectors(): TVectors | undefined;
    /**
     * Gets the currently configured deployment provider.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   deployer: new VercelDeployer({
     *     token: process.env.VERCEL_TOKEN,
     *     projectId: process.env.VERCEL_PROJECT_ID
     *   })
     * });
     *
     * const deployer = mastra.getDeployer();
     * if (deployer) {
     *   await deployer.deploy({
     *     name: 'my-mastra-app',
     *     environment: 'production'
     *   });
     * }
     * ```
     */
    getDeployer(): MastraDeployer | undefined;
    /**
     * Retrieves a registered legacy workflow by its ID.
     *
     * Legacy workflows are the previous generation of workflow system in Mastra,
     * maintained for backward compatibility. For new implementations, use the
     * modern workflow system accessed via `getWorkflow()`.
     *
     * @template TWorkflowId - The specific workflow ID type from the registered legacy workflows
     * @throws {MastraError} When the legacy workflow with the specified ID is not found
     * @deprecated Use `getWorkflow()` for new implementations
     *
     * @example Getting a legacy workflow
     * ```typescript
     * const mastra = new Mastra({
     *   legacy_workflows: {
     *     oldDataFlow: legacyWorkflowInstance
     *   }
     * });
     *
     * const workflow = mastra.legacy_getWorkflow('oldDataFlow');
     * const result = await workflow.execute({ input: 'data' });
     * ```
     */
    legacy_getWorkflow<TWorkflowId extends keyof TLegacyWorkflows>(id: TWorkflowId, { serialized }?: {
        serialized?: boolean;
    }): TLegacyWorkflows[TWorkflowId];
    /**
     * Retrieves a registered workflow by its ID.
     *
     * @template TWorkflowId - The specific workflow ID type from the registered workflows
     * @throws {MastraError} When the workflow with the specified ID is not found
     *
     * @example Getting and executing a workflow
     * ```typescript
     * import { createWorkflow, createStep } from '@mastra/core/workflows';
     * import { z } from 'zod';
     *
     * const processDataWorkflow = createWorkflow({
     *   name: 'process-data',
     *   triggerSchema: z.object({ input: z.string() })
     * })
     *   .then(validateStep)
     *   .then(transformStep)
     *   .then(saveStep)
     *   .commit();
     *
     * const mastra = new Mastra({
     *   workflows: {
     *     dataProcessor: processDataWorkflow
     *   }
     * });
     * ```
     */
    getWorkflow<TWorkflowId extends keyof TWorkflows>(id: TWorkflowId, { serialized }?: {
        serialized?: boolean;
    }): TWorkflows[TWorkflowId];
    __registerInternalWorkflow(workflow: Workflow): void;
    __hasInternalWorkflow(id: string): boolean;
    __getInternalWorkflow(id: string): Workflow;
    /**
     * Retrieves a registered workflow by its unique ID.
     *
     * This method searches for a workflow using its internal ID property. If no workflow
     * is found with the given ID, it also attempts to find a workflow using the ID as
     * a name (for backward compatibility).
     *
     * @throws {MastraError} When no workflow is found with the specified ID
     *
     * @example Finding a workflow by ID
     * ```typescript
     * const mastra = new Mastra({
     *   workflows: {
     *     dataProcessor: createWorkflow({
     *       name: 'process-data',
     *       triggerSchema: z.object({ input: z.string() })
     *     }).commit()
     *   }
     * });
     *
     * // Get the workflow's ID
     * const workflow = mastra.getWorkflow('dataProcessor');
     * const workflowId = workflow.id;
     *
     * // Later, retrieve the workflow by ID
     * const sameWorkflow = mastra.getWorkflowById(workflowId);
     * console.log(sameWorkflow.name); // "process-data"
     * ```
     */
    getWorkflowById(id: string): Workflow;
    /**
     * Returns all registered legacy workflows as a record keyed by their IDs.
     *
     * Legacy workflows are the previous generation of workflow system in Mastra,
     * maintained for backward compatibility. For new implementations, use `getWorkflows()`.
     *
     * @deprecated Use `getWorkflows()` for new implementations
     *
     * @example Listing all legacy workflows
     * ```typescript
     * const mastra = new Mastra({
     *   legacy_workflows: {
     *     oldFlow1: legacyWorkflow1,
     *     oldFlow2: legacyWorkflow2
     *   }
     * });
     *
     * const allLegacyWorkflows = mastra.legacy_getWorkflows();
     * console.log(Object.keys(allLegacyWorkflows)); // ['oldFlow1', 'oldFlow2']
     *
     * // Execute all legacy workflows
     * for (const [id, workflow] of Object.entries(allLegacyWorkflows)) {
     *   console.log(`Legacy workflow ${id}:`, workflow.name);
     * }
     * ```
     */
    legacy_getWorkflows(props?: {
        serialized?: boolean;
    }): Record<string, LegacyWorkflow>;
    /**
     * Returns all registered scorers as a record keyed by their IDs.
     *
     * @example Listing all scorers
     * ```typescript
     * import { HelpfulnessScorer, AccuracyScorer, RelevanceScorer } from '@mastra/scorers';
     *
     * const mastra = new Mastra({
     *   scorers: {
     *     helpfulness: new HelpfulnessScorer(),
     *     accuracy: new AccuracyScorer(),
     *     relevance: new RelevanceScorer()
     *   }
     * });
     *
     * const allScorers = mastra.getScorers();
     * console.log(Object.keys(allScorers)); // ['helpfulness', 'accuracy', 'relevance']
     *
     * // Check scorer configurations
     * for (const [id, scorer] of Object.entries(allScorers)) {
     *   console.log(`Scorer ${id}:`, scorer.name, scorer.description);
     * }
     * ```
     */
    getScorers(): TScorers | undefined;
    /**
     * Retrieves a registered scorer by its key.
     *
     * @template TScorerKey - The specific scorer key type from the registered scorers
     * @throws {MastraError} When the scorer with the specified key is not found
     *
     * @example Getting and using a scorer
     * ```typescript
     * import { HelpfulnessScorer, AccuracyScorer } from '@mastra/scorers';
     *
     * const mastra = new Mastra({
     *   scorers: {
     *     helpfulness: new HelpfulnessScorer({
     *       model: openai('gpt-4o'),
     *       criteria: 'Rate how helpful this response is'
     *     }),
     *     accuracy: new AccuracyScorer({
     *       model: 'openai/gpt-5'
     *     })
     *   }
     * });
     *
     * // Get a specific scorer
     * const helpfulnessScorer = mastra.getScorer('helpfulness');
     * const score = await helpfulnessScorer.score({
     *   input: 'How do I reset my password?',
     *   output: 'You can reset your password by clicking the forgot password link.',
     *   expected: 'Detailed password reset instructions'
     * });
     *
     * console.log('Helpfulness score:', score);
     * ```
     */
    getScorer<TScorerKey extends keyof TScorers>(key: TScorerKey): TScorers[TScorerKey];
    /**
     * Retrieves a registered scorer by its name.
     *
     * This method searches through all registered scorers to find one with the specified name.
     * Unlike `getScorer()` which uses the registration key, this method uses the scorer's
     * internal name property.
     *
     * @throws {MastraError} When no scorer is found with the specified name
     *
     * @example Finding a scorer by name
     * ```typescript
     * import { HelpfulnessScorer } from '@mastra/scorers';
     *
     * const mastra = new Mastra({
     *   scorers: {
     *     myHelpfulnessScorer: new HelpfulnessScorer({
     *       name: 'helpfulness-evaluator',
     *       model: 'openai/gpt-5'
     *     })
     *   }
     * });
     *
     * // Find scorer by its internal name, not the registration key
     * const scorer = mastra.getScorerByName('helpfulness-evaluator');
     * const score = await scorer.score({
     *   input: 'question',
     *   output: 'answer'
     * });
     * ```
     */
    getScorerByName(name: string): MastraScorer<any, any, any, any>;
    /**
     * Returns all registered workflows as a record keyed by their IDs.
     *
     * @example Listing all workflows
     * ```typescript
     * const mastra = new Mastra({
     *   workflows: {
     *     dataProcessor: createWorkflow({...}).commit(),
     *     emailSender: createWorkflow({...}).commit(),
     *     reportGenerator: createWorkflow({...}).commit()
     *   }
     * });
     *
     * const allWorkflows = mastra.getWorkflows();
     * console.log(Object.keys(allWorkflows)); // ['dataProcessor', 'emailSender', 'reportGenerator']
     *
     * // Execute all workflows with sample data
     * for (const [id, workflow] of Object.entries(allWorkflows)) {
     *   console.log(`Workflow ${id}:`, workflow.name);
     *   // const result = await workflow.execute(sampleData);
     * }
     * ```
     */
    getWorkflows(props?: {
        serialized?: boolean;
    }): Record<string, Workflow>;
    /**
     * Sets the storage provider for the Mastra instance.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra();
     *
     * // Set PostgreSQL storage
     * mastra.setStorage(new PostgresStore({
     *   connectionString: process.env.DATABASE_URL
     * }));
     *
     * // Now agents can use memory with the storage
     * const agent = new Agent({
     *   name: 'assistant',
     *   memory: new Memory({ storage: mastra.getStorage() })
     * });
     * ```
     */
    setStorage(storage: MastraStorage): void;
    setLogger({ logger }: {
        logger: TLogger;
    }): void;
    setTelemetry(telemetry: OtelConfig): void;
    /**
     * Gets all registered text-to-speech (TTS) providers.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   tts: {
     *     openai: new OpenAITTS({
     *       apiKey: process.env.OPENAI_API_KEY,
     *       voice: 'alloy'
     *     })
     *   }
     * });
     *
     * const ttsProviders = mastra.getTTS();
     * const openaiTTS = ttsProviders?.openai;
     * if (openaiTTS) {
     *   const audioBuffer = await openaiTTS.synthesize('Hello, world!');
     * }
     * ```
     */
    getTTS(): TTTS | undefined;
    /**
     * Gets the currently configured logger instance.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   logger: new PinoLogger({
     *     name: 'MyApp',
     *     level: 'info'
     *   })
     * });
     *
     * const logger = mastra.getLogger();
     * logger.info('Application started');
     * logger.error('An error occurred', { error: 'details' });
     * ```
     */
    getLogger(): TLogger;
    /**
     * Gets the currently configured telemetry instance.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   telemetry: {
     *     enabled: true,
     *     serviceName: 'my-mastra-app'
     *   }
     * });
     *
     * const telemetry = mastra.getTelemetry();
     * if (telemetry) {
     *   const span = telemetry.startSpan('custom-operation');
     *   span.setAttributes({ operation: 'data-processing' });
     *   span.end();
     * }
     * ```
     *
     * @deprecated use {@link getAITracing()} instead
     */
    getTelemetry(): Telemetry | undefined;
    /**
     * Gets the currently configured memory instance.
     *
     * @deprecated Memory should be configured directly on agents instead of on the Mastra instance.
     * Use `new Agent({ memory: new Memory() })` instead.
     *
     * @example Legacy memory usage (deprecated)
     * ```typescript
     * // This approach is deprecated
     * const mastra = new Mastra({
     *   // memory: new Memory() // This is no longer supported
     * });
     *
     * // Use this instead:
     * const agent = new Agent({
     *   name: 'assistant',
     *   memory: new Memory({
     *     storage: new LibSQLStore({ url: ':memory:' })
     *   })
     * });
     * ```
     */
    getMemory(): MastraMemory | undefined;
    /**
     * Gets the currently configured storage provider.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   storage: new LibSQLStore({ url: 'file:./data.db' })
     * });
     *
     * // Use the storage in agent memory
     * const agent = new Agent({
     *   name: 'assistant',
     *   memory: new Memory({
     *     storage: mastra.getStorage()
     *   })
     * });
     * ```
     */
    getStorage(): MastraStorage | undefined;
    getServerMiddleware(): {
        handler: (c: any, next: () => Promise<void>) => Promise<Response | void>;
        path: string;
    }[];
    getServerCache(): MastraServerCache;
    setServerMiddleware(serverMiddleware: Middleware | Middleware[]): void;
    getServer(): ServerConfig | undefined;
    getBundlerConfig(): BundlerConfig | undefined;
    getLogsByRunId({ runId, transportId, fromDate, toDate, logLevel, filters, page, perPage, }: {
        runId: string;
        transportId: string;
        fromDate?: Date;
        toDate?: Date;
        logLevel?: LogLevel;
        filters?: Record<string, any>;
        page?: number;
        perPage?: number;
    }): Promise<{
        logs: import("../logger").BaseLogMessage[];
        total: number;
        page: number;
        perPage: number;
        hasMore: boolean;
    }>;
    getLogs(transportId: string, params?: {
        fromDate?: Date;
        toDate?: Date;
        logLevel?: LogLevel;
        filters?: Record<string, any>;
        page?: number;
        perPage?: number;
    }): Promise<{
        logs: import("../logger").BaseLogMessage[];
        total: number;
        page: number;
        perPage: number;
        hasMore: boolean;
    }>;
    /**
     * Gets all registered Model Context Protocol (MCP) server instances.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   mcpServers: {
     *     filesystem: new FileSystemMCPServer({
     *       rootPath: '/app/data'
     *     })
     *   }
     * });
     *
     * const mcpServers = mastra.getMCPServers();
     * if (mcpServers) {
     *   const fsServer = mcpServers.filesystem;
     *   const tools = await fsServer.getTools();
     * }
     * ```
     */
    getMCPServers(): Record<string, MCPServerBase> | undefined;
    /**
     * Retrieves a specific Model Context Protocol (MCP) server instance by its logical ID.
     *
     * This method searches for an MCP server using its logical ID. If a version is specified,
     * it returns the exact version match. If no version is provided, it returns the server
     * with the most recent release date.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   mcpServers: {
     *     filesystem: new FileSystemMCPServer({
     *       id: 'fs-server',
     *       version: '1.0.0',
     *       rootPath: '/app/data'
     *     })
     *   }
     * });
     *
     * const fsServer = mastra.getMCPServer('fs-server');
     * if (fsServer) {
     *   const tools = await fsServer.getTools();
     * }
     * ```
     */
    getMCPServer(serverId: string, version?: string): MCPServerBase | undefined;
    addTopicListener(topic: string, listener: (event: any) => Promise<void>): Promise<void>;
    removeTopicListener(topic: string, listener: (event: any) => Promise<void>): Promise<void>;
    startEventEngine(): Promise<void>;
    stopEventEngine(): Promise<void>;
    /**
     * Gracefully shuts down the Mastra instance and cleans up all resources.
     *
     * This method performs a clean shutdown of all Mastra components, including:
     * - AI tracing registry and all tracing instances
     * - Event engine and pub/sub system
     * - All registered components and their resources
     *
     * It's important to call this method when your application is shutting down
     * to ensure proper cleanup and prevent resource leaks.
     *
     * @example
     * ```typescript
     * const mastra = new Mastra({
     *   agents: { myAgent },
     *   workflows: { myWorkflow }
     * });
     *
     * // Graceful shutdown on SIGINT
     * process.on('SIGINT', async () => {
     *   await mastra.shutdown();
     *   process.exit(0);
     * });
     * ```
     */
    shutdown(): Promise<void>;
    get serverCache(): MastraServerCache;
}
//# sourceMappingURL=index.d.ts.map