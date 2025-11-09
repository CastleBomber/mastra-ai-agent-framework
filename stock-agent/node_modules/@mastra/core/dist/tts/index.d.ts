import { MastraBase } from '../base.js';
interface BuiltInModelConfig {
    provider: string;
    name: string;
    apiKey?: string;
}
export interface TTSConfig {
    model: BuiltInModelConfig;
}
export declare abstract class MastraTTS extends MastraBase {
    model: BuiltInModelConfig;
    constructor({ model }: TTSConfig);
    traced<T extends Function>(method: T, methodName: string): T;
    abstract generate({ text }: {
        text: string;
    }): Promise<any>;
    abstract stream({ text }: {
        text: string;
    }): Promise<any>;
}
export {};
//# sourceMappingURL=index.d.ts.map