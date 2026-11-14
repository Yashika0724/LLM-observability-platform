import { Link } from "react-router-dom";

export default function HeroCard() {
  return (
    <div className="bg-ink text-white rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <p className="text-xs text-white/50">LLM-as-judge</p>
        <h3 className="text-2xl font-bold leading-snug mt-2">Every answer gets a quality score</h3>
        <p className="text-sm text-white/60 mt-3">
          A judge model rates each traced response from 1 to 5 for relevance.
        </p>
      </div>
      <Link
        to="/evaluations"
        className="self-start mt-6 bg-sky text-ink text-sm font-semibold rounded-xl px-4 py-2 hover:bg-white transition"
      >
        View evaluations
      </Link>
    </div>
  );
}
