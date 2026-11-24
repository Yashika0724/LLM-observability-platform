import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = (user.name || "?")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSearch = (e) => {
    e.preventDefault();
    const text = e.target.search.value.trim();
    navigate(text ? `/traces?q=${encodeURIComponent(text)}` : "/traces");
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <form onSubmit={handleSearch} className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          name="search"
          type="text"
          placeholder="Search traces..."
          className="bg-white rounded-full pl-10 pr-4 py-2.5 text-sm w-80 border border-black/5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </form>

      <div className="flex items-center gap-3 bg-white rounded-full pl-1.5 pr-4 py-1.5 border border-black/5">
        <div className="w-8 h-8 rounded-full bg-lavender flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
        </div>
      </div>
    </header>
  );
}
