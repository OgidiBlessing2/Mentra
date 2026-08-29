import { useNavigate } from "react-router-dom";
import { Check, Lock, Play } from "lucide-react";

export default function LessonCard({ lesson }) {
  const navigate = useNavigate();

  const completed = lesson.status === "completed";
  const active = lesson.status === "active";
  const locked = lesson.status === "locked";

  const handleClick = () => {
    if (locked) return;

    navigate(`/lessons/${lesson.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={locked}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
        locked
          ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-50"
          : "border-white/10 bg-[#111113] hover:border-violet-500/30 hover:bg-white/5"
      }`}
    >

      {/* Status */}

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          completed
            ? "bg-emerald-500/10 text-emerald-400"
            : active
            ? "bg-violet-500/10 text-violet-400"
            : "bg-white/5 text-slate-500"
        }`}
      >
        {completed ? (
          <Check size={18} />
        ) : active ? (
          <Play size={17} fill="currentColor" />
        ) : (
          <Lock size={17} />
        )}
      </div>

      {/* Lesson info */}

      <div className="min-w-0 flex-1">

        <h3 className="truncate font-semibold text-white">
          {lesson.title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {lesson.estimatedMinutes
            ? `${lesson.estimatedMinutes} mins`
            : "Lesson"}
        </p>

      </div>

      {/* Status text */}

      <span
        className={`hidden text-xs font-semibold sm:block ${
          completed
            ? "text-emerald-400"
            : active
            ? "text-violet-400"
            : "text-slate-500"
        }`}
      >
        {completed
          ? "Completed"
          : active
          ? "Continue"
          : "Locked"}
      </span>

    </button>
  );
}