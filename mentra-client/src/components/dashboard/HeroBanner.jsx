import { ArrowRight, Sparkles } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";

export default function HeroBanner() {
  const { data } = useDashboard();

  const dashboard = data?.dashboard;

  const progress = dashboard?.stats?.progress ?? 0;
  const completedLessons =
    dashboard?.stats?.completedLessons ?? 0;

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-violet-700 via-indigo-700 to-cyan-600 p-6 shadow-2xl shadow-violet-900/40 sm:p-8 lg:p-10">

      {/* Glow */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between gap-8">

        {/* LEFT */}
        <div className="max-w-2xl">

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            <Sparkles size={16} />

            AI Powered Learning
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl">
            Continue Your
            <br />
            AI Engineer Journey 🚀
          </h1>

          <p className="mt-5 max-w-xl text-base text-indigo-100 sm:text-lg">
            Every lesson completed unlocks your next milestone.
            Keep building your roadmap and become an AI Engineer.
          </p>

          <button
            type="button"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-violet-700 transition hover:scale-105"
          >
            Continue Learning

            <ArrowRight size={20} />
          </button>

        </div>

        {/* RIGHT — PROGRESS */}
        <div className="hidden xl:flex flex-col items-center">

          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl">

            <h3 className="text-indigo-100">
              Overall Progress
            </h3>

            <div className="mt-4 text-6xl font-black text-white">
              {progress}%
            </div>

            <div className="mt-6 h-3 w-72 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(progress, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-4 text-indigo-100">
              {completedLessons}{" "}
              {completedLessons === 1
                ? "lesson"
                : "lessons"}{" "}
              completed
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}