'use strict';

var chunkAQGLVU53_cjs = require('../chunk-AQGLVU53.cjs');
var chunk5NTO7S5I_cjs = require('../chunk-5NTO7S5I.cjs');
var chunk6VOPKVYH_cjs = require('../chunk-6VOPKVYH.cjs');
var chunkEBVYYC2Q_cjs = require('../chunk-EBVYYC2Q.cjs');

// src/server/auth.ts
var _MastraAuthProvider_decorators, _init, _a;
_MastraAuthProvider_decorators = [chunkAQGLVU53_cjs.InstrumentClass({
  prefix: "auth",
  excludeMethods: ["__setTools", "__setLogger", "__setTelemetry", "#log"]
})];
exports.MastraAuthProvider = class MastraAuthProvider extends (_a = chunk6VOPKVYH_cjs.MastraBase) {
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
exports.MastraAuthProvider = /*@__PURE__*/(_ => {
  _init = chunkEBVYYC2Q_cjs.__decoratorStart(_a);
  exports.MastraAuthProvider = chunkEBVYYC2Q_cjs.__decorateElement(_init, 0, "MastraAuthProvider", _MastraAuthProvider_decorators, exports.MastraAuthProvider);
  chunkEBVYYC2Q_cjs.__runInitializers(_init, 1, exports.MastraAuthProvider);

  // src/server/index.ts
  return exports.MastraAuthProvider;
})();
// src/server/index.ts
function validateOptions(path, options) {
  const opts = options;
  if (opts.method === void 0) {
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_SERVER_API_INVALID_ROUTE_OPTIONS",
      text: `Invalid options for route "${path}", missing "method" property`,
      domain: "MASTRA_SERVER" /* MASTRA_SERVER */,
      category: "USER" /* USER */
    });
  }
  if (opts.handler === void 0 && opts.createHandler === void 0) {
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_SERVER_API_INVALID_ROUTE_OPTIONS",
      text: `Invalid options for route "${path}", you must define a "handler" or "createHandler" property`,
      domain: "MASTRA_SERVER" /* MASTRA_SERVER */,
      category: "USER" /* USER */
    });
  }
  if (opts.handler !== void 0 && opts.createHandler !== void 0) {
    throw new chunk5NTO7S5I_cjs.MastraError({
      id: "MASTRA_SERVER_API_INVALID_ROUTE_OPTIONS",
      text: `Invalid options for route "${path}", you can only define one of the following properties: "handler" or "createHandler"`,
      domain: "MASTRA_SERVER" /* MASTRA_SERVER */,
      category: "USER" /* USER */
    });
  }
}
function registerApiRoute(path, options) {
  if (path.startsWith("/api/")) {
    throw new chunk5NTO7S5I_cjs.MastraError({
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

exports.defineAuth = defineAuth;
exports.registerApiRoute = registerApiRoute;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map