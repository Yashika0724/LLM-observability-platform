import StatusBadge from "./StatusBadge.jsx";

export default function TraceTable({ traces }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl overflow-x-auto opacity-0 animate-fadeInUp" style={{ animationDelay: "300ms" }}>
      <table className="w-full text-sm text-left">
        <thead className="bg-white/5 text-slate-500 text-xs uppercase">
          <tr>
            <th className="px-4 py-3">Prompt</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Tokens</th>
            <th className="px-4 py-3">Latency</th>
            <th className="px-4 py-3">Cost</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {traces.map((t) => (
            <tr
              key={t.id}
              className="border-t border-white/10 transition-colors duration-150 hover:bg-white/5"
            >
              <td className="px-4 py-3 text-slate-200 max-w-xs truncate">
                {t.prompt}
              </td>
              <td className="px-4 py-3 text-slate-400">{t.model}</td>
              <td className="px-4 py-3 text-slate-400">{t.tokens}</td>
              <td className="px-4 py-3 text-slate-400">{t.latencyMs} ms</td>
              <td className="px-4 py-3 text-slate-400">
                ${t.costUsd.toFixed(4)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3 text-slate-500">{t.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
