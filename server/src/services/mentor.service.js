import { eq } from "drizzle-orm";

import { db } from "../db/index.js";

import { lessons } from "../db/schema/lesson.js";
import { lessonContents } from "../db/schema/lessonContents.js";

import { buildMentorPrompt } from "../prompts/mentor.prompt.js";

import { generateRoadmap } from "./ai.service.js";

export async function chatWithMentor(
  lessonId,
  question
) {

  // Get lesson
  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId));

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  // Get generated lesson content
  const [content] = await db
    .select()
    .from(lessonContents)
    .where(eq(lessonContents.lessonId, lessonId));

  if (!content) {
    throw new Error(
      "Lesson content not found"
    );
  }

  // Build prompt
  const prompt = buildMentorPrompt({
    lesson,
    content,
    question,
  });

  // Ask Gemini
  const answer = await generateRoadmap(prompt);

  return {
    answer,
  };
}