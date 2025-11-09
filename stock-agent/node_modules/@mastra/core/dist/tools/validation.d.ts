import type { z } from 'zod';
import type { ZodLikeSchema } from '../types/zod-compat.js';
export interface ValidationError<T = any> {
    error: true;
    message: string;
    validationErrors: z.ZodFormattedError<T>;
}
/**
 * Validates input against a Zod schema and returns a structured error if validation fails
 * @param schema The Zod schema to validate against
 * @param input The input to validate
 * @param toolId Optional tool ID for better error messages
 * @returns The validation error object if validation fails, undefined if successful
 */
export declare function validateToolInput<T = any>(schema: ZodLikeSchema | undefined, input: unknown, toolId?: string): {
    data: T | unknown;
    error?: ValidationError<T>;
};
//# sourceMappingURL=validation.d.ts.map