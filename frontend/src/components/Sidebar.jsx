import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  GitBranch,
  Sparkles,
  Cpu,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", enabled: true, icon: LayoutDashboard },
  { label: "Traces", enabled: false, icon: GitBranch },
  { label: "Evaluations", enabled: false, icon: Sparkles },
  { label: "Models", enabled: false, icon: Cpu },
  { label: "Settings", enabled: false, icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between p-5 min-h-screen shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Activity size={16} />
          </div>
          <div>
            <p className="text-white font-display font-semibold leading-tight text-sm">
              LLM Observability
            </p>
            <p className="text-xs text-slate-500">Trace & Evaluate</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return item.enabled ? (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-0.5"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <Icon size={16} />
                  {item.label}
                </span>
                <span className="text-[10px] bg-white/10 text-slate-500 px-2 py-0.5 rounded-full">
                  soon
                </span>
              </div>
            );
          })}
        </nav>
      </div>
      <p className="text-xs text-slate-600">Week 1 Scaffold</p>
    </aside>
  );
}
