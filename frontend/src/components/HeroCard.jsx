import { Sparkles } from "lucide-react";

export default function HeroCard() {
  return (
    <div className="bg-gradient-to-br from-indigo-600/70 via-violet-600/60 to-slate-900/70 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 rounded-xl p-6 text-white flex flex-col justify-between min-h-[220px] opacity-0 animate-fadeInUp transition-all duration-300 hover:border-white/20">
      <div>
        <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
          <Sparkles size={12} />
          Planned — Week 3
        </span>
        <h3 className="text-lg font-display font-semibold mt-4">
          LLM Evaluation Insights
        </h3>
        <p className="text-sm text-white/70 mt-2">
          Automated relevance and quality scoring for every traced response,
          surfaced here once the evaluation service is integrated.
        </p>
      </div>
      <div className="space-y-2 mt-6">
        <button
          className="w-full bg-white/90 text-slate-900 text-sm font-medium rounded-lg py-2 opacity-60 cursor-not-allowed"
          disabled
        >
          View Evaluations
        </button>
      </div>
    </div>
  );
}
