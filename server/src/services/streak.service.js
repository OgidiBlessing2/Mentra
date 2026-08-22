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

  if (!user.lastActiveAt) {
    streak = 1;
  } else {
    const lastActive = new Date(user.lastActiveAt);

    const today = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      )
    );

    const lastActiveDay = new Date(
      Date.UTC(
        lastActive.getUTCFullYear(),
        lastActive.getUTCMonth(),
        lastActive.getUTCDate()
      )
    );

    const difference =
      (today.getTime() - lastActiveDay.getTime()) /
      (1000 * 60 * 60 * 24);

    if (difference === 0) {
      streak = user.streak ?? 1;
    } else if (difference === 1) {
      streak = (user.streak ?? 0) + 1;
    } else {
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