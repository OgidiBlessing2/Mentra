import { eq, and } from "drizzle-orm";

import { db } from "../db/index.js";
import { achievements } from "../db/schema/achievements.js";
import { userAchievements } from "../db/schema/userAchievements.js";

export async function unlockAchievement(
  userId,
  achievementKey
) {
  // Find achievement
  const [achievement] = await db
    .select()
    .from(achievements)
    .where(eq(achievements.key, achievementKey))
    .limit(1);

  if (!achievement) {
    return null;
  }

  // Check if user already unlocked it
  const [existing] = await db
    .select()
    .from(userAchievements)
    .where(
      and(
        eq(userAchievements.userId, userId),
        eq(
          userAchievements.achievementId,
          achievement.id
        )
      )
    )
    .limit(1);

  if (existing) {
    return null;
  }

  // Unlock achievement
  const [unlocked] = await db
    .insert(userAchievements)
    .values({
      userId,
      achievementId: achievement.id,
    })
    .returning();

  return {
    ...achievement,
    unlockedAt: unlocked.unlockedAt,
  };
}