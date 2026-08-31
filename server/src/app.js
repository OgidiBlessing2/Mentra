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
import flashcardRoutes from "./routes/flashcard.routes.js";

import { clerkMiddleware } from "@clerk/express";
import quizRoutes from "./routes/quiz.route.js";



import { startJobs } from "./jobs/index.js";
dotenv.config();
// startJobs();
const app = express();
app.use((req, res, next) => {
  console.log("🌐 REQUEST:", req.method, req.originalUrl);
  next();
});
app.use(cors());

app.use(express.json());

app.use(clerkMiddleware());


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
app.use("/api/projects", projectRoutes);
app.use("/api/flashcards", flashcardRoutes);



export default app;