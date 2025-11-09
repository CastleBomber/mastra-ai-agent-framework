import type { MastraModelGateway } from './base.js';
export { MastraModelGateway, type ProviderConfig } from './base.js';
export { ModelsDevGateway } from './models-dev.js';
export { NetlifyGateway } from './netlify.js';
/**
 * Find the gateway that handles a specific model ID based on prefix
 */
export declare function findGatewayForModel(gatewayId: string, gateways: MastraModelGateway[]): MastraModelGateway;
//# sourceMappingURL=index.d.ts.map