
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
  // -----------------------------------------
  // Validate answers
  // -----------------------------------------

  if (!Array.isArray(answers)) {
    throw new Error("Answers must be an array");
  }

  // -----------------------------------------
  // Check that quiz exists
  // -----------------------------------------

  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1);

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // -----------------------------------------
  // Get quiz questions
  // -----------------------------------------

  const questions = await db
    .select()
    .from(quizQuestions)
    .where(
      eq(
        quizQuestions.quizId,
        quizId
      )
    );

  if (questions.length === 0) {
    throw new Error(
      "This quiz has no questions"
    );
  }

  // -----------------------------------------
  // Calculate score
  // -----------------------------------------

  let score = 0;

  for (const question of questions) {
    const submittedAnswer = answers.find(
      (answer) =>
        answer.questionId ===
        question.id
    );

    if (!submittedAnswer) {
      continue;
    }

    if (
      Number(submittedAnswer.answer) ===
      Number(question.correctAnswer)
    ) {
      score++;
    }
  }


const review = questions.map((question) => {
  const submittedAnswer = answers.find(
    (answer) =>
      answer.questionId === question.id
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

    explanation:
      question.explanation,
  };
});

return {
  id: result.id,

  quizId,

  score: result.score,

  totalQuestions:
    result.totalQuestions,

  percentage: Math.round(
    (result.score /
      result.totalQuestions) *
      100
  ),

  review,
};

  
// -----------------------------------------
// Check for existing result
// -----------------------------------------

const [existingResult] = await db
  .select()
  .from(quizResults)
  .where(
    and(
      eq(quizResults.quizId, quizId),
      eq(quizResults.userId, userId)
    )
  )
  .limit(1);


// -----------------------------------------
// Save or update result
// -----------------------------------------

let result;

if (existingResult) {
  const bestScore = Math.max(
    existingResult.score,
    score
  );

  [result] = await db
    .update(quizResults)
    .set({
      score: bestScore,
      totalQuestions: questions.length,
    })
    .where(
      eq(
        quizResults.id,
        existingResult.id
      )
    )
    .returning();
} else {
  [result] = await db
    .insert(quizResults)
    .values({
      quizId,
      userId,
      score,
      totalQuestions: questions.length,
    })
    .returning();
}


// -----------------------------------------
// Return result
// -----------------------------------------

return {
  id: result.id,

  quizId,

  score: result.score,

  totalQuestions:
    result.totalQuestions,

  percentage: Math.round(
    (result.score /
      result.totalQuestions) *
      100
  ),
};



}

