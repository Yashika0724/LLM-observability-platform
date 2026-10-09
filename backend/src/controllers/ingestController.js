import { fileURLToPath } from "url";
import protobuf from "protobufjs";
import Trace from "../models/Trace.js";

const protoPath = fileURLToPath(new URL("../proto/trace.proto", import.meta.url));
const ExportTraceServiceRequest = protobuf
  .loadSync(protoPath)
  .lookupType("ExportTraceServiceRequest");

function toHex(bytes) {
  return bytes ? Buffer.from(bytes).toString("hex") : null;
}

function readValue(value) {
  return value.stringValue ?? value.intValue ?? value.doubleValue ?? value.boolValue ?? null;
}

// Messages look like [{ role, parts: [{ content }] }] — return the last message's text.
function lastMessageText(messagesJson) {
  if (!messagesJson) return null;
  const messages = JSON.parse(messagesJson);
  return messages.at(-1).parts[0].content;
}

async function saveSpan(applicationId, span) {
  const attributes = {};
  for (const { key, value } of span.attributes) {
    attributes[key] = readValue(value);
  }

  const startTime = new Date(span.startTimeUnixNano / 1e6);
  const endTime = new Date(span.endTimeUnixNano / 1e6);
  const status = span.status?.code === 2 ? "error" : "success";
  const traceId = toHex(span.traceId);

  let trace = await Trace.findOne({ traceId });
  if (!trace) {
    trace = new Trace({ traceId, application: applicationId, startTime, endTime, durationMs: 0 });
    console.log(`  new trace ${traceId.slice(0, 8)}`);
  }

  trace.spans.push({
    spanId: toHex(span.spanId),
    parentSpanId: toHex(span.parentSpanId),
    name: span.name,
    startTime,
    endTime,
    durationMs: endTime - startTime,
    status,
    attributes,
  });

  if (startTime < trace.startTime) trace.startTime = startTime;
  if (endTime > trace.endTime) trace.endTime = endTime;
  trace.durationMs = trace.endTime - trace.startTime;

  if (status === "error") {
    trace.status = "error";
    trace.error = span.status.message || attributes["error.type"];
  }

  const userId = attributes["traceloop.association.properties.user_id"];
  if (userId) trace.userId = userId;

  // Only LLM call spans have gen_ai.operation.name
  if (attributes["gen_ai.operation.name"]) {
    trace.model = attributes["gen_ai.response.model"] ?? attributes["gen_ai.request.model"];
    trace.input = lastMessageText(attributes["gen_ai.input.messages"]);
    trace.output = lastMessageText(attributes["gen_ai.output.messages"]);
    trace.tokenUsage.prompt += attributes["gen_ai.usage.input_tokens"] ?? 0;
    trace.tokenUsage.completion += attributes["gen_ai.usage.output_tokens"] ?? 0;
    trace.tokenUsage.total += attributes["gen_ai.usage.total_tokens"] ?? 0;
    console.log(`  LLM call: ${trace.model} | ${trace.tokenUsage.prompt} in / ${trace.tokenUsage.completion} out tokens | "${trace.input}"`);
  }

  await trace.save();
  console.log(`  saved span "${span.name}" (${endTime - startTime} ms) -> trace ${traceId.slice(0, 8)}`);
}

export async function ingestTraces(req, res) {
  const message = ExportTraceServiceRequest.decode(req.body);
  const request = ExportTraceServiceRequest.toObject(message, { longs: Number, arrays: true });
  const spanCount = request.resourceSpans
    .flatMap((resourceSpans) => resourceSpans.scopeSpans)
    .reduce((count, scopeSpans) => count + scopeSpans.spans.length, 0);
  console.log(`[ingest] decoded ${spanCount} spans from ${req.body.length} bytes of protobuf`);

  for (const resourceSpans of request.resourceSpans) {
    for (const scopeSpans of resourceSpans.scopeSpans) {
      for (const span of scopeSpans.spans) {
        await saveSpan(req.application._id, span);
      }
    }
  }

  res.status(200).end();
}
