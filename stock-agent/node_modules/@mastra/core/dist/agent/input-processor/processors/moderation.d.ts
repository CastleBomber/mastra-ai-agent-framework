import type { ModerationOptions, ModerationResult, ModerationCategoryScores } from '../../../processors/processors/moderation.js';
import type { MastraMessageV2 } from '../../message-list/index.js';
import type { InputProcessor } from '../index.js';
/**
 * Backward-compatible wrapper for ModerationProcessor that implements the old InputProcessor interface
 * @deprecated Use ModerationProcessor directly instead from @mastra/core/processors
 */
export declare class ModerationInputProcessor implements InputProcessor {
    readonly name = "moderation";
    private processor;
    constructor(options: ModerationOptions);
    process(args: {
        messages: MastraMessageV2[];
        abort: (reason?: string) => never;
    }): Promise<MastraMessageV2[]>;
}
export type { ModerationOptions, ModerationResult, ModerationCategoryScores };
//# sourceMappingURL=moderation.d.ts.map