import { eq, count } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { quizAttempts } from "../db/schema/quizAttempts.js";

import { unlockAchievement } from "./achievement.service.js";


export async function checkUserAchievements(userId) {
  const unlockedAchievements = [];

  // -----------------------------------------
  // Get user
  // -----------------------------------------

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  // -----------------------------------------
  // 🧠 Quiz Master
  // -----------------------------------------

  const [{ perfectQuizzes }] = await db
    .select({
      perfectQuizzes: count(),
    })
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userId));

  // -----------------------------------------
  // Unlock Quiz Master
  // -----------------------------------------

  if (Number(perfectQuizzes) > 0) {
    const achievement = await unlockAchievement(
      userId,
      "quiz_master"
    );

    if (achievement) {
      unlockedAchievements.push(achievement);
    }
  }

  return unlockedAchievements;
}

