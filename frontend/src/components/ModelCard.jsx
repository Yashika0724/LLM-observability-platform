import { Line } from "react-chartjs-2";
import "../utils/chartSetup.js";

export default function ModelCard({ model, color }) {
  const errorRate = ((model.errors / model.calls) * 100).toFixed(1);

  const data = {
    labels: model.recentLatencies.map((_, i) => i),
    datasets: [
      {
        data: model.recentLatencies,
        borderColor: color,
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
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <p className="text-sm font-medium truncate">{model._id}</p>
      </div>
      <p className="text-2xl font-bold tracking-tight mt-4">{Math.round(model.avgLatencyMs)} ms</p>
      <p className="text-xs text-slate-500 mt-1">
        avg latency · {model.calls} calls · ${model.totalCost.toFixed(4)} · {errorRate}% errors
      </p>
      <div className="h-12 mt-4">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
