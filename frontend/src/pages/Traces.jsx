import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api.js";
import TraceTable from "../components/TraceTable.jsx";

const selectStyle =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40";
const buttonStyle =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed";

export default function Traces() {
  // Filters live in the URL (?status=error&page=2) so the topbar search can link here
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ traces: [], total: 0, limit: 20, models: [] });
  const [error, setError] = useState("");

  const page = Number(params.get("page")) || 1;
  const search = params.get("q");
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  useEffect(() => {
    api
      .get("/traces", { params: Object.fromEntries(params) })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || "Could not load traces"));
  }, [params]);

  function setFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page"); // new filter -> back to page 1
    setParams(next);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-white">Traces</h2>
          <p className="text-sm text-slate-500">
            {data.total} traces
            {search && (
              <>
                {" "}matching "{search}" ·{" "}
                <button onClick={() => setFilter("q", "")} className="text-indigo-400 hover:underline">
                  clear
                </button>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={params.get("status") || ""}
            onChange={(e) => setFilter("status", e.target.value)}
            className={selectStyle}
          >
            <option value="">All statuses</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <select
            value={params.get("model") || ""}
            onChange={(e) => setFilter("model", e.target.value)}
            className={selectStyle}
          >
            <option value="">All models</option>
            {data.models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TraceTable traces={data.traces} />

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setFilter("page", page - 1)} className={buttonStyle}>
            Previous
          </button>
          <button disabled={page >= totalPages} onClick={() => setFilter("page", page + 1)} className={buttonStyle}>
            Next
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
