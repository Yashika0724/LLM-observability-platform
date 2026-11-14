// Put each span right under its parent, with its depth for indentation
function orderSpans(spans) {
  const ids = new Set(spans.map((s) => s.spanId));
  const result = [];

  function add(list, depth) {
    list
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .forEach((span) => {
        result.push({ ...span, depth });
        add(spans.filter((s) => s.parentSpanId === span.spanId), depth + 1);
      });
  }

  add(spans.filter((s) => !ids.has(s.parentSpanId)), 0); // top-level spans first
  return result;
}

export default function Waterfall({ trace }) {
  const traceStart = new Date(trace.startTime);

  return (
    <div className="space-y-2">
      {orderSpans(trace.spans).map((span) => {
        const left = ((new Date(span.startTime) - traceStart) / trace.durationMs) * 100;
        const width = Math.max((span.durationMs / trace.durationMs) * 100, 0.5);
        const color =
          span.status === "error"
            ? "bg-red-400"
            : span.attributes?.["gen_ai.operation.name"] // empty attributes are left out of the JSON
              ? "bg-accent" // LLM call
              : "bg-ink";

        return (
          <div key={span.spanId} className="flex items-center gap-4 text-xs">
            <p className="w-56 shrink-0 truncate text-slate-700" style={{ paddingLeft: span.depth * 16 }}>
              {span.name}
            </p>
            <div className="flex-1 h-5 bg-canvas rounded-md relative">
              <div
                className={`absolute h-full rounded-md ${color}`}
                style={{ left: `${left}%`, width: `${width}%` }}
              />
            </div>
            <p className="w-20 shrink-0 text-right text-slate-500">{span.durationMs} ms</p>
          </div>
        );
      })}
    </div>
  );
}
