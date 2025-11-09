import type { UnicodeNormalizerOptions } from '../../../processors/processors/unicode-normalizer.js';
import type { MastraMessageV2 } from '../../message-list/index.js';
import type { InputProcessor } from '../index.js';
/**
 * Backward-compatible wrapper for UnicodeNormalizer that implements the old InputProcessor interface
 * @deprecated Use UnicodeNormalizer directly instead from @mastra/core/processors
 */
export declare class UnicodeNormalizerInputProcessor implements InputProcessor {
    readonly name = "unicode-normalizer";
    private processor;
    constructor(options?: UnicodeNormalizerOptions);
    process(args: {
        messages: MastraMessageV2[];
        abort: (reason?: string) => never;
    }): Promise<MastraMessageV2[]> | MastraMessageV2[];
}
export type { UnicodeNormalizerOptions };
//# sourceMappingURL=unicode-normalizer.d.ts.map