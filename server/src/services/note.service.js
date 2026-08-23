import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { notes } from "../db/schema/note.js";

// Create Note
export async function createNoteService(userId, data) {
  const [note] = await db
    .insert(notes)
    .values({
      userId,
      lessonId: data.lessonId || null,
      title: data.title,
      content: data.content,
    })
    .returning();

  return note;
}

// Get All Notes
export async function getNotesService(userId) {
  return await db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId));
}

// Get One Note
export async function getNoteService(id, userId) {
  const [note] = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.id, id),
        eq(notes.userId, userId)
      )
    );

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
}

// Update Note
export async function updateNoteService(
  id,
  userId,
  data
) {
  const [note] = await db
    .update(notes)
    .set({
      title: data.title,
      content: data.content,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notes.id, id),
        eq(notes.userId, userId)
      )
    )
    .returning();

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
}

export async function deleteNoteService(id, userId) {
  const [deletedNote] = await db
    .delete(notes)
    .where(
      and(
        eq(notes.id, id),
        eq(notes.userId, userId)
      )
    )
    .returning();

  if (!deletedNote) {
    throw new Error("Note not found or you don't own this note");
  }

  return {
    message: "Note deleted successfully",
  };
}