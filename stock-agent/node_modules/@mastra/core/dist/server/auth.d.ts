import type { HonoRequest } from 'hono';
import { MastraBase } from '../base.js';
export interface MastraAuthProviderOptions<TUser = unknown> {
    name?: string;
    authorizeUser?: (user: TUser, request: HonoRequest) => Promise<boolean> | boolean;
}
export declare abstract class MastraAuthProvider<TUser = unknown> extends MastraBase {
    constructor(options?: MastraAuthProviderOptions<TUser>);
    /**
     * Authenticate a token and return the payload
     * @param token - The token to authenticate
     * @param request - The request
     * @returns The payload
     */
    abstract authenticateToken(token: string, request: HonoRequest): Promise<TUser | null>;
    /**
     * Authorize a user for a path and method
     * @param user - The user to authorize
     * @param request - The request
     * @returns The authorization result
     */
    abstract authorizeUser(user: TUser, request: HonoRequest): Promise<boolean> | boolean;
    protected registerOptions(opts?: MastraAuthProviderOptions<TUser>): void;
}
//# sourceMappingURL=auth.d.ts.map