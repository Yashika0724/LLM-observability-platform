import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "../utils/chartSetup.js";
import api from "../utils/api.js";
import KpiCard from "../components/KpiCard.jsx";

export default function Evaluations() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/traces/evaluations")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || "Could not load evaluations"));
  }, []);

  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;
  if (!data) return <p className="p-6 text-sm text-slate-500">Loading...</p>;

  const lowScores = data.scoreCounts[0] + data.scoreCounts[1]; // 1/5 and 2/5

  const chartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Traces",
        data: data.scoreCounts,
        backgroundColor: ["#E98A8A", "#F0B27A", "#EBCB6B", "#A9D18E", "#6FBF86"],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false, // fill the h-64 box
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Evaluations</h2>
        <p className="text-sm text-slate-500">
          An LLM judge scores each answer from 1 (useless) to 5 (excellent).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Average score" value={data.averageScore ? `${data.averageScore}/5` : "–"} tone="bg-mint" />
        <KpiCard label="Evaluated traces" value={data.total} tone="bg-lavender" />
        <KpiCard label="Low scores (1-2)" value={lowScores} tone="bg-blush" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="card p-6">
          <p className="font-semibold mb-4">Score distribution</p>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className={`card p-6 lg:col-span-2`}>
          <p className="font-semibold mb-4">Recent evaluations</p>
          {data.recent.length === 0 && <p className="text-sm text-slate-500">No evaluations yet.</p>}
          <div className="space-y-3">
            {data.recent.map((t) => (
              <div
                key={t.traceId}
                onClick={() => navigate(`/traces/${t.traceId}`)}
                className="flex gap-4 p-3 rounded-lg hover:bg-canvas cursor-pointer"
              >
                <span className="text-lg font-bold w-10 shrink-0">
                  {t.evaluation.score}/5
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ink truncate">{t.input}</p>
                  <p className="text-xs text-slate-500">{t.evaluation.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
