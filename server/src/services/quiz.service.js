import { db } from "../db/index.js";

import { quizzes } from "../db/schema/quizzes.js";

import { quizQuestions } from "../db/schema/quizQuestions.js";

import { lessons } from "../db/schema/lesson.js";

import { eq } from "drizzle-orm";

import { generateText } from "../ai/gemini.js";

import { buildQuizPrompt } from "../prompts/quiz.prompt.js";

export async function generateQuizService(
  lessonId
) {
	const [existingQuiz] = await db
	  .select()
	  .from(quizzes)
	  .where(eq(quizzes.lessonId, lessonId));

	if (existingQuiz) {
	  const questions = await db
	    .select()
	    .from(quizQuestions)
	    .where(eq(quizQuestions.quizId, existingQuiz.id));

	  return {
	    ...existingQuiz,
	    questions,
	  };
	}

	const [lesson] = await db
	  .select()
	  .from(lessons)
	  .where(eq(lessons.id, lessonId));

	if (!lesson) {
	  throw new Error("Lesson not found");
	}

	const prompt = buildQuizPrompt(lesson);
	const response = await generateText(prompt);
	const quiz = JSON.parse(response);

	const [newQuiz] = await db
  .insert(quizzes)
  .values({
    lessonId,
  })
  .returning();

  for (const question of quiz.questions) {
  await db.insert(quizQuestions).values({
    quizId: newQuiz.id,

    question: question.question,

    optionA: question.options[0],

    optionB: question.options[1],

    optionC: question.options[2],

    optionD: question.options[3],

    correctAnswer: question.correctAnswer,

    explanation: question.explanation,
  });
}

const savedQuestions = await db
  .select()
  .from(quizQuestions)
  .where(eq(quizQuestions.quizId, newQuiz.id));

return {
  ...newQuiz,
  questions: savedQuestions,
};


}