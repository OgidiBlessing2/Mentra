import {
  buildChatPrompt,
  buildExplainPrompt,
  buildQuizPrompt,
} from "../prompts/mentor.prompt.js";

import { generateRoadmap } from "./ai.service.js";

export async function chatService(message) {
  const prompt = buildChatPrompt(message);

  const reply = await generateRoadmap(prompt);

  return reply.replace(/\\n/g, "\n");
}

export async function explainService(topic) {
  const prompt = buildExplainPrompt(topic);
  const reply =  await generateRoadmap(prompt);
  return reply.replace(/\\n/g, "\n");
}

export async function quizService(topic) {
  const prompt = buildQuizPrompt(topic);

  const result = await generateRoadmap(prompt);

  return JSON.parse(result);
}

export async function submitQuizService(questions, userAnswers) {
  let score = 0;

  const results = questions.map((question, index) => {
    const isCorrect =
      question.answer.trim().toLowerCase() ===
      userAnswers[index].trim().toLowerCase();

    if (isCorrect) {
      score++;
    }

    return {
      question: question.question,
      correct: isCorrect,
      correctAnswer: question.answer,
      userAnswer: userAnswers[index],
    };
  });

  return {
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    results,
  };
}