import { Clock } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function TraceDetailPanel({ trace }) {
  if (!trace) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl p-6 text-sm text-slate-500">
        No traces match this filter.
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl p-6 opacity-0 animate-fadeInUp transition-all duration-300 hover:border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={12} />
            Most recent trace · {trace.timestamp}
          </p>
          <h3 className="text-lg font-display font-semibold text-white mt-1">
            {trace.prompt}
          </h3>
        </div>
        <StatusBadge status={trace.status} />
      </div>
      <p className="text-xs text-slate-500 mb-1">Tokens Used</p>
      <p className="text-4xl font-display font-bold bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent mb-4">
        {trace.tokens}
      </p>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-slate-500 text-xs">Model</p>
          <p className="text-slate-200">{trace.model}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Latency</p>
          <p className="text-slate-200">{trace.latencyMs} ms</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Cost</p>
          <p className="text-slate-200">${trace.costUsd.toFixed(4)}</p>
        </div>
      </div>
    </div>
  );
}
