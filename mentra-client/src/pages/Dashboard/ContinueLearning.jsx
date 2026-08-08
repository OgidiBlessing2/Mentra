
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
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#18181B] p-6">
        <div className="relative">
          <h2 className="text-xl font-bold text-white">
            Continue Learning
          </h2>

          <p className="mt-4 text-slate-400">
            No current lesson found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#18181B] p-6">

      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition group-hover:bg-emerald-500/20" />

      <div className="relative">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">

          <h2 className="text-xl font-bold text-white">
            Continue Learning
          </h2>

          <div className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-400">
            {lesson.progress ?? 0}%
          </div>

        </div>

        {/* Lesson */}
        <div className="mt-8">

          <h3 className="break-words text-2xl font-bold text-white">
            {lesson.title}
          </h3>

          <p className="mt-2 text-slate-400">
            {lesson.module}
          </p>

        </div>

        {/* Progress */}
        <div className="mt-8">

          <div className="h-3 overflow-hidden rounded-full bg-[#2A2A2A]">

            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
              style={{
                width: `${lesson.progress ?? 0}%`,
              }}
            />

          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="space-y-2">

            <div className="flex items-center gap-2 text-sm text-slate-400">

              <Clock size={16} />

              {lesson.duration ?? lesson.estimatedMinutes ?? "--"} mins

            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">

              <BookOpen size={16} />

              Lesson {lesson.lessonNumber ?? lesson.order ?? "--"}
              {lesson.totalLessons
                ? ` of ${lesson.totalLessons}`
                : ""}

            </div>

          </div>

          <button
            onClick={() => navigate(`/lessons/${lesson.id}`)}
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 sm:w-auto"
          >
            Resume

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </div>
  );
}
