import { SpanKind } from '@opentelemetry/api';
export declare function withSpan(options: {
    spanName?: string;
    skipIfNoTelemetry?: boolean;
    spanKind?: SpanKind;
    tracerName?: string;
}): any;
export declare function InstrumentClass(options?: {
    prefix?: string;
    spanKind?: SpanKind;
    excludeMethods?: string[];
    methodFilter?: (methodName: string) => boolean;
    tracerName?: string;
}): (target: any) => any;
//# sourceMappingURL=telemetry.decorators.d.ts.map