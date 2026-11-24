import { useEffect, useState } from "react";
import api from "../utils/api.js";
import KpiCard from "../components/KpiCard.jsx";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const me = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/users")])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data);
      })
      .catch((err) => setError(err.response?.data?.error || "Could not load admin data"));
  }, []);

  async function changeRole(userId, role) {
    setError("");
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers(users.map((u) => (u._id === userId ? res.data : u)));
    } catch (err) {
      setError(err.response?.data?.error || "Could not change role");
    }
  }

  const statCards = stats && [
    { label: "Users", value: stats.users, tone: "bg-lavender" },
    { label: "Applications", value: stats.applications, tone: "bg-mint" },
    { label: "Traces", value: stats.traces, tone: "bg-cream" },
    { label: "Total cost", value: `$${stats.totalCost.toFixed(4)}`, tone: "bg-blush" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin</h2>
        <p className="text-sm text-slate-500">Platform-wide numbers and user roles.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {statCards && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <KpiCard key={s.label} {...s} />
          ))}
        </div>
      )}

      <div className="card p-6">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400">
            <tr>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Joined</th>
              <th className="pb-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-black/5">
                <td className="py-3 text-ink">{u.name}</td>
                <td className="py-3 text-slate-500">{u.email}</td>
                <td className="py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <select
                    value={u.role}
                    disabled={u._id === me.id}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="field py-1 disabled:opacity-50"
                  >
                    <option value="developer">developer</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
