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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="card p-8 w-full max-w-sm space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-ink text-cream flex items-center justify-center">
            <Activity size={16} />
          </div>
          <p className="font-semibold">LLM Observability</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Login</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="field w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="field w-full"
          required
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          className="btn w-full py-2.5"
        >
          Login
        </button>
        <p className="text-xs text-slate-500 text-center">
          No account?{" "}
          <Link to="/register" className="font-medium text-ink underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
