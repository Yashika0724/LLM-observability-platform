import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api.js";
import TraceTable from "../components/TraceTable.jsx";

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
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Traces</h2>
          <p className="text-sm text-slate-500">
            {data.total} traces
            {search && (
              <>
                {" "}matching "{search}" ·{" "}
                <button onClick={() => setFilter("q", "")} className="text-accent hover:underline">
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
            className="field"
          >
            <option value="">All statuses</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <select
            value={params.get("model") || ""}
            onChange={(e) => setFilter("model", e.target.value)}
            className="field"
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
          <button disabled={page <= 1} onClick={() => setFilter("page", page - 1)} className="btn-light">
            Previous
          </button>
          <button disabled={page >= totalPages} onClick={() => setFilter("page", page + 1)} className="btn-light">
            Next
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
