
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { quizzes } from "../db/schema/quizzes.js";
import { quizQuestions } from "../db/schema/quizQuestions.js";
import { lessons } from "../db/schema/lesson.js";
import { quizAttempts } from "../db/schema/quizAttempts.js";
import { eq } from "drizzle-orm";

import { generateText } from "./ai.service.js";
import { getLessonContent } from "./lessonContent.service.js";

import { buildQuizPrompt } from "../prompts/quiz.prompt.js";

export async function generateQuizService(lessonId) {
  // --------------------------------------------------
  // Check if quiz already exists
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Get lesson
  // --------------------------------------------------

  const [lesson] = await db
    .select()
    .from(lessons)
    .where(eq(lessons.id, lessonId));

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  // --------------------------------------------------
  // Get the actual lesson content
  // --------------------------------------------------

  const content = await getLessonContent(lesson.id);

  if (!content) {
    throw new Error("Lesson content not found");
  }

  // --------------------------------------------------
  // Build quiz prompt
  // --------------------------------------------------

  const prompt = buildQuizPrompt({
    ...lesson,
    content,
  });

  console.log("Generating quiz for:", lesson.title);

  // --------------------------------------------------
  // Generate quiz with AI
  // --------------------------------------------------

  const response = await generateText(prompt);

  console.log("Gemini quiz response:");
  console.log(response);

  // --------------------------------------------------
  // Clean AI response
  // --------------------------------------------------

  const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let quiz;

  try {
    quiz = JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Failed to parse Gemini quiz response:");
    console.error(cleanedResponse);

    throw new Error("AI returned invalid quiz JSON");
  }

  // --------------------------------------------------
  // Validate quiz
  // --------------------------------------------------

  if (
    !quiz ||
    !Array.isArray(quiz.questions) ||
    quiz.questions.length === 0
  ) {
    throw new Error("AI returned an invalid quiz");
  }

  // --------------------------------------------------
  // Create quiz
  // --------------------------------------------------

  const [newQuiz] = await db
    .insert(quizzes)
    .values({
      lessonId,
    })
    .returning();

  // --------------------------------------------------
  // Save questions
  // --------------------------------------------------

  for (const question of quiz.questions) {
    if (
      !question.question ||
      !Array.isArray(question.options) ||
      question.options.length < 4 ||
      !question.correctAnswer
    ) {
      continue;
    }

    await db
      .insert(quizQuestions)
      .values({
        quizId: newQuiz.id,

        question: question.question,

        optionA: question.options[0],

        optionB: question.options[1],

        optionC: question.options[2],

        optionD: question.options[3],

        correctAnswer: question.correctAnswer,

        explanation: question.explanation || "",
      });
  }

  // --------------------------------------------------
  // Get saved questions
  // --------------------------------------------------

  const savedQuestions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, newQuiz.id));

  return {
    ...newQuiz,
    questions: savedQuestions,
  };
}

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
  // Get quiz
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
    .where(eq(quizQuestions.quizId, quizId));

  if (!questions.length) {
    throw new Error("No questions found for this quiz");
  }

  // -----------------------------------------
  // Calculate score
  // -----------------------------------------

  let score = 0;

  const results = questions.map((question) => {
    const submittedAnswer = answers.find(
      (answer) =>
        answer.questionId === question.id
    );

    const selectedAnswer =
      submittedAnswer?.answer != null
        ? Number(submittedAnswer.answer)
        : null;

    const correctAnswer =
      Number(question.correctAnswer);

    const isCorrect =
      selectedAnswer === correctAnswer;

    if (isCorrect) {
      score++;
    }

    return {
      questionId: question.id,
      question: question.question,

      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,

      selectedAnswer,
      correctAnswer,

      isCorrect,

      explanation:
        question.explanation || "",
    };
  });

  // -----------------------------------------
  // Calculate percentage
  // -----------------------------------------

  const totalQuestions = questions.length;

  const percentage = Math.round(
    (score / totalQuestions) * 100
  );

  // -----------------------------------------
  // Save quiz attempt
  // -----------------------------------------

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

// -----------------------------------------
// Award XP
// -----------------------------------------

let xpEarned = 10; // quiz completion bonus

// 10 XP for every correct answer
xpEarned += score * 10;

// Perfect score bonus
if (percentage === 100) {
  xpEarned += 25;
}

console.log("⭐ XP earned:", xpEarned);

// Get current user
const [user] = await db
  .select()
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);

if (!user) {
  throw new Error("User not found");
}

// Add XP
const newXp = user.xp + xpEarned;

// Calculate level
const newLevel = Math.floor(newXp / 100) + 1;

await db
  .update(users)
  .set({
    xp: newXp,
    level: newLevel,
    updatedAt: new Date(),
  })
  .where(eq(users.id, userId));
  // -----------------------------------------
  // Return result
  // -----------------------------------------

  return {
  quizId,
  score,
  totalQuestions,
  percentage,
  attemptId: attempt.id,
  xpEarned,
  totalXp: newXp,
  level: newLevel,
  results,
};
}