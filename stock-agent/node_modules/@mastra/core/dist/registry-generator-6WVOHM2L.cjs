'use strict';

var fs = require('fs/promises');
var path = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);
var path__default = /*#__PURE__*/_interopDefault(path);

async function fetchProvidersFromGateways(gateways) {
  const allProviders = {};
  const allModels = {};
  const maxRetries = 3;
  for (const gateway of gateways) {
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const providers = await gateway.fetchProviders();
        for (const [providerId, config] of Object.entries(providers)) {
          allProviders[providerId] = config;
          allModels[providerId] = config.models.sort();
        }
        lastError = null;
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          const delayMs = Math.min(1e3 * Math.pow(2, attempt - 1), 5e3);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
    if (lastError) {
      throw lastError;
    }
  }
  return { providers: allProviders, models: allModels };
}
function generateTypesContent(models) {
  const providerModelsEntries = Object.entries(models).map(([provider, modelList]) => {
    const modelsList = modelList.map((m) => `'${m}'`);
    const needsQuotes = /[^a-zA-Z0-9_$]/.test(provider);
    const providerKey = needsQuotes ? `'${provider}'` : provider;
    const singleLine = `  readonly ${providerKey}: readonly [${modelsList.join(", ")}];`;
    if (singleLine.length > 120) {
      const formattedModels = modelList.map((m) => `    '${m}',`).join("\n");
      return `  readonly ${providerKey}: readonly [
${formattedModels}
  ];`;
    }
    return singleLine;
  }).join("\n");
  return `/**
 * THIS FILE IS AUTO-GENERATED - DO NOT EDIT
 * Generated from model gateway providers
 */

/**
 * Provider models mapping type
 * This is derived from the JSON data and provides type-safe access
 */
export type ProviderModelsMap = {
${providerModelsEntries}
};

/**
 * Union type of all registered provider IDs
 */
export type Provider = keyof ProviderModelsMap;

/**
 * Provider models mapping interface
 */
export interface ProviderModels {
  [key: string]: string[];
}

/**
 * OpenAI-compatible model ID type
 * Dynamically derived from ProviderModelsMap
 * Full provider/model paths (e.g., "openai/gpt-4o", "anthropic/claude-3-5-sonnet-20241022")
 */
export type ModelRouterModelId =
  | {
      [P in Provider]: \`\${P}/\${ProviderModelsMap[P][number]}\`;
    }[Provider]
  | (string & {});

/**
 * Extract the model part from a ModelRouterModelId for a specific provider
 * Dynamically derived from ProviderModelsMap
 * Example: ModelForProvider<'openai'> = 'gpt-4o' | 'gpt-4-turbo' | ...
 */
export type ModelForProvider<P extends Provider> = ProviderModelsMap[P][number];
`;
}
async function writeRegistryFiles(jsonPath, typesPath, providers, models) {
  const jsonDir = path__default.default.dirname(jsonPath);
  const typesDir = path__default.default.dirname(typesPath);
  await fs__default.default.mkdir(jsonDir, { recursive: true });
  await fs__default.default.mkdir(typesDir, { recursive: true });
  const registryData = {
    providers,
    models,
    version: "1.0.0"
  };
  await fs__default.default.writeFile(jsonPath, JSON.stringify(registryData, null, 2), "utf-8");
  const typeContent = generateTypesContent(models);
  await fs__default.default.writeFile(typesPath, typeContent, "utf-8");
}

exports.fetchProvidersFromGateways = fetchProvidersFromGateways;
exports.generateTypesContent = generateTypesContent;
exports.writeRegistryFiles = writeRegistryFiles;
//# sourceMappingURL=registry-generator-6WVOHM2L.cjs.map
//# sourceMappingURL=registry-generator-6WVOHM2L.cjs.map