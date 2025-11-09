import type { AttributeValue, Attributes, Context, Exception, Span, SpanContext, SpanOptions, SpanStatus, TimeInput, Tracer } from '@opentelemetry/api';
export declare class MockTracer implements Tracer {
    spans: MockSpan[];
    get jsonSpans(): {
        status?: SpanStatus | undefined;
        name: string;
        attributes: Attributes;
        events: {
            name: string;
            attributes: Attributes | undefined;
            time?: [number, number];
        }[];
    }[];
    startSpan(name: string, options?: SpanOptions, context?: Context): Span;
    startActiveSpan<F extends (span: Span) => unknown>(name: string, arg1: unknown, arg2?: unknown, arg3?: F): ReturnType<any>;
}
declare class MockSpan implements Span {
    name: string;
    context?: Context;
    options?: SpanOptions;
    attributes: Attributes;
    events: Array<{
        name: string;
        attributes: Attributes | undefined;
        time?: [number, number];
    }>;
    status?: SpanStatus;
    readonly _spanContext: SpanContext;
    constructor({ name, options, context }: {
        name: string;
        options?: SpanOptions;
        context?: Context;
    });
    spanContext(): SpanContext;
    setAttribute(key: string, value: AttributeValue): this;
    setAttributes(attributes: Attributes): this;
    addEvent(name: string, attributes?: Attributes): this;
    addLink(): this;
    addLinks(): this;
    setStatus(status: SpanStatus): this;
    updateName(): this;
    end(): this;
    isRecording(): boolean;
    recordException(exception: Exception, time?: TimeInput): void;
}
export {};
//# sourceMappingURL=mockTracer.d.ts.map