export function buildRoadmapPrompt(request) {

return `
Create a detailed learning roadmap.

Career:
${request.career}

Level:
${request.level}

Goal:
${request.goal}


Return ONLY valid JSON.

Format:

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
- Create 5-8 modules
- Each module should have 4-8 lessons
- First lesson should be beginner friendly
- Last lessons should contain projects
`;
}