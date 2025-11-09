import type { MastraMessageV2 } from '../../agent/message-list/index.js';
import type { Processor } from '../index.js';
export interface UnicodeNormalizerOptions {
    /**
     * Whether to strip control characters (default: false)
     * When enabled, removes control characters except \t, \n, \r
     */
    stripControlChars?: boolean;
    /**
     * Whether to preserve emojis (default: true)
     * When disabled, emojis may be removed if they contain control characters
     */
    preserveEmojis?: boolean;
    /**
     * Whether to collapse consecutive whitespace (default: true)
     * When enabled, multiple spaces/tabs/newlines are collapsed to single instances
     */
    collapseWhitespace?: boolean;
    /**
     * Whether to trim leading and trailing whitespace (default: true)
     */
    trim?: boolean;
}
export declare class UnicodeNormalizer implements Processor {
    readonly name = "unicode-normalizer";
    private options;
    constructor(options?: UnicodeNormalizerOptions);
    processInput(args: {
        messages: MastraMessageV2[];
        abort: (reason?: string) => never;
    }): MastraMessageV2[];
    private normalizeText;
}
//# sourceMappingURL=unicode-normalizer.d.ts.map