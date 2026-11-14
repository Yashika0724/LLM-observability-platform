import { Line } from "react-chartjs-2";
import "../utils/chartSetup.js";

export default function UsageChart({ traces }) {
  const oldestFirst = [...traces].reverse();
  const data = {
    labels: oldestFirst.map((t) => new Date(t.createdAt).toLocaleTimeString()),
    datasets: [
      {
        label: "Latency (ms)",
        data: oldestFirst.map((t) => t.durationMs),
        borderColor: "#7C6CD8",
        backgroundColor: "#7C6CD8",
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true }, x: { ticks: { maxTicksLimit: 5 } } },
  };

  return (
    <div className="card p-6">
      <p className="font-semibold mb-4">Latency per trace</p>
      <Line data={data} options={options} />
    </div>
  );
}
