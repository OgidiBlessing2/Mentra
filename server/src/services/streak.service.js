import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";

export async function updateUserStreak(userId) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();

  let streak = user.streak ?? 0;

  // First learning activity
  if (!user.lastActiveAt) {
    streak = 1;
  } else {
    const lastActive = new Date(user.lastActiveAt);

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const lastDay = new Date(lastActive);
    lastDay.setHours(0, 0, 0, 0);

    const difference =
      today.getTime() - lastDay.getTime();

    const daysSinceLastActivity =
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

    if (daysSinceLastActivity === 0) {
      // Already learned today.
      // Don't increase the streak again.
      streak = streak;
    } else if (daysSinceLastActivity === 1) {
      // Learned yesterday.
      streak += 1;
    } else {
      // Missed one or more days.
      streak = 1;
    }
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      streak,
      lastActiveAt: now,
      updatedAt: now,
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
}