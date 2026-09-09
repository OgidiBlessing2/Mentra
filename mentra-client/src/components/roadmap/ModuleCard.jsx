import { useState } from "react";
import { ChevronDown, Lock, Check, Play } from "lucide-react";
import LessonCard from "./LessonCard";

export default function ModuleCard({ module }) {
  const [open, setOpen] = useState(false);

  const lessons = module?.lessons ?? [];

  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "completed"
  ).length;

  const progress =
    lessons.length > 0
      ? Math.round((completedLessons / lessons.length) * 100)
      : 0;

  const isCompleted =
    lessons.length > 0 &&
    completedLessons === lessons.length;

  const isLocked =
    module.status === "locked";

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#18181B]">

      {/* Module header */}

      <button
        type="button"
        onClick={() => !isLocked && setOpen(!open)}
        disabled={isLocked}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/5 sm:p-6"
      >

        {/* Status */}

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isCompleted
              ? "bg-emerald-500"
              : isLocked
              ? "bg-white/5 text-slate-600"
              : "bg-violet-600"
          }`}
        >
          {isCompleted ? (
            <Check size={19} />
          ) : isLocked ? (
            <Lock size={17} />
          ) : (
            <Play size={17} fill="currentColor" />
          )}
        </div>

        {/* Info */}

        <div className="min-w-0 flex-1">

          <h2 className="truncate text-lg font-bold text-white">
            {module.title}
          </h2>

          {module.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
              {module.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">

            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              {progress}%
            </span>

          </div>

        </div>

        {/* Arrow */}

        {!isLocked && (
          <ChevronDown
            size={20}
            className={`shrink-0 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}

      </button>

      {/* Lessons */}

      {open && !isLocked && (
        <div className="border-t border-white/10 p-4 sm:p-6">

          <div className="space-y-3">

            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                />
              ))
            ) : (
              <p className="py-6 text-center text-sm text-slate-500">
                No lessons available yet.
              </p>
            )}

          </div>

        </div>
      )}

    </div>
  );
}