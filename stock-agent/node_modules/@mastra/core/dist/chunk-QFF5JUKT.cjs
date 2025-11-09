'use strict';

var chunk6VOPKVYH_cjs = require('./chunk-6VOPKVYH.cjs');
var promises = require('fs/promises');
var dotenv = require('dotenv');

var MastraBundler = class extends chunk6VOPKVYH_cjs.MastraBase {
  constructor({ name, component = "BUNDLER" }) {
    super({ component, name });
  }
  async loadEnvVars() {
    const envVars = /* @__PURE__ */ new Map();
    for (const file of await this.getEnvFiles()) {
      const content = await promises.readFile(file, "utf-8");
      const config = dotenv.parse(content);
      Object.entries(config).forEach(([key, value]) => {
        envVars.set(key, value);
      });
    }
    return envVars;
  }
};

exports.MastraBundler = MastraBundler;
//# sourceMappingURL=chunk-QFF5JUKT.cjs.map
//# sourceMappingURL=chunk-QFF5JUKT.cjs.map