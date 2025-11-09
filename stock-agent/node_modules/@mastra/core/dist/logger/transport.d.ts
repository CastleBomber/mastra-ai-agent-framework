import { Transform } from 'stream';
import type { LogLevel } from './constants.js';
export interface BaseLogMessage {
    runId?: string;
    msg: string;
    level: LogLevel;
    time: Date;
    pid: number;
    hostname: string;
    name: string;
}
export declare abstract class LoggerTransport extends Transform {
    constructor(opts?: any);
    getLogsByRunId(_args: {
        runId: string;
        fromDate?: Date;
        toDate?: Date;
        logLevel?: LogLevel;
        filters?: Record<string, any>;
        page?: number;
        perPage?: number;
    }): Promise<{
        logs: BaseLogMessage[];
        total: number;
        page: number;
        perPage: number;
        hasMore: boolean;
    }>;
    getLogs(_args?: {
        fromDate?: Date;
        toDate?: Date;
        logLevel?: LogLevel;
        filters?: Record<string, any>;
        returnPaginationResults?: boolean;
        page?: number;
        perPage?: number;
    }): Promise<{
        logs: BaseLogMessage[];
        total: number;
        page: number;
        perPage: number;
        hasMore: boolean;
    }>;
}
export declare const createCustomTransport: (stream: Transform, getLogs?: LoggerTransport["getLogs"], getLogsByRunId?: LoggerTransport["getLogsByRunId"]) => LoggerTransport;
//# sourceMappingURL=transport.d.ts.map