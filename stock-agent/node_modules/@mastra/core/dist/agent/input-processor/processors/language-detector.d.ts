import type { LanguageDetectorOptions, LanguageDetectionResult, LanguageDetection, TranslationResult } from '../../../processors/processors/language-detector.js';
import type { MastraMessageV2 } from '../../message-list/index.js';
import type { InputProcessor } from '../index.js';
/**
 * Backward-compatible wrapper for LanguageDetector that implements the old InputProcessor interface
 * @deprecated Use LanguageDetector directly instead from @mastra/core/processors
 */
export declare class LanguageDetectorInputProcessor implements InputProcessor {
    readonly name = "language-detector";
    private processor;
    constructor(options: LanguageDetectorOptions);
    process(args: {
        messages: MastraMessageV2[];
        abort: (reason?: string) => never;
    }): Promise<MastraMessageV2[]>;
}
export type { LanguageDetectorOptions, LanguageDetectionResult, LanguageDetection, TranslationResult };
//# sourceMappingURL=language-detector.d.ts.map