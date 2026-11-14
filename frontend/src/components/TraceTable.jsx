import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

export default function TraceTable({ traces }) {
  const navigate = useNavigate();

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-400">
          <tr>
            <th className="px-4 py-4 font-medium">Prompt</th>
            <th className="px-4 py-4 font-medium">Model</th>
            <th className="px-4 py-4 font-medium">Tokens</th>
            <th className="px-4 py-4 font-medium">Latency</th>
            <th className="px-4 py-4 font-medium">Cost</th>
            <th className="px-4 py-4 font-medium">Quality</th>
            <th className="px-4 py-4 font-medium">Status</th>
            <th className="px-4 py-4 font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {traces.map((t) => (
            <tr
              key={t.traceId}
              onClick={() => navigate(`/traces/${t.traceId}`)}
              className="border-t border-black/5 hover:bg-canvas cursor-pointer whitespace-nowrap"
            >
              <td className="px-4 py-3.5 font-medium max-w-xs truncate">{t.input}</td>
              <td className="px-4 py-3.5 text-slate-600">{t.model}</td>
              <td className="px-4 py-3.5 text-slate-600">{t.tokenUsage.total}</td>
              <td className="px-4 py-3.5 text-slate-600">{t.durationMs} ms</td>
              <td className="px-4 py-3.5 text-slate-600">${t.cost.toFixed(4)}</td>
              <td className="px-4 py-3.5 text-slate-600" title={t.evaluation?.rationale}>
                {t.evaluation?.score ? `${t.evaluation.score}/5` : "–"}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3.5 text-slate-500">
                {new Date(t.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {traces.length === 0 && <p className="px-4 pb-5 text-sm text-slate-500">No traces yet.</p>}
    </div>
  );
}
