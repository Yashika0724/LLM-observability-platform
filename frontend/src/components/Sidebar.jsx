import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  GitBranch,
  Sparkles,
  KeyRound,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Applications", path: "/applications", icon: KeyRound },
  { label: "Traces", path: "/traces", icon: GitBranch },
  { label: "Evaluations", path: "/evaluations", icon: Sparkles },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const items =
    user.role === "admin"
      ? [...navItems, { label: "Admin", path: "/admin", icon: ShieldCheck }]
      : navItems;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <aside className="w-60 shrink-0 bg-ink text-white rounded-3xl p-5 flex flex-col sticky top-4 self-start h-[calc(100vh-2rem)]">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-9 h-9 rounded-xl bg-cream text-ink flex items-center justify-center">
          <Activity size={18} />
        </div>
        <p className="font-semibold leading-tight">LLM Observability</p>
      </div>

      <p className="text-xs text-white/40 mb-3 px-3">General</p>
      <nav className="space-y-1 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white transition"
      >
        <LogOut size={17} />
        Log out
      </button>
    </aside>
  );
}
