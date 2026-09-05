import { Target } from "lucide-react";

export default function TodaysGoal() {
  const completed = 1;
  const total = 2;

  const progress = Math.min(
    Math.max((completed / total) * 100, 0),
    100
  );

  return (
    <div className="group rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/5 sm:p-8">

      {/* HEADER */}
      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <Target size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--mentra-text)] sm:text-2xl">
            Today's Goal
          </h2>

          <p className="mt-1 text-[var(--mentra-text-muted)]">
            Finish {total} lessons
          </p>
        </div>

      </div>

      {/* PROGRESS */}
      <div className="mt-8">

        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--mentra-text-subtle)]">
            Daily progress
          </span>

          <span className="font-semibold text-cyan-400">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">

          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* STATUS */}
      <div className="mt-5 flex items-center justify-between">

        <p className="text-sm text-[var(--mentra-text-muted)]">
          {completed} / {total} completed
        </p>

        {completed >= total ? (
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            Goal complete ✓
          </span>
        ) : (
          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            Keep going
          </span>
        )}

      </div>

    </div>
  );
}