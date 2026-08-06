export function buildLessonPrompt(lesson) {

return `
You are an expert software instructor.

Teach this lesson.

Title:
${lesson.title}

Description:
${lesson.description}

Return ONLY JSON.

{
  "notes":"",
  "codeExample":"",
  "exercise":"",
  "summary":""
}
`;

}