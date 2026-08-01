export function buildRoadmapPrompt(data) {
  return `
You are Mentra AI, an expert software engineering mentor.

Generate ONLY the FIRST module of a learning roadmap.

Career: ${data.career}
Level: ${data.level}
Daily Study Hours: ${data.dailyHours}
Goal: ${data.goal}

Rules:
- Return ONLY valid JSON.
- No markdown.
- No explanations.
- Create exactly ONE module.
- Create exactly FIVE lessons.

JSON Format:

{
  "roadmap": {
    "title": "",
    "description": ""
  },
  "module": {
    "title": "",
    "description": "",
    "estimatedDays": 0
  },
  "lessons": [
    {
      "title": "",
      "description": "",
      "estimatedMinutes": 30,
      "project": ""
    }
  ]
}
`;
}