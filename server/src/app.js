
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import noteRoutes from "./routes/note.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import projectRoutes from "./routes/project.routes.js";
import projectTaskRoutes from "./routes/projectTask.routes.js";
import flashcardRoutes from "./routes/flashcard.routes.js";
import quizRoutes from "./routes/quiz.route.js";
import globalMentorRoutes from "./routes/globalMentor.routes.js"
import { clerkMiddleware } from "@clerk/express";
// import { startJobs } from "./jobs/index.js";

dotenv.config();

const app = express();

/* =========================
   REQUEST LOGGER
========================= */

app.use((req, res, next) => {
  console.log("🌐 REQUEST:", req.method, req.originalUrl);
  next();
});

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use(clerkMiddleware());

/* =========================
   ROUTES
========================= */

app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/lessons", lessonRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/achievements", achievementRoutes);

app.use("/api/roadmaps", roadmapRoutes);

app.use("/api/mentor", mentorRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/notes", noteRoutes);

app.use("/api/bookmarks", bookmarkRoutes);

app.use("/api/flashcards", flashcardRoutes);

/*
|--------------------------------------------------------------------------
| PROJECT ROUTES
|--------------------------------------------------------------------------
*/

app.use("/api/projects", projectRoutes);

app.use( "/api/ai-mentor", globalMentorRoutes );
/*
|--------------------------------------------------------------------------
| PROJECT TASK ROUTES
|--------------------------------------------------------------------------
|
| This produces:
|
| GET    /api/projects/:projectId/tasks
| POST   /api/projects/:projectId/tasks
| PATCH  /api/projects/:projectId/tasks/:taskId
| DELETE /api/projects/:projectId/tasks/:taskId
|
*/

app.use("/api/projects", projectTaskRoutes);

/* =========================
   404 HANDLER
========================= */

app.use((req, res) => {
  console.log("❌ ROUTE NOT FOUND:", req.method, req.originalUrl);

  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((error, req, res, next) => {
  console.error("🔥 SERVER ERROR:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

export default app;