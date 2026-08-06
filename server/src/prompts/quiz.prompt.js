export function buildQuizPrompt(lesson) {
  return `
You are an expert programming instructor.

Generate exactly 5 multiple-choice questions based ONLY on this lesson.

Lesson Title:
${lesson.title}

Lesson Content:
${lesson.content.notes}

Return ONLY valid JSON.

{
  "questions":[
    {
      "question":"...",
      "options":[
        "...",
        "...",
        "...",
        "..."
      ],
      "correctAnswer":0,
      "explanation":"..."
    }
  ]
}

Rules:

- Exactly 5 questions.
- Exactly 4 options.
- correctAnswer must be 0,1,2 or 3.
- Don't explain outside JSON.
- No markdown.
- No code fences.
`;
}