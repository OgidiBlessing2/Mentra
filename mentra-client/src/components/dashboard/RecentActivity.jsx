
import {
  CheckCircle2,
  Clock3,
  Sparkles,
  Activity,
} from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";

export default function RecentActivity() {
  const {
    data,
    isLoading,
    error,
  } = useDashboard();

  const activity =
    data?.dashboard?.recentActivity ?? [];

  if (isLoading) {
    return (
      <div className="rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 sm:p-8">
        <Header />

        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-[var(--mentra-surface-2)]" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-[var(--mentra-surface-2)]" />
                  <div className="h-3 w-1/3 rounded bg-[var(--mentra-surface-2)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 sm:p-8">
        <Header />

        <div className="mt-8 rounded-2xl border border-red-500/10 bg-red-500/5 p-5">
          <p className="text-sm text-red-400">
            Unable to load recent activity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-[30px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 transition-all duration-300 hover:border-violet-500/20 hover:shadow-xl hover:shadow-violet-500/5 sm:p-8">
      <Header />

      {activity.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <Activity size={22} />
          </div>

          <h3 className="mt-4 font-semibold text-[var(--mentra-text)]">
            No recent activity
          </h3>

          <p className="mt-2 max-w-sm text-sm text-[var(--mentra-text-muted)]">
            Complete a lesson or start learning to see your progress here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {activity.map((item) => (
            <ActivityItem
              key={item.id}
              activity={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
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
  );
}

function ActivityItem({ activity }) {
  const isAI = activity.type === "ai";

  return (
    <div className="group/item flex items-center gap-4 rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isAI
            ? "bg-violet-500/10 text-violet-400"
            : "bg-emerald-500/10 text-emerald-400"
        }`}
      >
        {isAI ? (
          <Sparkles size={19} />
        ) : (
          <CheckCircle2 size={19} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--mentra-text)]">
          {activity.text}
        </p>

        <p className="mt-1 text-xs text-[var(--mentra-text-subtle)]">
          {formatActivityTime(activity.time)}
        </p>
      </div>

      <div
        className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:block ${
          isAI
            ? "bg-violet-500/10 text-violet-400"
            : "bg-emerald-500/10 text-emerald-400"
        }`}
      >
        {isAI ? "AI" : "Done"}
      </div>
    </div>
  );
}

function formatActivityTime(timestamp) {
  if (!timestamp) {
    return "Completed";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const difference =
    Date.now() - date.getTime();

  if (difference < 0) {
    return "Just now";
  }

  const seconds = Math.floor(
    difference / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}
