import { useState, useMemo } from "react";
import KpiCard from "../components/KpiCard.jsx";
import TraceTable from "../components/TraceTable.jsx";
import UsageChart from "../components/UsageChart.jsx";
import ModelCard from "../components/ModelCard.jsx";
import HeroCard from "../components/HeroCard.jsx";
import TraceDetailPanel from "../components/TraceDetailPanel.jsx";
import { dummyTraces, modelStats } from "../utils/dummyData.js";
import {
  totalTraces,
  avgLatencyMs,
  totalTokens,
  totalCostUsd,
} from "../utils/metrics.js";

export default function Dashboard() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTraces = useMemo(() => {
    if (statusFilter === "all") return dummyTraces;
    return dummyTraces.filter((t) => t.status === statusFilter);
  }, [statusFilter]);

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {modelStats.map((m, i) => (
            <ModelCard key={m.name} {...m} delay={i * 80} />
          ))}
        </div>
        <HeroCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TraceDetailPanel trace={filteredTraces[filteredTraces.length - 1]} />
        </div>
        <UsageChart traces={filteredTraces} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} delay={i * 80} />
        ))}
      </div>

      <TraceTable traces={filteredTraces} />

      <p className="text-xs text-slate-600">
        Showing placeholder demo data. Live traces will populate this view
        once the tracing API (Week 2) is connected.
      </p>
    </div>
  );
}
