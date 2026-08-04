export function buildRoadmapPrompt(request) {
  return `
You are an expert career mentor.

Create a concise learning roadmap.

Career:
${request.career}

Level:
${request.level}

Goal:
${request.goal}

Return ONLY valid JSON.

{
  "roadmap": {
    "title": "string"
  },

  "modules": [
    {
      "title": "string",
      "description": "string",
      "estimatedDays": number,

      "lessons": [
        {
          "title": "string",
          "description": "string",
          "estimatedMinutes": number,
          "project": "string"
        }
      ]
    }
  ]
}

Rules:

- Exactly 3 modules.
- Exactly 5 lessons per module.
- Lesson descriptions must be under 15 words.
- Project names must be under 8 words.
- No markdown.
- No explanation.
- Return JSON only.
`;
}