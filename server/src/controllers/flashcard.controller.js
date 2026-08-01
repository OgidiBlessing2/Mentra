import { buildFlashcardPrompt } from "../prompts/flashcard.prompt.js";
import { generateRoadmap } from "../services/ai.service.js";

export async function generateFlashcardsService(topic) {
  const prompt = buildFlashcardPrompt(topic);

  const result = await generateRoadmap(prompt);

  const cleanJson = result
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanJson);
}

