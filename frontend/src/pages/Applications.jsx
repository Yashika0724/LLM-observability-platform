import { useEffect, useState } from "react";
import api from "../utils/api.js";

const card = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [name, setName] = useState("");
  const [newKey, setNewKey] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // back to "Copy" after 2s
  }

  function loadApplications() {
    api
      .get("/applications")
      .then((res) => setApplications(res.data))
      .catch((err) => setError(err.response?.data?.error || "Could not load apps"));
  }

  useEffect(loadApplications, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/applications", { name });
      setNewKey(res.data.apiKey);
      setName("");
      loadApplications();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create app");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-white">Applications</h2>
        <p className="text-sm text-slate-500">
          Each app gets its own API key. Your LLM app sends traces using this key.
        </p>
      </div>

      <form onSubmit={handleCreate} className={`${card} flex gap-3`}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="App name, e.g. support-bot"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
        <button className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg px-4">
          Create app
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {newKey && (
        <div className={`${card} border-indigo-500/40`}>
          <p className="text-sm text-white font-medium">Your API key</p>
          <p className="text-xs text-slate-400 mb-3">
            Copy it now. It is shown only once and cannot be recovered.
          </p>
          <div className="flex gap-3">
            <code className="flex-1 bg-black/40 rounded-lg px-3 py-2 text-sm text-indigo-300 break-all">
              {newKey}
            </code>
            <button
              onClick={handleCopy}
              className="bg-white/10 hover:bg-white/20 active:scale-95 transition text-white text-sm rounded-lg px-4"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Send traces to <code className="text-slate-200">http://localhost:8000/v1/traces</code> with
            the header <code className="text-slate-200">x-api-key: &lt;your key&gt;</code>.
          </p>
        </div>
      )}

      <div className={card}>
        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 text-xs uppercase">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">API key</th>
              <th className="pb-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-t border-white/10">
                <td className="py-3 text-slate-200">{app.name}</td>
                <td className="py-3 text-slate-400 font-mono">obs_••••{app.keyPreview}</td>
                <td className="py-3 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && (
          <p className="text-sm text-slate-500">No apps yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
