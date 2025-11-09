'use strict';

var chunk4R2TBRS7_cjs = require('./chunk-4R2TBRS7.cjs');
var chunk5NTO7S5I_cjs = require('./chunk-5NTO7S5I.cjs');
var chunk6VOPKVYH_cjs = require('./chunk-6VOPKVYH.cjs');

// src/storage/base.ts
function ensureDate(date) {
  if (!date) return void 0;
  return date instanceof Date ? date : new Date(date);
}
function serializeDate(date) {
  if (!date) return void 0;
  const dateObj = ensureDate(date);
  return dateObj?.toISOString();
}
function resolveMessageLimit({
  last,
  defaultLimit
}) {
  if (typeof last === "number") return Math.max(0, last);
  if (last === false) return 0;
  return defaultLimit;
}
var MastraStorage = class extends chunk6VOPKVYH_cjs.MastraBase {
  /** @deprecated import from { TABLE_WORKFLOW_SNAPSHOT } '@mastra/core/storage' instead */
  static TABLE_WORKFLOW_SNAPSHOT = chunk4R2TBRS7_cjs.TABLE_WORKFLOW_SNAPSHOT;
  /** @deprecated import from { TABLE_EVALS } '@mastra/core/storage' instead */
  static TABLE_EVALS = chunk4R2TBRS7_cjs.TABLE_EVALS;
  /** @deprecated import from { TABLE_MESSAGES } '@mastra/core/storage' instead */
  static TABLE_MESSAGES = chunk4R2TBRS7_cjs.TABLE_MESSAGES;
  /** @deprecated import from { TABLE_THREADS } '@mastra/core/storage' instead */
  static TABLE_THREADS = chunk4R2TBRS7_cjs.TABLE_THREADS;
  /** @deprecated import { TABLE_TRACES } from '@mastra/core/storage' instead */
  static TABLE_TRACES = chunk4R2TBRS7_cjs.TABLE_TRACES;
  hasInitialized = null;
  shouldCacheInit = true;
  stores;
  constructor({ name }) {
    super({
      component: "STORAGE",
      name
    });
  }
  get supports() {
    return {
      selectByIncludeResourceScope: false,
      resourceWorkingMemory: false,
      hasColumn: false,
      createTable: false,
      deleteMessages: false,
      aiTracing: false,
      indexManagement: false,
      getScoresBySpan: false
    };
  }
  ensureDate(date) {
    return ensureDate(date);
  }
  serializeDate(date) {
    return serializeDate(date);
  }
  /**
   * Resolves limit for how many messages to fetch
   *
   * @param last The number of messages to fetch
   * @param defaultLimit The default limit to use if last is not provided
   * @returns The resolved limit
   */
  resolveMessageLimit({
    last,
    defaultLimit
  }) {
    return resolveMessageLimit({ last, defaultLimit });
  }
  getSqlType(type) {
    switch (type) {
      case "text":
        return "TEXT";
      case "timestamp":
        return "TIMESTAMP";
      case "float":
        return "FLOAT";
      case "integer":
        return "INTEGER";
      case "bigint":
        return "BIGINT";
      case "jsonb":
        return "JSONB";
      default:
        return "TEXT";
    }
  }
  getDefaultValue(type) {
    switch (type) {
      case "text":
      case "uuid":
        return "DEFAULT ''";
      case "timestamp":
        return "DEFAULT '1970-01-01 00:00:00'";
      case "integer":
      case "float":
      case "bigint":
        return "DEFAULT 0";
      case "jsonb":
        return "DEFAULT '{}'";
      default:
        return "DEFAULT ''";
    }
  }
  batchTraceInsert({ records }) {
    if (this.stores?.traces) {
      return this.stores.traces.batchTraceInsert({ records });
    }
    return this.batchInsert({ tableName: chunk4R2TBRS7_cjs.TABLE_TRACES, records });
  }
  async getResourceById(_) {
    throw new Error(
      `Resource working memory is not supported by this storage adapter (${this.constructor.name}). Supported storage adapters: LibSQL (@mastra/libsql), PostgreSQL (@mastra/pg), Upstash (@mastra/upstash). To use per-resource working memory, switch to one of these supported storage adapters.`
    );
  }
  async saveResource(_) {
    throw new Error(
      `Resource working memory is not supported by this storage adapter (${this.constructor.name}). Supported storage adapters: LibSQL (@mastra/libsql), PostgreSQL (@mastra/pg), Upstash (@mastra/upstash). To use per-resource working memory, switch to one of these supported storage adapters.`
    );
  }
  async updateResource(_) {
    throw new Error(
      `Resource working memory is not supported by this storage adapter (${this.constructor.name}). Supported storage adapters: LibSQL (@mastra/libsql), PostgreSQL (@mastra/pg), Upstash (@mastra/upstash). To use per-resource working memory, switch to one of these supported storage adapters.`
    );
  }
  async deleteMessages(_messageIds) {
    throw new Error(
      `Message deletion is not supported by this storage adapter (${this.constructor.name}). The deleteMessages method needs to be implemented in the storage adapter.`
    );
  }
  async init() {
    if (this.shouldCacheInit && await this.hasInitialized) {
      return;
    }
    const tableCreationTasks = [
      this.createTable({
        tableName: chunk4R2TBRS7_cjs.TABLE_WORKFLOW_SNAPSHOT,
        schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_WORKFLOW_SNAPSHOT]
      }),
      this.createTable({
        tableName: chunk4R2TBRS7_cjs.TABLE_EVALS,
        schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_EVALS]
      }),
      this.createTable({
        tableName: chunk4R2TBRS7_cjs.TABLE_THREADS,
        schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_THREADS]
      }),
      this.createTable({
        tableName: chunk4R2TBRS7_cjs.TABLE_MESSAGES,
        schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_MESSAGES]
      }),
      this.createTable({
        tableName: chunk4R2TBRS7_cjs.TABLE_TRACES,
        schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_TRACES]
      }),
      this.createTable({
        tableName: chunk4R2TBRS7_cjs.TABLE_SCORERS,
        schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_SCORERS]
      })
    ];
    if (this.supports.resourceWorkingMemory) {
      tableCreationTasks.push(
        this.createTable({
          tableName: chunk4R2TBRS7_cjs.TABLE_RESOURCES,
          schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_RESOURCES]
        })
      );
    }
    if (this.supports.aiTracing) {
      tableCreationTasks.push(
        this.createTable({
          tableName: chunk4R2TBRS7_cjs.TABLE_AI_SPANS,
          schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_AI_SPANS]
        })
      );
    }
    this.hasInitialized = Promise.all(tableCreationTasks).then(() => true);
    await this.hasInitialized;
    await this?.alterTable?.({
      tableName: chunk4R2TBRS7_cjs.TABLE_MESSAGES,
      schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_MESSAGES],
      ifNotExists: ["resourceId"]
    });
    await this?.alterTable?.({
      tableName: chunk4R2TBRS7_cjs.TABLE_WORKFLOW_SNAPSHOT,
      schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_WORKFLOW_SNAPSHOT],
      ifNotExists: ["resourceId"]
    });
    await this?.alterTable?.({
      tableName: chunk4R2TBRS7_cjs.TABLE_SCORERS,
      schema: chunk4R2TBRS7_cjs.TABLE_SCHEMAS[chunk4R2TBRS7_cjs.TABLE_SCORERS],
      ifNotExists: ["spanId"]
    });
  }
  async persistWorkflowSnapshot({
    workflowName,
    runId,
    resourceId,
    snapshot
  }) {
    await this.init();
    const data = {
      workflow_name: workflowName,
      run_id: runId,
      resourceId,
      snapshot,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.logger.debug("Persisting workflow snapshot", { workflowName, runId, data });
    await this.insert({
      tableName: chunk4R2TBRS7_cjs.TABLE_WORKFLOW_SNAPSHOT,
      record: data
    });
  }
  async loadWorkflowSnapshot({
    workflowName,
    runId
  }) {
    if (!this.hasInitialized) {
      await this.init();
    }
    this.logger.debug("Loading workflow snapshot", { workflowName, runId });
    const d = await this.load({
      tableName: chunk4R2TBRS7_cjs.TABLE_WORKFLOW_SNAPSHOT,
      keys: { workflow_name: workflowName, run_id: runId }
    });
    return d ? d.snapshot : null;
  }
  async getScoresBySpan({
    traceId,
    spanId,
    pagination: _pagination
  }) {
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "SCORES_STORAGE_GET_SCORES_BY_SPAN_NOT_IMPLEMENTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      details: { traceId, spanId }
    });
  }
  /**
   * OBSERVABILITY
   */
  /**
   * Provides hints for AI tracing strategy selection by the DefaultExporter.
   * Storage adapters can override this to specify their preferred and supported strategies.
   */
  get aiTracingStrategy() {
    if (this.stores?.observability) {
      return this.stores.observability.aiTracingStrategy;
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_TRACING_STRATEGY_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `AI tracing is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Creates a single AI span record in the storage provider.
   */
  async createAISpan(span) {
    if (this.stores?.observability) {
      return this.stores.observability.createAISpan(span);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_CREATE_AI_SPAN_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `AI tracing is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Updates a single AI span with partial data. Primarily used for realtime trace creation.
   */
  async updateAISpan(params) {
    if (this.stores?.observability) {
      return this.stores.observability.updateAISpan(params);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_UPDATE_AI_SPAN_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `AI tracing is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Retrieves a single AI trace with all its associated spans.
   */
  async getAITrace(traceId) {
    if (this.stores?.observability) {
      return this.stores.observability.getAITrace(traceId);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_GET_AI_TRACE_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `AI tracing is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Retrieves a paginated list of AI traces with optional filtering.
   */
  async getAITracesPaginated(args) {
    if (this.stores?.observability) {
      return this.stores.observability.getAITracesPaginated(args);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_GET_AI_TRACES_PAGINATED_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `AI tracing is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Creates multiple AI spans in a single batch.
   */
  async batchCreateAISpans(args) {
    if (this.stores?.observability) {
      return this.stores.observability.batchCreateAISpans(args);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_BATCH_CREATE_AI_SPANS_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `AI tracing is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Updates multiple AI spans in a single batch.
   */
  async batchUpdateAISpans(args) {
    if (this.stores?.observability) {
      return this.stores.observability.batchUpdateAISpans(args);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_BATCH_UPDATE_AI_SPANS_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `AI tracing is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Deletes multiple AI traces and all their associated spans in a single batch operation.
   */
  async batchDeleteAITraces(args) {
    if (this.stores?.observability) {
      return this.stores.observability.batchDeleteAITraces(args);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_BATCH_DELETE_AI_TRACES_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `AI tracing is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * DATABASE INDEX MANAGEMENT
   * These methods delegate to the operations store for index management.
   * Storage adapters that support indexes should implement these in their operations class.
   */
  /**
   * Creates a database index on specified columns
   * @throws {MastraError} if not supported by the storage adapter
   */
  async createIndex(options) {
    if (this.stores?.operations) {
      return this.stores.operations.createIndex(options);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_CREATE_INDEX_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `Index management is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Drops a database index by name
   * @throws {MastraError} if not supported by the storage adapter
   */
  async dropIndex(indexName) {
    if (this.stores?.operations) {
      return this.stores.operations.dropIndex(indexName);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_DROP_INDEX_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `Index management is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Lists database indexes for a table or all tables
   * @throws {MastraError} if not supported by the storage adapter
   */
  async listIndexes(tableName) {
    if (this.stores?.operations) {
      return this.stores.operations.listIndexes(tableName);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_LIST_INDEXES_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `Index management is not supported by this storage adapter (${this.constructor.name})`
    });
  }
  /**
   * Gets detailed statistics for a specific index
   * @throws {MastraError} if not supported by the storage adapter
   */
  async describeIndex(indexName) {
    if (this.stores?.operations) {
      return this.stores.operations.describeIndex(indexName);
    }
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_STORAGE_DESCRIBE_INDEX_NOT_SUPPORTED",
      domain: "STORAGE" /* STORAGE */,
      category: "SYSTEM" /* SYSTEM */,
      text: `Index management is not supported by this storage adapter (${this.constructor.name})`
    });
  }
};

exports.MastraStorage = MastraStorage;
exports.ensureDate = ensureDate;
exports.resolveMessageLimit = resolveMessageLimit;
exports.serializeDate = serializeDate;
//# sourceMappingURL=chunk-TX4TTPYJ.cjs.map
//# sourceMappingURL=chunk-TX4TTPYJ.cjs.map