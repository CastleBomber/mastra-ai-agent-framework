import type { Attributes, Tracer } from '@opentelemetry/api';
import type { CallSettings, TelemetrySettings } from 'ai-v5';
export declare function getTracer({ isEnabled, tracer, }?: {
    isEnabled?: boolean;
    tracer?: Tracer;
}): Tracer;
export declare function assembleOperationName({ operationId, telemetry, }: {
    operationId: string;
    telemetry?: TelemetrySettings;
}): {
    'resource.name'?: string | undefined;
    'mastra.operationId': string;
    'operation.name': string;
};
export declare function getTelemetryAttributes({ model, settings, telemetry, headers, }: {
    model: {
        modelId: string;
        provider: string;
    };
    settings: Omit<CallSettings, 'abortSignal' | 'headers' | 'temperature'>;
    telemetry: TelemetrySettings | undefined;
    headers: Record<string, string | undefined> | undefined;
}): Attributes;
export declare function getRootSpan({ operationId, model, modelSettings, telemetry_settings, headers, }: {
    operationId: string;
    model: {
        modelId: string;
        provider: string;
    };
    modelSettings?: CallSettings;
    telemetry_settings?: TelemetrySettings;
    headers?: Record<string, string | undefined> | undefined;
}): {
    rootSpan: import("@opentelemetry/api").Span;
};
//# sourceMappingURL=index.d.ts.map