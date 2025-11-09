import type { Mastra } from '..';
import type { ScoringHookInput } from '../scores/types.js';
import type { MastraStorage } from '../storage/index.js';
export declare function createOnScorerHook(mastra: Mastra): (hookData: ScoringHookInput) => Promise<void>;
export declare function validateAndSaveScore(storage: MastraStorage, payload: unknown): Promise<void>;
//# sourceMappingURL=hooks.d.ts.map