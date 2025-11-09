/**
 * AI Tracing Registry for Mastra
 *
 * Provides a global registry for AI tracing instances.
 */
import type { AITracing, ConfigSelectorOptions, ConfigSelector, ObservabilityRegistryConfig } from './types.js';
/**
 * Register an AI tracing instance globally
 */
export declare function registerAITracing(name: string, instance: AITracing, isDefault?: boolean): void;
/**
 * Get an AI tracing instance from the registry
 */
export declare function getAITracing(name: string): AITracing | undefined;
/**
 * Get the default AI tracing instance
 */
export declare function getDefaultAITracing(): AITracing | undefined;
/**
 * Set the AI tracing config selector
 */
export declare function setSelector(selector: ConfigSelector): void;
/**
 * Get the selected AI tracing instance based on options
 */
export declare function getSelectedAITracing(options: ConfigSelectorOptions): AITracing | undefined;
/**
 * Unregister an AI tracing instance
 */
export declare function unregisterAITracing(name: string): boolean;
/**
 * Shutdown all AI tracing instances and clear the registry
 */
export declare function shutdownAITracingRegistry(): Promise<void>;
/**
 * Clear all AI tracing instances without shutdown
 */
export declare function clearAITracingRegistry(): void;
/**
 * Get all registered AI tracing instances
 */
export declare function getAllAITracing(): ReadonlyMap<string, AITracing>;
/**
 * Check if AI tracing is available and enabled
 */
export declare function hasAITracing(name: string): boolean;
/**
 * Setup AI tracing from the ObservabilityRegistryConfig
 */
export declare function setupAITracing(config: ObservabilityRegistryConfig): void;
//# sourceMappingURL=registry.d.ts.map