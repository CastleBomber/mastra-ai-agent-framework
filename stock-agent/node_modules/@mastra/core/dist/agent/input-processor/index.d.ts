import type { MastraMessageV2 } from '../message-list/index.js';
export interface InputProcessor {
    readonly name: string;
    process(args: {
        messages: MastraMessageV2[];
        abort: (reason?: string) => never;
    }): Promise<MastraMessageV2[]> | MastraMessageV2[];
}
export * from './processors/index.js';
//# sourceMappingURL=index.d.ts.map