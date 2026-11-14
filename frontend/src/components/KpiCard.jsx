export default function KpiCard({ label, value, delay = 0 }) {
  return (
    <div
      className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-xl p-4 opacity-0 animate-fadeInUp transition-all duration-200 hover:border-white/20 hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-xs text-slate-500 mb-2">{label}</p>
      <p className="text-2xl font-display font-semibold text-white">{value}</p>
    </div>
  );
}
