import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

export default function TraceDetailPanel({ trace }) {
  if (!trace) {
    return <div className="card p-6 text-sm text-slate-500">No traces match this filter.</div>;
  }

  const stats = [
    ["Model", trace.model],
    ["Tokens", trace.tokenUsage.total],
    ["Latency", `${trace.durationMs} ms`],
    ["Cost", `$${trace.cost.toFixed(4)}`],
  ];

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-slate-500">
            Most recent trace · {new Date(trace.createdAt).toLocaleString()}
          </p>
          <Link to={`/traces/${trace.traceId}`} className="block text-lg font-semibold mt-1 truncate hover:underline">
            {trace.input}
          </Link>
        </div>
        <StatusBadge status={trace.status} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {stats.map(([label, value]) => (
          <div key={label} className="bg-canvas rounded-xl p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-sm font-semibold mt-1 truncate">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 text-sm">
        <p className="text-xs text-slate-500">Quality</p>
        {trace.evaluation?.score ? (
          <p className="mt-1">
            <span className="font-semibold">{trace.evaluation.score}/5</span> · {trace.evaluation.rationale}
          </p>
        ) : (
          <p className="mt-1 text-slate-500">Not evaluated yet</p>
        )}
      </div>
    </div>
  );
}
