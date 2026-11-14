import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../utils/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Waterfall from "../components/Waterfall.jsx";

export default function TraceDetail() {
  const { traceId } = useParams();
  const [trace, setTrace] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/traces/${traceId}`)
      .then((res) => setTrace(res.data))
      .catch((err) => setError(err.response?.data?.error || "Could not load trace"));
  }, [traceId]);

  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;
  if (!trace) return <p className="p-6 text-sm text-slate-500">Loading...</p>;

  const stats = [
    ["Model", trace.model],
    ["Latency", `${trace.durationMs} ms`],
    ["Tokens", trace.tokenUsage.total],
    ["Cost", `$${trace.cost.toFixed(4)}`],
    ["Quality", trace.evaluation?.score ? `${trace.evaluation.score}/5` : "–"],
  ];

  return (
    <div className="space-y-8">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-ink">
        <ArrowLeft size={14} /> Back to dashboard
      </Link>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">
              {new Date(trace.createdAt).toLocaleString()} · {trace.traceId}
            </p>
            <h2 className="text-3xl font-bold tracking-tight mt-1">{trace.input}</h2>
          </div>
          <StatusBadge status={trace.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 text-sm">
          {stats.map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-ink truncate">{value}</p>
            </div>
          ))}
        </div>

        {trace.error && <p className="mt-4 text-sm text-red-600">Error: {trace.error}</p>}
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Timeline</h3>
        <Waterfall trace={trace} />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-2">Answer</h3>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{trace.output || "–"}</p>
        {trace.evaluation?.rationale && (
          <p className="text-xs text-slate-500 mt-4">Judge: {trace.evaluation.rationale}</p>
        )}
      </div>
    </div>
  );
}
