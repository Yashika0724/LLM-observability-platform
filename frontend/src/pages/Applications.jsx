import { useEffect, useState } from "react";
import api, { API_URL } from "../utils/api.js";

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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
        <p className="text-sm text-slate-500">
          Each app gets its own API key. Your LLM app sends traces using this key.
        </p>
      </div>

      <form onSubmit={handleCreate} className="card p-6 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="App name, e.g. support-bot"
          className="field flex-1"
        />
        <button className="btn">
          Create app
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {newKey && (
        <div className="bg-lavender rounded-2xl p-6">
          <p className="font-semibold">Your API key</p>
          <p className="text-xs text-slate-500 mb-3">
            Copy it now. It is shown only once and cannot be recovered.
          </p>
          <div className="flex gap-3">
            <code className="flex-1 bg-white rounded-xl px-3 py-2 text-sm text-accent break-all">
              {newKey}
            </code>
            <button
              onClick={handleCopy}
              className="btn"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Send traces to <code className="text-ink">{API_URL}/v1/traces</code> with
            the header <code className="text-ink">x-api-key: &lt;your key&gt;</code>.
          </p>
        </div>
      )}

      <div className="card p-6">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">API key</th>
              <th className="pb-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-t border-black/5">
                <td className="py-3 text-ink">{app.name}</td>
                <td className="py-3 text-slate-500 font-mono">obs_••••{app.keyPreview}</td>
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
