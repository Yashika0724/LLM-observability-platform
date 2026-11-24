import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../utils/api.js";
import "../utils/chartSetup.js";

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
        borderColor: "#141414",
        backgroundColor: "#141414",
        tension: 0.3,
        yAxisID: "cost",
      },
      {
        label: "Avg quality (1-5)",
        data: days.map((d) => d.avgScore), // null on days with no evaluations
        borderColor: "#4FA36F",
        backgroundColor: "#4FA36F",
        tension: 0.3,
        spanGaps: true,
        yAxisID: "quality",
      },
    ],
  };

  // Two y-axes: cost on the left, quality score on the right
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom", labels: { boxWidth: 10, boxHeight: 10 } } },
    scales: {
      cost: { position: "left", beginAtZero: true },
      quality: { position: "right", min: 1, max: 5, grid: { display: false } },
    },
  };

  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <p className="font-semibold">Cost & quality</p>
        <p className="text-xs text-slate-500">Last 14 days</p>
      </div>
      {days.length > 0 ? (
        <div className="h-60">
          <Line data={data} options={options} />
        </div>
      ) : (
        <p className="text-sm text-slate-500">No traces in the last 14 days.</p>
      )}
    </div>
  );
}
