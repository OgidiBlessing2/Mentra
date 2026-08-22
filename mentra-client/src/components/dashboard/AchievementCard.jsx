import { Lock } from "lucide-react";
import { useAchievements } from "../../hooks/useAchievements";

export default function AchievementCard() {
  const {
    achievements,
    isLoading,
    error,
  } = useAchievements();

  if (isLoading) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">
          Achievements 🏆
        </h2>

        <p className="text-sm text-zinc-500 mt-3">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">
          Achievements 🏆
        </h2>

        <p className="text-sm text-red-400 mt-3">
          Failed to load achievements.
        </p>
      </div>
    );
  }

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  return (
    <div className="bg-zinc-900 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Achievements 🏆
          </h2>

          <p className="text-sm text-zinc-500">
            Your learning milestones
          </p>
        </div>

        <div className="text-sm text-zinc-400">
          {unlockedCount}/{achievements.length}
        </div>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-2 gap-3">
        {achievements.slice(0, 4).map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl p-4 border transition ${
              achievement.unlocked
                ? "border-yellow-500/20 bg-yellow-500/5"
                : "border-zinc-800 bg-zinc-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-2xl ${
                  achievement.unlocked
                    ? ""
                    : "grayscale opacity-30"
                }`}
              >
                {achievement.icon}
              </span>

              {!achievement.unlocked && (
                <Lock
                  size={15}
                  className="text-zinc-600"
                />
              )}
            </div>

            <h3
              className={`text-sm font-semibold mt-3 ${
                achievement.unlocked
                  ? "text-white"
                  : "text-zinc-500"
              }`}
            >
              {achievement.name}
            </h3>

            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
              {achievement.description}
            </p>

            {achievement.unlocked && (
              <p className="text-xs text-yellow-400 mt-2">
                ✓ Unlocked
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}