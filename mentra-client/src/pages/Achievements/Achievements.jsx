import AchievementCard from "../../components/dashboard/AchievementCard";
import { useAchievements } from "../../hooks/useAchievements";

export default function Achievements() {
  const {
    achievements,
    isLoading,
    error,
  } = useAchievements();

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">
          Loading achievements...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Failed to load achievements.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Achievements 🏆
        </h1>

        <p className="mt-2 text-slate-500">
          Complete challenges and earn achievements
          as you progress through Mentra.
        </p>
      </div>

      {/* Achievement grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>
    </div>
  );
}