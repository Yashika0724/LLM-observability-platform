import { Line } from "react-chartjs-2";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import "../utils/chartSetup.js";

export default function ModelCard({
  name,
  metricLabel,
  metricValue,
  trend,
  trendDirection,
  sparkline,
  color,
  delay = 0,
}) {
  const data = {
    labels: sparkline.map((_, i) => i),
    datasets: [
      {
        data: sparkline,
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

  const TrendIcon = trendDirection === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl p-5 opacity-0 animate-fadeInUp transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-sm text-slate-300">{name}</p>
      </div>
      <p className="text-xs text-slate-500 mb-1">{metricLabel}</p>
      <p className="text-2xl font-display font-semibold text-white mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text">
        {metricValue}
      </p>
      <span
        className={`inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full ${
          trendDirection === "down"
            ? "bg-green-500/10 text-green-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        <TrendIcon size={12} />
        {trend}
      </span>
      <div className="h-14 mt-3">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
