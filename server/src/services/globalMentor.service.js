import {
  generateText,
  generateImage,
} from "./ai.service.js";

import { getDashboardService } from "./dashboard.service.js";

// -----------------------------------------
// AI Mentor Chat
// -----------------------------------------

export async function chatWithGlobalMentor(
  message,
  userId
) {
  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  // -----------------------------------------
  // Get student's learning context
  // -----------------------------------------

  const dashboard =
    await getDashboardService(userId);

  const currentLesson =
    dashboard?.currentLesson;

  const stats =
    dashboard?.stats || {};

  const today =
    dashboard?.today || {};

  const roadmap =
    dashboard?.currentRoadmap;

  // -----------------------------------------
  // Build safe AI context
  // -----------------------------------------

  const learningContext = {
    roadmapTitle:
      roadmap?.title || "No active roadmap",

    currentModule:
      currentLesson?.module || "No current module",

    currentLesson:
      currentLesson?.title || "No current lesson",

    currentLessonNumber:
      currentLesson?.lessonNumber ?? null,

    totalLessons:
      currentLesson?.totalLessons ??
      stats?.totalLessons ??
      0,

    overallProgress:
      stats?.progress ?? 0,

    completedLessons:
      stats?.completedLessons ?? 0,

    completedQuizzes:
      stats?.completedQuizzes ?? 0,

    streak:
      stats?.streak ?? 0,

    todayLessonsCompleted:
      today?.completedLessons ?? 0,

    todayGoal:
      today?.goal ?? 2,

    todayProgress:
      today?.progress ?? 0,
  };

  // -----------------------------------------
  // AI prompt
  // -----------------------------------------

  const prompt = `
You are Mentra AI Mentor, a friendly and intelligent personal learning assistant.

Your job is to help students learn difficult topics clearly and effectively.

You have access to the student's current Mentra learning context.

IMPORTANT:
- Use the learning context to personalize your response.
- Never reveal private database information.
- Never claim the student has learned something unless the context supports it.
- Do not mention database fields, APIs, internal systems, or technical implementation details.
- If there is no current lesson, simply answer normally.
- Do not force the current lesson into unrelated questions.
- If the student asks about their progress, use the provided progress information.
- If the student asks what they should study next, prioritize their current lesson.
- If the student asks for help with their current lesson, tailor the explanation to that lesson.
- If the student is struggling, explain the concept in simpler steps.
- Encourage the student without being overly verbose.

Teaching guidelines:
- Explain concepts in simple language.
- Break difficult topics into smaller steps.
- Give practical examples when useful.
- Help with programming and technical questions.
- When explaining code, use clear JavaScript examples when appropriate.
- If the student asks for a study plan, create a realistic structured plan.
- If a question is unclear, ask a short clarification question.
- Prioritize teaching and understanding rather than simply giving answers.

STUDENT LEARNING CONTEXT:

${JSON.stringify(
  learningContext,
  null,
  2
)}

STUDENT'S MESSAGE:

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