import { buildProjectPrompt } from "../prompts/project.prompt.js";
import { generateRoadmap } from "./ai.service.js";

export async function generateProjectService(module, level) {
  const prompt = buildProjectPrompt(module, level);

  const result = await generateRoadmap(prompt);

  const cleanJson = result
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanJson);
}