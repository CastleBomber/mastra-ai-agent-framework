import type { IMastraLogger } from './logger/index.js';
import { RegisteredLogger } from './logger/constants.js';
import type { Telemetry } from './telemetry/index.js';
export declare class MastraBase {
    component: RegisteredLogger;
    protected logger: IMastraLogger;
    name?: string;
    telemetry?: Telemetry;
    constructor({ component, name }: {
        component?: RegisteredLogger;
        name?: string;
    });
    /**
     * Set the logger for the agent
     * @param logger
     */
    __setLogger(logger: IMastraLogger): void;
    /**
     * Set the telemetry for the
     * @param telemetry
     */
    __setTelemetry(telemetry: Telemetry): void;
    /**
     * Get the telemetry on the vector
     * @returns telemetry
     */
    __getTelemetry(): Telemetry | undefined;
    get experimental_telemetry(): {
        tracer: import("@opentelemetry/api").Tracer;
        isEnabled: boolean;
    } | undefined;
}
export * from './types/index.js';
//# sourceMappingURL=base.d.ts.map