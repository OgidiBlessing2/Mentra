import {
  BookOpen,
  Clock,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function ContinueLearning({ lesson }) {
  const navigate = useNavigate();

  if (!lesson) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 transition-colors duration-200">
        <div className="relative">
          <h2 className="text-xl font-bold text-[var(--mentra-text)]">
            Continue Learning
          </h2>

          <p className="mt-4 text-[var(--mentra-text-muted)]">
            No current lesson found.
          </p>
        </div>
      </div>
    );
  }

  const progress = Math.min(
    Math.max(lesson.progress ?? 0, 0),
    100
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5">

      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/20" />

      <div className="relative">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <BookOpen size={19} />
            </div>

            <h2 className="text-xl font-bold text-[var(--mentra-text)]">
              Continue Learning
            </h2>
          </div>

          <div className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-400">
            {progress}%
          </div>

        </div>

        {/* Lesson */}
        <div className="mt-8">

          <h3 className="break-words text-2xl font-bold text-[var(--mentra-text)]">
            {lesson.title}
          </h3>

          {lesson.module && (
            <p className="mt-2 text-[var(--mentra-text-muted)]">
              {lesson.module}
            </p>
          )}

        </div>

        {/* Progress */}
        <div className="mt-8">

          <div className="flex items-center justify-between text-xs text-[var(--mentra-text-subtle)]">
            <span>Progress</span>
            <span>{progress}% complete</span>
          </div>

          <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">

            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="space-y-2">

            <div className="flex items-center gap-2 text-sm text-[var(--mentra-text-muted)]">
              <Clock size={16} />

              {lesson.duration ??
                lesson.estimatedMinutes ??
                "--"}{" "}
              mins
            </div>

            <div className="flex items-center gap-2 text-sm text-[var(--mentra-text-muted)]">
              <BookOpen size={16} />

              Lesson{" "}
              {lesson.lessonNumber ??
                lesson.order ??
                "--"}

              {lesson.totalLessons
                ? ` of ${lesson.totalLessons}`
                : ""}
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/lessons/${lesson.id}`)
            }
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 sm:w-auto"
          >
            Resume

            <ArrowRight size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}