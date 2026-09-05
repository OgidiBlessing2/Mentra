
import {
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

const activity = [
  {
    text: "Completed Variables",
    type: "lesson",
    time: "Recently",
  },
  {
    text: "Finished HTML Module",
    type: "lesson",
    time: "Recently",
  },
  {
    text: "Generated AI Roadmap",
    type: "ai",
    time: "Recently",
  },
];

export default function RecentActivity() {
  return (
    <div className="group rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 transition-all duration-300 hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/5 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--mentra-text)] sm:text-2xl">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-[var(--mentra-text-subtle)]">
            Your latest learning progress
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <Clock3 size={20} />
        </div>
      </div>

      {/* Activity list */}
      <div className="mt-8 space-y-3">
        {activity.map((item) => (
          <div
            key={item.text}
            className="group/item flex items-center gap-4 rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/20"
          >
            {/* Icon */}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                item.type === "ai"
                  ? "bg-violet-500/10 text-violet-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {item.type === "ai" ? (
                <Sparkles size={19} />
              ) : (
                <CheckCircle2 size={19} />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-[var(--mentra-text)]">
                {item.text}
              </p>

              <p className="mt-1 text-xs text-[var(--mentra-text-subtle)]">
                {item.time}
              </p>
            </div>

            {/* Status */}
            <div className="hidden shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 sm:block">
              Done
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
