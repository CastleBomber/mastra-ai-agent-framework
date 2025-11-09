import type { ExportResult } from '@opentelemetry/core';
import type { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import type { IMastraLogger } from '../logger/index.js';
import type { MastraStorage } from '../storage/base.js';
export declare class OTLPTraceExporter implements SpanExporter {
    private storage;
    private queue;
    private serializer;
    private logger;
    private activeFlush;
    constructor({ logger, storage }: {
        logger: IMastraLogger;
        storage: MastraStorage;
    });
    export(internalRepresentation: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    shutdown(): Promise<void>;
    flush(): Promise<void>;
    forceFlush(): Promise<void>;
    __setLogger(logger: IMastraLogger): void;
}
//# sourceMappingURL=storage-exporter.d.ts.map