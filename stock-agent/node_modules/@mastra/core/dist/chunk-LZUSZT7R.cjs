'use strict';

var chunkHF3GZRFP_cjs = require('./chunk-HF3GZRFP.cjs');
var anthropicV5 = require('@ai-sdk/anthropic-v5');
var googleV5 = require('@ai-sdk/google-v5');
var openaiCompatibleV5 = require('@ai-sdk/openai-compatible-v5');
var openaiV5 = require('@ai-sdk/openai-v5');
var xaiV5 = require('@ai-sdk/xai-v5');
var aiSdkProviderV5 = require('@openrouter/ai-sdk-provider-v5');

// src/llm/model/gateway-resolver.ts
function parseModelRouterId(routerId, gatewayPrefix) {
  if (gatewayPrefix && !routerId.startsWith(`${gatewayPrefix}/`)) {
    throw new Error(`Expected ${gatewayPrefix}/ in model router ID ${routerId}`);
  }
  const idParts = routerId.split("/");
  if (gatewayPrefix && idParts.length < 3) {
    throw new Error(
      `Expected atleast 3 id parts ${gatewayPrefix}/provider/model, but only saw ${idParts.length} in ${routerId}`
    );
  }
  const providerId = idParts.at(gatewayPrefix ? 1 : 0);
  const modelId = idParts.slice(gatewayPrefix ? 2 : 1).join(`/`);
  if (!routerId.includes(`/`) || !providerId || !modelId) {
    throw new Error(
      `Attempted to parse provider/model from ${routerId} but this ID doesn't appear to contain a provider`
    );
  }
  return {
    providerId,
    modelId
  };
}

// src/llm/model/gateways/constants.ts
var PROVIDERS_WITH_INSTALLED_PACKAGES = ["anthropic", "google", "openai", "openrouter", "xai"];
var EXCLUDED_PROVIDERS = ["github-copilot"];

// src/llm/model/gateways/models-dev.ts
var OPENAI_COMPATIBLE_OVERRIDES = {
  cerebras: {
    url: "https://api.cerebras.ai/v1"
  },
  mistral: {
    url: "https://api.mistral.ai/v1"
  },
  groq: {
    url: "https://api.groq.com/openai/v1"
  },
  togetherai: {
    url: "https://api.together.xyz/v1"
  },
  deepinfra: {
    url: "https://api.deepinfra.com/v1/openai"
  },
  perplexity: {
    url: "https://api.perplexity.ai"
  },
  vercel: {
    url: "https://ai-gateway.vercel.sh/v1",
    apiKeyEnvVar: "AI_GATEWAY_API_KEY"
  }
};
var ModelsDevGateway = class extends chunkHF3GZRFP_cjs.MastraModelGateway {
  name = "models.dev";
  prefix = void 0;
  // No prefix for registry gateway
  providerConfigs = {};
  constructor(providerConfigs) {
    super();
    if (providerConfigs) this.providerConfigs = providerConfigs;
  }
  async fetchProviders() {
    const response = await fetch("https://models.dev/api.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch from models.dev: ${response.statusText}`);
    }
    const data = await response.json();
    const providerConfigs = {};
    for (const [providerId, providerInfo] of Object.entries(data)) {
      if (EXCLUDED_PROVIDERS.includes(providerId)) continue;
      if (!providerInfo || typeof providerInfo !== "object" || !providerInfo.models) continue;
      const normalizedId = providerId;
      const isOpenAICompatible = providerInfo.npm === "@ai-sdk/openai-compatible" || providerInfo.npm === "@ai-sdk/gateway" || // Vercel AI Gateway is OpenAI-compatible
      normalizedId in OPENAI_COMPATIBLE_OVERRIDES;
      const hasInstalledPackage = PROVIDERS_WITH_INSTALLED_PACKAGES.includes(providerId);
      const hasApiAndEnv = providerInfo.api && providerInfo.env && providerInfo.env.length > 0;
      if (isOpenAICompatible || hasInstalledPackage || hasApiAndEnv) {
        const modelIds = Object.keys(providerInfo.models).sort();
        const url = providerInfo.api || OPENAI_COMPATIBLE_OVERRIDES[normalizedId]?.url;
        if (!hasInstalledPackage && !url) {
          continue;
        }
        const apiKeyEnvVar = providerInfo.env?.[0] || `${normalizedId.toUpperCase().replace(/-/g, "_")}_API_KEY`;
        const apiKeyHeader = !hasInstalledPackage ? OPENAI_COMPATIBLE_OVERRIDES[normalizedId]?.apiKeyHeader || "Authorization" : void 0;
        providerConfigs[normalizedId] = {
          url,
          apiKeyEnvVar,
          apiKeyHeader,
          name: providerInfo.name || providerId.charAt(0).toUpperCase() + providerId.slice(1),
          models: modelIds,
          docUrl: providerInfo.doc,
          // Include documentation URL if available
          gateway: `models.dev`
        };
      }
    }
    this.providerConfigs = providerConfigs;
    return providerConfigs;
  }
  buildUrl(routerId, envVars) {
    const { providerId } = parseModelRouterId(routerId);
    const config = this.providerConfigs[providerId];
    if (!config?.url) {
      return;
    }
    const baseUrlEnvVar = `${providerId.toUpperCase().replace(/-/g, "_")}_BASE_URL`;
    const customBaseUrl = envVars?.[baseUrlEnvVar] || process.env[baseUrlEnvVar];
    return customBaseUrl || config.url;
  }
  getApiKey(modelId) {
    const [provider, model] = modelId.split("/");
    if (!provider || !model) {
      throw new Error(`Could not identify provider from model id ${modelId}`);
    }
    const config = this.providerConfigs[provider];
    if (!config) {
      throw new Error(`Could not find config for provider ${provider} with model id ${modelId}`);
    }
    const apiKey = typeof config.apiKeyEnvVar === `string` ? process.env[config.apiKeyEnvVar] : void 0;
    if (!apiKey) {
      throw new Error(`Could not find API key process.env.${config.apiKeyEnvVar} for model id ${modelId}`);
    }
    return Promise.resolve(apiKey);
  }
  async resolveLanguageModel({
    modelId,
    providerId,
    apiKey
  }) {
    const baseURL = this.buildUrl(`${providerId}/${modelId}`);
    switch (providerId) {
      case "openai":
        return openaiV5.createOpenAI({ apiKey }).responses(modelId);
      case "gemini":
      case "google":
        return googleV5.createGoogleGenerativeAI({
          apiKey
        }).chat(modelId);
      case "anthropic":
        return anthropicV5.createAnthropic({ apiKey })(modelId);
      case "openrouter":
        return aiSdkProviderV5.createOpenRouter({ apiKey })(modelId);
      case "xai":
        return xaiV5.createXai({
          apiKey
        })(modelId);
      default:
        if (!baseURL) throw new Error(`No API URL found for ${providerId}/${modelId}`);
        return openaiCompatibleV5.createOpenAICompatible({ name: providerId, apiKey, baseURL, supportsStructuredOutputs: true }).chatModel(
          modelId
        );
    }
  }
};

exports.ModelsDevGateway = ModelsDevGateway;
exports.parseModelRouterId = parseModelRouterId;
//# sourceMappingURL=chunk-LZUSZT7R.cjs.map
//# sourceMappingURL=chunk-LZUSZT7R.cjs.map