import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notes } from "../db/schema/note.js";

// Create Note
export async function createNoteService(userId, data) {
  const [note] = await db
    .insert(notes)
    .values({
      userId,
      lessonId: data.lessonId,
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
export async function getNoteService(id) {
  const [note] = await db
    .select()
    .from(notes)
    .where(eq(notes.id, id));

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
}

// Update Note
export async function updateNoteService(id, data) {
  const [note] = await db
    .update(notes)
    .set({
      title: data.title,
      content: data.content,
      updatedAt: new Date(),
    })
    .where(eq(notes.id, id))
    .returning();

  return note;
}

// Delete Note
export async function deleteNoteService(id) {
  await db
    .delete(notes)
    .where(eq(notes.id, id));

  return {
    message: "Note deleted successfully",
  };
}