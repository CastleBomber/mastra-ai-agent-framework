import type { Context } from '@opentelemetry/api';
export declare function hasActiveTelemetry(tracerName?: string): boolean;
/**
 * Get baggage values from context
 * @param ctx The context to get baggage values from
 * @returns
 */
export declare function getBaggageValues(ctx: Context): {
    requestId: string | undefined;
    componentName: string | undefined;
    runId: string | undefined;
    threadId: string | undefined;
    resourceId: string | undefined;
};
//# sourceMappingURL=utility.d.ts.map