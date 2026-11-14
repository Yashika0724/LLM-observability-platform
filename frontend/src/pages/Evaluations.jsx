import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "../utils/chartSetup.js";
import api from "../utils/api.js";
import KpiCard from "../components/KpiCard.jsx";

const card = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6";

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

  if (error) return <p className="p-6 text-sm text-red-400">{error}</p>;
  if (!data) return <p className="p-6 text-sm text-slate-500">Loading...</p>;

  const lowScores = data.scoreCounts[0] + data.scoreCounts[1]; // 1/5 and 2/5

  const chartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Traces",
        data: data.scoreCounts,
        backgroundColor: ["#f87171", "#fb923c", "#facc15", "#a3e635", "#34d399"],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#64748b", precision: 0 }, grid: { color: "#1e293b" } },
      x: { ticks: { color: "#64748b" }, grid: { display: false } },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-white">Evaluations</h2>
        <p className="text-sm text-slate-500">
          An LLM judge scores each answer from 1 (useless) to 5 (excellent).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Average Score" value={data.averageScore ? `${data.averageScore}/5` : "–"} />
        <KpiCard label="Evaluated Traces" value={data.total} delay={80} />
        <KpiCard label="Low Scores (1-2)" value={lowScores} delay={160} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={card}>
          <p className="text-xs text-slate-500 mb-4">Score distribution</p>
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className={`${card} lg:col-span-2`}>
          <p className="text-xs text-slate-500 mb-4">Recent evaluations</p>
          {data.recent.length === 0 && <p className="text-sm text-slate-500">No evaluations yet.</p>}
          <div className="space-y-3">
            {data.recent.map((t) => (
              <div
                key={t.traceId}
                onClick={() => navigate(`/traces/${t.traceId}`)}
                className="flex gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <span className="text-lg font-display font-semibold text-white w-10 shrink-0">
                  {t.evaluation.score}/5
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-slate-200 truncate">{t.input}</p>
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
