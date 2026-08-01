export function buildProjectPrompt(module, level) {
  return `
You are an expert software engineering mentor.

Generate ONE real-world portfolio project.

Module:
${module}

Difficulty:
${level}

Return ONLY valid JSON.

Format:

{
  "title": "",
  "description": "",
  "difficulty": "",
  "estimatedHours": 0,
  "requirements": [],
  "bonusChallenges": []
}
`;
}