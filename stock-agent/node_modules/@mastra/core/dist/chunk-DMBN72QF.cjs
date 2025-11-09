'use strict';

var chunkAQGLVU53_cjs = require('./chunk-AQGLVU53.cjs');
var chunk6VOPKVYH_cjs = require('./chunk-6VOPKVYH.cjs');
var chunkEBVYYC2Q_cjs = require('./chunk-EBVYYC2Q.cjs');

// src/tts/index.ts
var _MastraTTS_decorators, _init, _a;
_MastraTTS_decorators = [chunkAQGLVU53_cjs.InstrumentClass({
  prefix: "tts",
  excludeMethods: ["__setTools", "__setLogger", "__setTelemetry", "#log"]
})];
exports.MastraTTS = class MastraTTS extends (_a = chunk6VOPKVYH_cjs.MastraBase) {
  model;
  constructor({
    model
  }) {
    super({
      component: "TTS"
    });
    this.model = model;
  }
  traced(method, methodName) {
    return this.telemetry?.traceMethod(method, {
      spanName: `${this.model.name}-tts.${methodName}`,
      attributes: {
        "tts.type": `${this.model.name}`
      }
    }) ?? method;
  }
};
exports.MastraTTS = /*@__PURE__*/(_ => {
  _init = chunkEBVYYC2Q_cjs.__decoratorStart(_a);
  exports.MastraTTS = chunkEBVYYC2Q_cjs.__decorateElement(_init, 0, "MastraTTS", _MastraTTS_decorators, exports.MastraTTS);
  chunkEBVYYC2Q_cjs.__runInitializers(_init, 1, exports.MastraTTS);
  return exports.MastraTTS;
})();
//# sourceMappingURL=chunk-DMBN72QF.cjs.map
//# sourceMappingURL=chunk-DMBN72QF.cjs.map