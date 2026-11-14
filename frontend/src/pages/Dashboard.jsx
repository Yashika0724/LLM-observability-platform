import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { GitBranch, Timer, Coins, DollarSign } from "lucide-react";
import KpiCard from "../components/KpiCard.jsx";
import TraceTable from "../components/TraceTable.jsx";
import UsageChart from "../components/UsageChart.jsx";
import TrendChart from "../components/TrendChart.jsx";
import ModelCard from "../components/ModelCard.jsx";
import HeroCard from "../components/HeroCard.jsx";
import TraceDetailPanel from "../components/TraceDetailPanel.jsx";
import api from "../utils/api.js";
import { totalTraces, avgLatencyMs, totalTokens, totalCostUsd, formatCost } from "../utils/metrics.js";

const colors = ["#7C6CD8", "#E57FA8", "#4FA36F"];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [traces, setTraces] = useState([]);
  const [modelStats, setModelStats] = useState([]);
  const [error, setError] = useState("");
  const firstName = (JSON.parse(localStorage.getItem("user") || "{}").name || "").split(" ")[0];

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
    { label: "Total traces", value: totalTraces(filteredTraces), icon: GitBranch, tone: "bg-lavender" },
    { label: "Avg latency", value: `${avgLatencyMs(filteredTraces)} ms`, icon: Timer, tone: "bg-mint" },
    { label: "Total tokens", value: totalTokens(filteredTraces), icon: Coins, tone: "bg-cream" },
    { label: "Estimated cost", value: formatCost(totalCostUsd(filteredTraces)), icon: DollarSign, tone: "bg-blush" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting()}
            {firstName && `, ${firstName}`}
          </h1>
          <p className="text-slate-500 mt-1">Here is how your LLM apps are doing, based on the latest traces.</p>
        </div>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field">
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <button onClick={handleExport} className="btn">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <HeroCard />
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Top models</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modelStats.map((model, i) => (
            <ModelCard key={model._id} model={model} color={colors[i]} />
          ))}
        </div>
        {modelStats.length === 0 && <p className="text-sm text-slate-500">No model calls yet.</p>}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TraceDetailPanel trace={filteredTraces[0]} />
        </div>
        <UsageChart traces={filteredTraces} />
      </div>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent traces</h2>
          <Link to="/traces" className="text-sm font-medium hover:underline">
            View all
          </Link>
        </div>
        <TraceTable traces={filteredTraces.slice(0, 8)} />
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
