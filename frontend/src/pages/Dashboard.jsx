import { useState, useMemo, useEffect } from "react";
import KpiCard from "../components/KpiCard.jsx";
import TraceTable from "../components/TraceTable.jsx";
import UsageChart from "../components/UsageChart.jsx";
import TrendChart from "../components/TrendChart.jsx";
import ModelCard from "../components/ModelCard.jsx";
import HeroCard from "../components/HeroCard.jsx";
import TraceDetailPanel from "../components/TraceDetailPanel.jsx";
import api from "../utils/api.js";
import {
  totalTraces,
  avgLatencyMs,
  totalTokens,
  totalCostUsd,
} from "../utils/metrics.js";

const colors = ["#818cf8", "#f472b6", "#34d399"];

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [traces, setTraces] = useState([]);
  const [modelStats, setModelStats] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/traces")
      .then((res) => setTraces(res.data.traces))
      .catch((err) => setError(err.response?.data?.error || "Could not load traces"));

    api
      .get("/traces/stats")
      .then((res) => setModelStats(res.data))
      .catch((err) => setError(err.response?.data?.error || "Could not load model stats"));
  }, []);

  async function handleExport() {
    const res = await api.get("/traces/export", { responseType: "blob" });
    const url = URL.createObjectURL(res.data); // temporary link to the file
    const link = document.createElement("a");
    link.href = url;
    link.download = "traces.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const filteredTraces = useMemo(() => {
    if (statusFilter === "all") return traces;
    return traces.filter((t) => t.status === statusFilter);
  }, [statusFilter, traces]);

  const kpis = [
    { label: "Total Traces", value: totalTraces(filteredTraces) },
    { label: "Avg Latency", value: `${avgLatencyMs(filteredTraces)} ms` },
    { label: "Total Tokens", value: totalTokens(filteredTraces) },
    { label: "Estimated Cost", value: `$${totalCostUsd(filteredTraces)}` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Recommended view · last 24 hours</p>
          <h2 className="text-xl font-display font-semibold text-white">
            Top Models by Usage
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            Export CSV
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
          >
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {modelStats.map((model, i) => (
            <ModelCard key={model._id} model={model} color={colors[i]} delay={i * 80} />
          ))}
          {modelStats.length === 0 && (
            <p className="text-sm text-slate-500">No model calls yet.</p>
          )}
        </div>
        <HeroCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TraceDetailPanel trace={filteredTraces[0]} />
        </div>
        <UsageChart traces={filteredTraces} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} delay={i * 80} />
        ))}
      </div>

      <TrendChart />

      <TraceTable traces={filteredTraces} />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
