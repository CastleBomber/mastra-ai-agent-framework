import type { ToolCallOptions, ProviderDefinedTool } from '@internal/external-types';
import { MastraBase } from '../../base.js';
import type { ToolOptions } from '../../utils.js';
import type { CoreTool, ToolAction, VercelTool, VercelToolV5 } from '../types.js';
/**
 * Types that can be converted to Mastra tools.
 * Includes provider-defined tools from external packages via ProviderDefinedTool.
 */
export type ToolToConvert = VercelTool | ToolAction<any, any, any> | VercelToolV5 | ProviderDefinedTool;
export type LogType = 'tool' | 'toolset' | 'client-tool';
export declare class CoreToolBuilder extends MastraBase {
    private originalTool;
    private options;
    private logType?;
    constructor(input: {
        originalTool: ToolToConvert;
        options: ToolOptions;
        logType?: LogType;
    });
    private getParameters;
    private getOutputSchema;
    private buildProviderTool;
    private createLogMessageOptions;
    private createExecute;
    buildV5(): ({
        description?: string;
        providerOptions?: SharedV2ProviderOptions;
        inputSchema: import("@internal/external-types").FlexibleSchema<any>;
        onInputStart?: (options: ToolCallOptions) => void | PromiseLike<void>;
        onInputDelta?: (options: {
            inputTextDelta: string;
        } & ToolCallOptions) => void | PromiseLike<void>;
        onInputAvailable?: ((options: {
            input: any;
        } & ToolCallOptions) => void | PromiseLike<void>) | undefined;
    } & Partial<{
        execute: (input: any, options: ToolCallOptions) => any;
        outputSchema?: import("@internal/external-types").FlexibleSchema<any> | undefined;
    }> & {
        toModelOutput?: ((output: any) => LanguageModelV2ToolResultPart) | undefined;
    } & {
        type?: undefined | "function";
    }) | ({
        description?: string;
        providerOptions?: SharedV2ProviderOptions;
        inputSchema: import("@internal/external-types").FlexibleSchema<any>;
        onInputStart?: (options: ToolCallOptions) => void | PromiseLike<void>;
        onInputDelta?: (options: {
            inputTextDelta: string;
        } & ToolCallOptions) => void | PromiseLike<void>;
        onInputAvailable?: ((options: {
            input: any;
        } & ToolCallOptions) => void | PromiseLike<void>) | undefined;
    } & Partial<{
        execute: (input: any, options: ToolCallOptions) => any;
        outputSchema?: import("@internal/external-types").FlexibleSchema<any> | undefined;
    }> & {
        toModelOutput?: ((output: any) => LanguageModelV2ToolResultPart) | undefined;
    } & {
        type: "dynamic";
    }) | ({
        description?: string;
        providerOptions?: SharedV2ProviderOptions;
        inputSchema: import("@internal/external-types").FlexibleSchema<any>;
        onInputStart?: (options: ToolCallOptions) => void | PromiseLike<void>;
        onInputDelta?: (options: {
            inputTextDelta: string;
        } & ToolCallOptions) => void | PromiseLike<void>;
        onInputAvailable?: ((options: {
            input: any;
        } & ToolCallOptions) => void | PromiseLike<void>) | undefined;
    } & Partial<{
        execute: (input: any, options: ToolCallOptions) => any;
        outputSchema?: import("@internal/external-types").FlexibleSchema<any> | undefined;
    }> & {
        toModelOutput?: ((output: any) => LanguageModelV2ToolResultPart) | undefined;
    } & {
        type: "provider-defined";
        id: `${string}.${string}`;
        name: string;
        args: Record<string, unknown>;
    }) | {
        type: "provider-defined";
        id: `${string}.${string}`;
        name: string;
        args: Record<string, unknown>;
        inputSchema: any;
        onInputStart: any;
        onInputDelta: any;
        onInputAvailable: any;
        description?: string;
        outputSchema?: import("@internal/external-types").FlexibleSchema<any> | Schema;
    };
    build(): CoreTool;
}
//# sourceMappingURL=builder.d.ts.map