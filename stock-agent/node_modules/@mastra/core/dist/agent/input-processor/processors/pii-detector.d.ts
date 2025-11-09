import type { PIIDetectorOptions, PIIDetectionResult, PIICategories, PIICategoryScores, PIIDetection } from '../../../processors/processors/pii-detector.js';
import type { MastraMessageV2 } from '../../message-list/index.js';
import type { InputProcessor } from '../index.js';
/**
 * Backward-compatible wrapper for PIIDetector that implements the old InputProcessor interface
 * @deprecated Use PIIDetector directly instead from @mastra/core/processors
 */
export declare class PIIDetectorInputProcessor implements InputProcessor {
    readonly name = "pii-detector";
    private processor;
    constructor(options: PIIDetectorOptions);
    process(args: {
        messages: MastraMessageV2[];
        abort: (reason?: string) => never;
    }): Promise<MastraMessageV2[]>;
}
export type { PIIDetectorOptions, PIIDetectionResult, PIICategories, PIICategoryScores, PIIDetection };
//# sourceMappingURL=pii-detector.d.ts.map