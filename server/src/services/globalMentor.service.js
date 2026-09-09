import {
  generateText,
  generateImage,
} from "./ai.service.js";

export async function chatWithGlobalMentor(message) {
  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  const prompt = `
You are Mentra AI Mentor, a friendly and intelligent personal learning assistant.

Your job is to help students learn difficult topics clearly and effectively.

Guidelines:
- Explain concepts in simple language.
- Break difficult topics into smaller steps.
- Give practical examples when useful.
- Help with programming and technical questions.
- When explaining code, use clear JavaScript examples when appropriate.
- Encourage the student without being overly verbose.
- If the student asks for a quiz, create useful questions and wait for their answers.
- If the student asks for a study plan, create a realistic structured plan.
- Never pretend to know information about the student's Mentra account that was not provided.
- If a question is unclear, ask a short clarification question.
- Prioritize teaching and understanding rather than simply giving answers.

Student's message:
${message.trim()}

Respond as the student's personal AI Mentor.
`;

  const answer = await generateText(prompt);

  return {
    answer,
  };
}

// -----------------------------------------
// Generate Mentor visual
// -----------------------------------------

export async function generateMentorImage(prompt) {
  if (!prompt || !prompt.trim()) {
    throw new Error("Image prompt is required");
  }

  const userRequest = prompt.trim();

  const imagePrompt = `
You are the visual designer for Mentra, a modern AI-powered learning platform.

Your task is to create the BEST visual representation of the student's request.

IMPORTANT:
Do NOT automatically create a diagram.

First determine what type of visual the student is requesting.

VISUAL STYLE RULES:

1. WEBSITE / WEB UI
If the request mentions a website, webpage, landing page, dashboard,
SaaS, web application, portfolio, admin panel, online platform,
login page, signup page, or similar:

Create a high-fidelity modern website UI mockup.

The design should include realistic:
- Navigation bars
- Sidebars when appropriate
- Buttons
- Cards
- Typography
- Spacing
- Sections
- Forms
- Charts when appropriate
- Icons
- Modern layouts
- Professional visual hierarchy

Make it look like a real professionally designed website,
NOT a diagram and NOT a poster.

2. MOBILE APP UI
If the request mentions an app, mobile application, Android app,
iOS app, phone interface, or mobile screen:

Create a polished high-fidelity mobile application UI.

Show realistic:
- Mobile navigation
- App bars
- Cards
- Buttons
- Tabs
- Forms
- Lists
- Bottom navigation
- Modern spacing and typography

Make it look like a real app design.

3. DASHBOARD
If the request asks for a dashboard:

Create a sophisticated SaaS-style dashboard with:
- Sidebar navigation
- Top navigation
- Statistics cards
- Charts where useful
- Recent activity
- Progress indicators
- Action buttons
- Clean visual hierarchy

Make it look like a real production application.

4. DIAGRAM / EDUCATIONAL CONCEPT
If the request explicitly asks for a diagram, flowchart,
mind map, scientific diagram, process, architecture diagram,
or asks to visually explain a concept:

Create a clean educational diagram.

Use:
- Clear sections
- Arrows
- Labels
- Logical relationships
- Simple visual hierarchy

5. ILLUSTRATION
If the request asks for an illustration, artwork, character,
scene, environment, or visual artwork:

Create a polished illustration appropriate to the request.

6. CODE / PROGRAMMING
If the request asks to visually represent code, software architecture,
a programming concept, or developer interface:

Prefer a realistic developer UI such as:
- Code editor
- Terminal
- Browser preview
- Architecture interface
- Developer dashboard

Do not turn a normal coding request into a random educational diagram.

GENERAL DESIGN RULES:

- Follow the user's request closely.
- Choose the appropriate visual style automatically.
- Prefer realistic modern digital product design for UI requests.
- Make interfaces visually polished and believable.
- Use strong spacing and alignment.
- Use professional typography.
- Avoid clutter.
- Avoid generic textbook-style visuals unless the request is educational.
- Do not add unnecessary text.
- Do not add watermarks.
- Do not add the Mentra logo unless specifically requested.
- Do not turn website requests into diagrams.
- Do not turn app requests into diagrams.
- Do not turn dashboards into diagrams.
- Make the result visually impressive.

Student's visual request:
${userRequest}
`;

  return await generateImage(imagePrompt);
}