import type { ToolAction } from '../tools/index.js';
import type { Workflow } from '../workflows/index.js';
export declare class Integration<ToolsParams = void, ApiClient = void> {
    name: string;
    private workflows;
    constructor();
    /**
     * Workflows
     */
    registerWorkflow(name: string, fn: Workflow): void;
    getWorkflows({ serialized }: {
        serialized?: boolean;
    }): Record<string, Workflow>;
    /**
     * TOOLS
     */
    getStaticTools(_params?: ToolsParams): Record<string, ToolAction<any, any, any>>;
    getTools(_params?: ToolsParams): Promise<Record<string, ToolAction<any, any, any>>>;
    getApiClient(): Promise<ApiClient>;
}
//# sourceMappingURL=integration.d.ts.map