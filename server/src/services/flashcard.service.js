import { and, eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { flashcards } from "../db/schema/flashcards.js";

// 🧠 Create flashcard
export async function createFlashcardService(
  userId,
  data
) {
  const { lessonId, question, answer } = data;

  const [flashcard] = await db
    .insert(flashcards)
    .values({
      userId,
      lessonId: lessonId || null,
      question,
      answer,
    })
    .returning();

  return flashcard;
}


// 📚 Get user's flashcards
export async function getFlashcardsService(userId) {
  return await db
    .select()
    .from(flashcards)
    .where(eq(flashcards.userId, userId));
}


// ✏️ Update flashcard
export async function updateFlashcardService(
  userId,
  id,
  data
) {
  const { question, answer, lessonId } = data;

  const [updated] = await db
    .update(flashcards)
    .set({
      question,
      answer,
      lessonId: lessonId || null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(flashcards.id, id),
        eq(flashcards.userId, userId)
      )
    )
    .returning();

  if (!updated) {
    throw new Error("Flashcard not found");
  }

  return updated;
}


// 🗑️ Delete flashcard
export async function deleteFlashcardService(
  userId,
  id
) {
  const [deleted] = await db
    .delete(flashcards)
    .where(
      and(
        eq(flashcards.id, id),
        eq(flashcards.userId, userId)
      )
    )
    .returning();

  if (!deleted) {
    throw new Error("Flashcard not found");
  }

  return deleted;
}