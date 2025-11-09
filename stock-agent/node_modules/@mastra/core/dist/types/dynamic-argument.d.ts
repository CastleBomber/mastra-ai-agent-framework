import type { Mastra } from '../mastra/index.js';
import type { RuntimeContext } from '../runtime-context/index.js';
export type DynamicArgument<T> = T | (({ runtimeContext, mastra }: {
    runtimeContext: RuntimeContext;
    mastra?: Mastra;
}) => Promise<T> | T);
export type NonEmpty<T extends string> = T extends '' ? never : T;
export type MastraIdGenerator = () => NonEmpty<string>;
//# sourceMappingURL=dynamic-argument.d.ts.map