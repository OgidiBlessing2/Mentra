import { Lock, Trophy } from "lucide-react";
import { useAchievements } from "../../hooks/useAchievements";

export default function AchievementCard() {
  const {
    achievements,
    isLoading,
    error,
  } = useAchievements();

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
            <Trophy size={19} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--mentra-text)]">
              Achievements 🏆
            </h2>

            <p className="text-sm text-[var(--mentra-text-subtle)]">
              Your learning milestones
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--mentra-text-muted)]">
          Loading achievements...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
            <Trophy size={19} />
          </div>

          <h2 className="text-lg font-semibold text-[var(--mentra-text)]">
            Achievements 🏆
          </h2>
        </div>

        <p className="mt-4 text-sm text-red-400">
          Failed to load achievements.
        </p>
      </div>
    );
  }

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  return (
    <div className="group rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 transition-all duration-300 hover:border-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/5">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
            <Trophy size={19} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--mentra-text)]">
              Achievements 🏆
            </h2>

            <p className="text-sm text-[var(--mentra-text-subtle)]">
              Your learning milestones
            </p>
          </div>

        </div>

        <div className="rounded-full bg-[var(--mentra-bg)] px-3 py-1 text-sm font-semibold text-[var(--mentra-text-muted)]">
          {unlockedCount}/{achievements.length}
        </div>

      </div>

      {/* ACHIEVEMENTS */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {achievements.slice(0, 4).map((achievement) => (

          <div
            key={achievement.id}
            className={`rounded-2xl border p-4 transition-all duration-200 ${
              achievement.unlocked
                ? "border-yellow-500/20 bg-yellow-500/5 hover:-translate-y-1 hover:bg-yellow-500/10"
                : "border-[var(--mentra-border)] bg-[var(--mentra-bg)]"
            }`}
          >

            {/* ICON + LOCK */}
            <div className="flex items-center justify-between">

              <span
                className={`text-3xl transition ${
                  achievement.unlocked
                    ? ""
                    : "grayscale opacity-30"
                }`}
              >
                {achievement.icon}
              </span>

              {!achievement.unlocked && (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--mentra-surface-2)]">
                  <Lock
                    size={15}
                    className="text-[var(--mentra-text-subtle)]"
                  />
                </div>
              )}

            </div>

            {/* NAME */}
            <h3
              className={`mt-4 text-sm font-semibold ${
                achievement.unlocked
                  ? "text-[var(--mentra-text)]"
                  : "text-[var(--mentra-text-muted)]"
              }`}
            >
              {achievement.name}
            </h3>

            {/* DESCRIPTION */}
            <p className="mt-1 line-clamp-2 text-xs text-[var(--mentra-text-subtle)]">
              {achievement.description}
            </p>

            {/* UNLOCKED */}
            {achievement.unlocked && (
              <div className="mt-3 inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-400">
                ✓ Unlocked
              </div>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}