'use strict';

var chunkA5KDVZDL_cjs = require('./chunk-A5KDVZDL.cjs');

// src/base.ts
var MastraBase = class {
  component = chunkA5KDVZDL_cjs.RegisteredLogger.LLM;
  logger;
  name;
  telemetry;
  constructor({ component, name }) {
    this.component = component || chunkA5KDVZDL_cjs.RegisteredLogger.LLM;
    this.name = name;
    this.logger = new chunkA5KDVZDL_cjs.ConsoleLogger({ name: `${this.component} - ${this.name}` });
  }
  /**
   * Set the logger for the agent
   * @param logger
   */
  __setLogger(logger) {
    this.logger = logger;
    if (this.component !== chunkA5KDVZDL_cjs.RegisteredLogger.LLM) {
      this.logger.debug(`Logger updated [component=${this.component}] [name=${this.name}]`);
    }
  }
  /**
   * Set the telemetry for the
   * @param telemetry
   */
  __setTelemetry(telemetry) {
    this.telemetry = telemetry;
    if (this.component !== chunkA5KDVZDL_cjs.RegisteredLogger.LLM) {
      this.logger.debug(`Telemetry updated [component=${this.component}] [name=${this.telemetry.name}]`);
    }
  }
  /**
   * Get the telemetry on the vector
   * @returns telemetry
   */
  __getTelemetry() {
    return this.telemetry;
  }
  /* 
    get experimental_telemetry config
    */
  get experimental_telemetry() {
    return this.telemetry ? {
      // tracer: this.telemetry.tracer,
      tracer: this.telemetry.getBaggageTracer(),
      isEnabled: !!this.telemetry.tracer
    } : void 0;
  }
};

exports.MastraBase = MastraBase;
//# sourceMappingURL=chunk-6VOPKVYH.cjs.map
//# sourceMappingURL=chunk-6VOPKVYH.cjs.map