import type { AITracingEvent } from '../types.js';
import { BaseExporter } from './base.js';
import type { BaseExporterConfig } from './base.js';
export declare class ConsoleExporter extends BaseExporter {
    name: string;
    constructor(config?: BaseExporterConfig);
    protected _exportEvent(event: AITracingEvent): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=console.d.ts.map