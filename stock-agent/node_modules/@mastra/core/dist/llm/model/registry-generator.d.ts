/**
 * Shared provider registry generation logic
 * Used by both the CLI generation script and runtime refresh
 */
import type { MastraModelGateway, ProviderConfig } from './gateways/base.js';
/**
 * Fetch providers from all gateways with retry logic
 * @param gateways - Array of gateway instances to fetch from
 * @returns Object containing providers and models records
 */
export declare function fetchProvidersFromGateways(gateways: MastraModelGateway[]): Promise<{
    providers: Record<string, ProviderConfig>;
    models: Record<string, string[]>;
}>;
/**
 * Generate TypeScript type definitions content
 * @param models - Record of provider IDs to model arrays
 * @returns Generated TypeScript type definitions as a string
 */
export declare function generateTypesContent(models: Record<string, string[]>): string;
/**
 * Write registry files to disk (JSON and .d.ts)
 * @param jsonPath - Path to write the JSON file
 * @param typesPath - Path to write the .d.ts file
 * @param providers - Provider configurations
 * @param models - Model lists by provider
 */
export declare function writeRegistryFiles(jsonPath: string, typesPath: string, providers: Record<string, ProviderConfig>, models: Record<string, string[]>): Promise<void>;
//# sourceMappingURL=registry-generator.d.ts.map