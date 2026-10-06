import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import api from "../utils/api.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Could not reach the server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 rounded-xl p-8 w-full max-w-sm space-y-4 opacity-0 animate-fadeInUp"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Activity size={16} />
          </div>
          <p className="text-white font-display font-semibold">LLM Observability</p>
        </div>
        <h1 className="text-lg font-display font-semibold text-white">Login</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
          required
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg py-2 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
        >
          Login
        </button>
        <p className="text-xs text-slate-500 text-center">
          No account?{" "}
          <Link to="/register" className="text-indigo-400">
            Register
          </Link>
        </p>
        <p className="text-xs text-slate-600 text-center">
          <Link to="/dashboard" className="hover:text-slate-400">
            Skip to dashboard preview →
          </Link>
        </p>
      </form>
    </div>
  );
}
