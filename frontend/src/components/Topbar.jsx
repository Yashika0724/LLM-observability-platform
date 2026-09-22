import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div>
        <p className="text-xs text-slate-500">Recommended view</p>
        <h2 className="text-lg font-display font-semibold text-white">
          Tracing Overview
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search traces..."
            className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 w-56 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40"
          />
        </div>
        <button className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-400" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform duration-200">
          YS
        </div>
      </div>
    </header>
  );
}
