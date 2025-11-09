import type { ToolSet } from 'ai-v5';
import { MastraModelOutput } from '../stream/base/output.js';
import type { OutputSchema } from '../stream/base/schema.js';
import type { LoopOptions } from './types.js';
export declare function loop<Tools extends ToolSet = ToolSet, OUTPUT extends OutputSchema | undefined = undefined>({ resumeContext, models, logger, runId, idGenerator, telemetry_settings, messageList, includeRawChunks, modelSettings, tools, _internal, mode, outputProcessors, returnScorerData, requireToolApproval, agentId, ...rest }: LoopOptions<Tools, OUTPUT>): MastraModelOutput<OUTPUT>;
//# sourceMappingURL=loop.d.ts.map