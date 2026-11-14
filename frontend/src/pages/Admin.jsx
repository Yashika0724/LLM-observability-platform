import { useEffect, useState } from "react";
import api from "../utils/api.js";

const card = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6";

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
    { label: "Users", value: stats.users },
    { label: "Applications", value: stats.applications },
    { label: "Traces", value: stats.traces },
    { label: "Total cost", value: `$${stats.totalCost.toFixed(4)}` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-white">Admin</h2>
        <p className="text-sm text-slate-500">Platform-wide numbers and user roles.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {statCards && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className={card}>
              <p className="text-xs text-slate-500 uppercase">{s.label}</p>
              <p className="text-2xl font-display font-semibold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className={card}>
        <table className="w-full text-sm text-left">
          <thead className="text-slate-500 text-xs uppercase">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Joined</th>
              <th className="pb-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-white/10">
                <td className="py-3 text-slate-200">{u.name}</td>
                <td className="py-3 text-slate-400">{u.email}</td>
                <td className="py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <select
                    value={u.role}
                    disabled={u._id === me.id}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-slate-200 disabled:opacity-50"
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
