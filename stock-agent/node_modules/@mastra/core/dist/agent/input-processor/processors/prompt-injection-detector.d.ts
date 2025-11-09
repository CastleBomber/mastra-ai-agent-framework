import type { PromptInjectionOptions, PromptInjectionResult, PromptInjectionCategoryScores } from '../../../processors/processors/prompt-injection-detector.js';
import type { MastraMessageV2 } from '../../message-list/index.js';
import type { InputProcessor } from '../index.js';
/**
 * Backward-compatible wrapper for PromptInjectionDetector that implements the old InputProcessor interface
 * @deprecated Use PromptInjectionDetector directly instead from @mastra/core/processors
 */
export declare class PromptInjectionDetectorInputProcessor implements InputProcessor {
    readonly name = "prompt-injection-detector";
    private processor;
    constructor(options: PromptInjectionOptions);
    process(args: {
        messages: MastraMessageV2[];
        abort: (reason?: string) => never;
    }): Promise<MastraMessageV2[]>;
}
export type { PromptInjectionOptions, PromptInjectionResult, PromptInjectionCategoryScores };
//# sourceMappingURL=prompt-injection-detector.d.ts.map