export function buildFlashcardPrompt(topic) {
  return `
You are an expert software engineering teacher.

Generate educational flashcards for:

${topic}

Rules:
- Return ONLY valid JSON.
- No markdown.
- No explanations.
- Generate exactly 10 flashcards.

Format:

{
  "cards":[
    {
      "front":"",
      "back":""
    }
  ]
}
`;
}