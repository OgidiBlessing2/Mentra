import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";

import {
  generateQuiz,
  submitQuiz,
} from "../controllers/quiz.controller.js";

const router = Router();

router.post(
  "/generate/:lessonId",
  protect,
  generateQuiz
);

router.post(
  "/submit/:quizId",
  protect,
  submitQuiz
);

router.post(
  "/submit/:quizId",
  (req, res, next) => {
    console.log("🚨 QUIZ SUBMIT ROUTE HIT");
    next();
  },
  protect,
  submitQuiz
);

export default router;