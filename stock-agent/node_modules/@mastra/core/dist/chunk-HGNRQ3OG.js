import { WritableStream } from 'stream/web';

// src/tools/stream.ts
var ToolStream = class extends WritableStream {
  originalStream;
  constructor({
    prefix,
    callId,
    name,
    runId
  }, originalStream) {
    super({
      async write(chunk) {
        const writer = originalStream?.getWriter();
        try {
          await writer?.write({
            type: `${prefix}-output`,
            runId,
            from: "USER",
            payload: {
              output: chunk,
              ...prefix === "workflow-step" ? {
                runId,
                stepName: name
              } : {
                [`${prefix}CallId`]: callId,
                [`${prefix}Name`]: name
              }
            }
          });
        } finally {
          writer?.releaseLock();
        }
      }
    });
    this.originalStream = originalStream;
  }
  async write(data) {
    const writer = this.getWriter();
    try {
      await writer.write(data);
    } finally {
      writer.releaseLock();
    }
  }
  async custom(data) {
    const writer = this.originalStream?.getWriter();
    try {
      await writer?.write(data);
    } finally {
      writer?.releaseLock();
    }
  }
};

export { ToolStream };
//# sourceMappingURL=chunk-HGNRQ3OG.js.map
//# sourceMappingURL=chunk-HGNRQ3OG.js.map