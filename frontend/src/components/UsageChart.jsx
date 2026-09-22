import { Line } from "react-chartjs-2";
import "../utils/chartSetup.js";

export default function UsageChart({ traces }) {
  const data = {
    labels: traces.map((t) => t.timestamp.split(" ")[1]),
    datasets: [
      {
        label: "Latency (ms)",
        data: traces.map((t) => t.latencyMs),
        borderColor: "#818cf8",
        backgroundColor: "#818cf8",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#64748b" }, grid: { color: "#1e293b" } },
      x: { ticks: { color: "#64748b" }, grid: { color: "#1e293b" } },
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl p-4 opacity-0 animate-fadeInUp transition-all duration-300 hover:border-white/20" style={{ animationDelay: "150ms" }}>
      <p className="text-xs text-slate-500 mb-2">Latency per Trace</p>
      <Line data={data} options={options} />
    </div>
  );
}
