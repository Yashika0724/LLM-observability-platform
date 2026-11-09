import { Line } from "react-chartjs-2";
import "../utils/chartSetup.js";

export default function ModelCard({ model, color, delay = 0 }) {
  const errorRate = ((model.errors / model.calls) * 100).toFixed(1);

  const data = {
    labels: model.recentLatencies.map((_, i) => i),
    datasets: [
      {
        data: model.recentLatencies,
        borderColor: color,
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl p-5 opacity-0 animate-fadeInUp transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-sm text-slate-300 truncate">{model._id}</p>
      </div>
      <p className="text-xs text-slate-500 mb-1">Avg Latency</p>
      <p className="text-2xl font-display font-semibold text-white mb-2">
        {Math.round(model.avgLatencyMs)} ms
      </p>
      <p className="text-xs text-slate-400">
        {model.calls} calls · ${model.totalCost.toFixed(4)} · {errorRate}% errors
      </p>
      <div className="h-14 mt-3">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
