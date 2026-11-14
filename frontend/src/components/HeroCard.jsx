import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function HeroCard() {
  return (
    <div className="bg-gradient-to-br from-indigo-600/70 via-violet-600/60 to-slate-900/70 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30 rounded-xl p-6 text-white flex flex-col justify-between min-h-[220px] opacity-0 animate-fadeInUp transition-all duration-300 hover:border-white/20">
      <div>
        <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
          <Sparkles size={12} />
          Live
        </span>
        <h3 className="text-lg font-display font-semibold mt-4">
          LLM Evaluation Insights
        </h3>
        <p className="text-sm text-white/70 mt-2">
          Every traced response is scored 1 to 5 for relevance by an LLM judge.
          See the Quality column in the trace table.
        </p>
      </div>
      <div className="space-y-2 mt-6">
        <Link
          to="/evaluations"
          className="block text-center w-full bg-white/90 hover:bg-white text-slate-900 text-sm font-medium rounded-lg py-2 transition"
        >
          View Evaluations
        </Link>
      </div>
    </div>
  );
}
