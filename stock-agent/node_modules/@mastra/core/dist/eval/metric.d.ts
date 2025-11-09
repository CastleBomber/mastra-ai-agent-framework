export interface MetricResult {
    score: number;
    info?: Record<string, any>;
}
export declare abstract class Metric {
    abstract measure(input: string, output: string): Promise<MetricResult>;
}
//# sourceMappingURL=metric.d.ts.map