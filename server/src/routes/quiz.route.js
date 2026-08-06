import { Router } from "express";

import { protect } from "../middleware/auth.middleware.js";

import { generateQuiz } from "../controllers/quiz.controller.js";

const router = Router();

router.post(
  "/generate/:lessonId",
  protect,
  generateQuiz
);

export default router;