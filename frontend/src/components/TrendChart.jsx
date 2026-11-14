import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../utils/api.js";
import "../utils/chartSetup.js";

const tick = { color: "#64748b" };
const grid = { color: "#1e293b" };

export default function TrendChart() {
  const [days, setDays] = useState([]);

  useEffect(() => {
    api.get("/traces/trends").then((res) => setDays(res.data));
  }, []);

  const data = {
    labels: days.map((d) => d._id),
    datasets: [
      {
        label: "Cost (USD)",
        data: days.map((d) => d.cost),
        borderColor: "#818cf8",
        backgroundColor: "#818cf8",
        tension: 0.3,
        yAxisID: "cost",
      },
      {
        label: "Avg quality (1-5)",
        data: days.map((d) => d.avgScore), // null on days with no evaluations
        borderColor: "#34d399",
        backgroundColor: "#34d399",
        tension: 0.3,
        spanGaps: true,
        yAxisID: "quality",
      },
    ],
  };

  // Two y-axes: cost on the left, quality score on the right
  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: "#94a3b8" } } },
    scales: {
      cost: { position: "left", beginAtZero: true, ticks: tick, grid },
      quality: { position: "right", min: 1, max: 5, ticks: tick, grid: { display: false } },
      x: { ticks: tick, grid },
    },
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-2">Cost & Quality · last 14 days</p>
      {days.length > 0 ? (
        <Line data={data} options={options} height={80} />
      ) : (
        <p className="text-sm text-slate-500">No traces in the last 14 days.</p>
      )}
    </div>
  );
}
