import { InstrumentClass } from '../chunk-BLUDYAPI.js';
import { MastraError } from '../chunk-PZUZNPFM.js';
import { MastraBase } from '../chunk-VQASQG5D.js';
import { __decoratorStart, __decorateElement, __runInitializers } from '../chunk-3HXBPDKN.js';

// src/server/auth.ts
var _MastraAuthProvider_decorators, _init, _a;
_MastraAuthProvider_decorators = [InstrumentClass({
  prefix: "auth",
  excludeMethods: ["__setTools", "__setLogger", "__setTelemetry", "#log"]
})];
var MastraAuthProvider = class extends (_a = MastraBase) {
  constructor(options) {
    super({
      component: "AUTH",
      name: options?.name
    });
    if (options?.authorizeUser) {
      this.authorizeUser = options.authorizeUser.bind(this);
    }
  }
  registerOptions(opts) {
    if (opts?.authorizeUser) {
      this.authorizeUser = opts.authorizeUser.bind(this);
    }
  }
};
MastraAuthProvider = /*@__PURE__*/(_ => {
  _init = __decoratorStart(_a);
  MastraAuthProvider = __decorateElement(_init, 0, "MastraAuthProvider", _MastraAuthProvider_decorators, MastraAuthProvider);
  __runInitializers(_init, 1, MastraAuthProvider);

  // src/server/index.ts
  return MastraAuthProvider;
})();
// src/server/index.ts
function validateOptions(path, options) {
  const opts = options;
  if (opts.method === void 0) {
    throw new MastraError({
      id: "MASTRA_SERVER_API_INVALID_ROUTE_OPTIONS",
      text: `Invalid options for route "${path}", missing "method" property`,
      domain: "MASTRA_SERVER" /* MASTRA_SERVER */,
      category: "USER" /* USER */
    });
  }
  if (opts.handler === void 0 && opts.createHandler === void 0) {
    throw new MastraError({
      id: "MASTRA_SERVER_API_INVALID_ROUTE_OPTIONS",
      text: `Invalid options for route "${path}", you must define a "handler" or "createHandler" property`,
      domain: "MASTRA_SERVER" /* MASTRA_SERVER */,
      category: "USER" /* USER */
    });
  }
  if (opts.handler !== void 0 && opts.createHandler !== void 0) {
    throw new MastraError({
      id: "MASTRA_SERVER_API_INVALID_ROUTE_OPTIONS",
      text: `Invalid options for route "${path}", you can only define one of the following properties: "handler" or "createHandler"`,
      domain: "MASTRA_SERVER" /* MASTRA_SERVER */,
      category: "USER" /* USER */
    });
  }
}
function registerApiRoute(path, options) {
  if (path.startsWith("/api/")) {
    throw new MastraError({
      id: "MASTRA_SERVER_API_PATH_RESERVED",
      text: `Path must not start with "/api", it's reserved for internal API routes`,
      domain: "MASTRA_SERVER" /* MASTRA_SERVER */,
      category: "USER" /* USER */
    });
  }
  validateOptions(path, options);
  return {
    path,
    method: options.method,
    handler: options.handler,
    createHandler: options.createHandler,
    openapi: options.openapi,
    middleware: options.middleware
  };
}
function defineAuth(config) {
  return config;
}

export { MastraAuthProvider, defineAuth, registerApiRoute };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map