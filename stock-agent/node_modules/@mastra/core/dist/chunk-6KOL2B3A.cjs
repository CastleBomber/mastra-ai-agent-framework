'use strict';

var chunkTSNDVBUU_cjs = require('./chunk-TSNDVBUU.cjs');
var chunk5NTO7S5I_cjs = require('./chunk-5NTO7S5I.cjs');

// src/eval/metric.ts
var Metric = class {
};

// src/eval/evaluation.ts
async function evaluate({
  agentName,
  input,
  metric,
  output,
  runId,
  globalRunId,
  testInfo,
  instructions
}) {
  const runIdToUse = runId || crypto.randomUUID();
  let metricResult;
  let metricName = metric.constructor.name;
  try {
    metricResult = await metric.measure(input.toString(), output);
  } catch (e) {
    throw new chunk5NTO7S5I_cjs.MastraError(
      {
        id: "EVAL_METRIC_MEASURE_EXECUTION_FAILED",
        domain: "EVAL" /* EVAL */,
        category: "USER" /* USER */,
        details: {
          agentName,
          metricName,
          globalRunId
        }
      },
      e
    );
  }
  const traceObject = {
    input: input.toString(),
    output,
    result: metricResult,
    agentName,
    metricName,
    instructions,
    globalRunId,
    runId: runIdToUse,
    testInfo
  };
  try {
    chunkTSNDVBUU_cjs.executeHook("onEvaluation" /* ON_EVALUATION */, traceObject);
  } catch (e) {
    throw new chunk5NTO7S5I_cjs.MastraError(
      {
        id: "EVAL_HOOK_EXECUTION_FAILED",
        domain: "EVAL" /* EVAL */,
        category: "USER" /* USER */,
        details: {
          agentName,
          metricName,
          globalRunId
        }
      },
      e
    );
  }
  return { ...metricResult, output };
}

exports.Metric = Metric;
exports.evaluate = evaluate;
//# sourceMappingURL=chunk-6KOL2B3A.cjs.map
//# sourceMappingURL=chunk-6KOL2B3A.cjs.map