import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
export default function ContinueLearning() {
  const navigate = useNavigate();

const { data, isLoading } = useDashboard();

const lesson = data?.dashboard?.currentLesson;
if (isLoading) {
  return (
    <div className="rounded-3xl bg-[#18181B] p-8">
      Loading current lesson...
    </div>
  );
}

if (!lesson) {
  return (
    <div className="rounded-3xl bg-[#18181B] p-8 text-slate-400">
      No current lesson found.
    </div>
  );
}

if (isLoading) {
  return (
    <div className="rounded-3xl bg-[#18181B] p-8">
      Loading current lesson...
    </div>
  );
}

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#18181B] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">

      {/* Background Glow */}

      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition group-hover:bg-emerald-500/20" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-bold text-white">

            Continue Learning

          </h2>

          <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-400">

            {lesson.progress}%

          </div>

        </div>

        <div className="mt-8">

          <h3 className="text-2xl font-bold text-white">

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
                width: `${lesson.progress}%`,
              }}
            />

          </div>

        </div>

        {/* Footer */}

        <div className="mt-8 flex items-center justify-between">

          <div className="space-y-2">

            <div className="flex items-center gap-2 text-slate-400">

              <Clock size={16} />

              {lesson.duration} mins

            </div>

            <div className="flex items-center gap-2 text-slate-400">

              <BookOpen size={16} />

              Lesson {lesson.lessonNumber} of {lesson.totalLessons}

            </div>

          </div>

          <button
            onClick={() =>
              navigate(`/lessons/${lesson.id}`)
            }
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            Resume

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </div>
  );
}