export default function KpiCard({ label, value, delay = 0 }) {
  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl p-4 opacity-0 animate-fadeInUp transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-slate-500">{label}</p>
        <span className="text-[10px] bg-white/10 text-slate-500 px-2 py-0.5 rounded-full">
          24H
        </span>
      </div>
      <p className="text-2xl font-display font-semibold text-white">{value}</p>
    </div>
  );
}
