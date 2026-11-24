// tone = background colour of the tile, e.g. "bg-lavender"
export default function KpiCard({ label, value, icon: Icon, tone = "bg-lavender" }) {
  return (
    <div className={`${tone} rounded-2xl p-5`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">{label}</p>
        {Icon && (
          <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight mt-6">{value}</p>
    </div>
  );
}
