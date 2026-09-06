
import { Target, CheckCircle2 } from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";

export default function TodaysGoal() {
  const {
    data,
    isLoading,
    error,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Target size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--mentra-text)] sm:text-2xl">
              Today's Goal
            </h2>

            <p className="mt-1 text-[var(--mentra-text-muted)]">
              Loading your daily progress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <Target size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--mentra-text)]">
              Today's Goal
            </h2>

            <p className="mt-1 text-sm text-red-400">
              Unable to load today's progress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const today = data?.dashboard?.today;

  const completed = Number(
    today?.completedLessons ?? 0
  );

  const total = Number(
    today?.goal ?? 2
  );

  const progress = Math.min(
    Math.max(
      Number(
        today?.progress ??
          (total > 0
            ? (completed / total) * 100
            : 0)
      ),
      0
    ),
    100
  );

  const goalComplete =
    completed >= total;

  return (
    <div className="group rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/5 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <Target size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[var(--mentra-text)] sm:text-2xl">
            Today's Goal
          </h2>

          <p className="mt-1 text-[var(--mentra-text-muted)]">
            Finish {total}{" "}
            {total === 1 ? "lesson" : "lessons"}
          </p>
        </div>
      </div>

      {/* Progress */}
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

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--mentra-text-muted)]">
          {completed} / {total} completed
        </p>

        {goalComplete ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={14} />
            Goal complete
          </span>
        ) : (
          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            {total - completed}{" "}
            {total - completed === 1
              ? "lesson"
              : "lessons"}{" "}
            left
          </span>
        )}
      </div>
    </div>
  );
}
