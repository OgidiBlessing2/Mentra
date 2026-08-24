import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { bookmarks } from "../db/schema/bookmarks.js";
import { lessons } from "../db/schema/lesson.js";
// 🔖 Add bookmark
export async function createBookmarkService(userId, lessonId) {
  // Check if bookmark already exists
  const [existing] = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.lessonId, lessonId)
      )
    )
    .limit(1);

  if (existing) {
    return existing;
  }

  const [bookmark] = await db
    .insert(bookmarks)
    .values({
      userId,
      lessonId,
    })
    .returning();

  return bookmark;
}


// 📚 Get user's bookmarks
export async function getBookmarksService(userId) {
  return await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId));
}


// ❌ Remove bookmark
export async function deleteBookmarkService(
  userId,
  lessonId
) {
  const [deleted] = await db
    .delete(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, userId),
        eq(bookmarks.lessonId, lessonId)
      )
    )
    .returning();

  if (!deleted) {
    throw new Error("Bookmark not found");
  }

  return deleted;
}