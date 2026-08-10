
import { eq, and } from "drizzle-orm";

import { db } from "../db/index.js";

import { quizzes } from "../db/schema/quizzes.js";
import { quizQuestions } from "../db/schema/quizQuestions.js";
import { quizResults } from "../db/schema/quizResults.js";


export async function submitQuizService(
  quizId,
  userId,
  answers
) {
  if (!Array.isArray(answers)) {
    throw new Error("Answers must be an array");
  }

  // Find quiz
  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1);

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Get questions
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId));

  if (questions.length === 0) {
    throw new Error("This quiz has no questions");
  }

  // Calculate score
  let score = 0;

  for (const question of questions) {
    const submittedAnswer = answers.find(
      (answer) => answer.questionId === question.id
    );

    if (
      submittedAnswer &&
      Number(submittedAnswer.answer) ===
        Number(question.correctAnswer)
    ) {
      score++;
    }
  }

  const totalQuestions = questions.length;

  const percentage = Math.round(
    (score / totalQuestions) * 100
  );

  // Build answer review
  const review = questions.map((question) => {
    const submittedAnswer = answers.find(
      (answer) => answer.questionId === question.id
    );

    const userAnswer = submittedAnswer
      ? Number(submittedAnswer.answer)
      : null;

    const correctAnswer =
      Number(question.correctAnswer);

    return {
      questionId: question.id,
      question: question.question,

      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,

      userAnswer,
      correctAnswer,

      isCorrect:
        userAnswer === correctAnswer,

      explanation: question.explanation,
    };
  });

  // Save quiz attempt
  const [attempt] = await db
    .insert(quizAttempts)
    .values({
      quizId,
      userId,
      score,
      totalQuestions,
      percentage,
    })
    .returning();

  return {
    id: attempt.id,
    quizId,
    score,
    totalQuestions,
    percentage,
    review,
  };
}