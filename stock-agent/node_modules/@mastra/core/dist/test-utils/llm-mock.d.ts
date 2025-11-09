import { MockLanguageModelV1 } from 'ai/test';
import { MastraLLMV1 } from '../llm/model/model.js';
export declare function createMockModel({ objectGenerationMode, mockText, spyGenerate, spyStream, }: {
    objectGenerationMode?: 'json';
    mockText: string | Record<string, any>;
    spyGenerate?: (props: any) => void;
    spyStream?: (props: any) => void;
}): MockLanguageModelV1;
export declare class MockProvider extends MastraLLMV1 {
    constructor({ spyGenerate, spyStream, objectGenerationMode, mockText, }: {
        spyGenerate?: (props: any) => void;
        spyStream?: (props: any) => void;
        objectGenerationMode?: 'json';
        mockText?: string | Record<string, any>;
    });
    stream(...args: any): PromiseLike<StreamReturn<any, any, any>>;
    __streamObject(...args: any[]): PromiseLike<StreamObjectResult<any>>;
}
//# sourceMappingURL=llm-mock.d.ts.map