import { Router } from "express";

import {
  chat,
  explain,
  quiz,
  submitQuiz,
} from "../controllers/mentor.controller.js";

import { aiRateLimiter } from "../middlewares/rateLimiter.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/chat", aiRateLimiter, protect, chat);
router.post("/quiz", aiRateLimiter, protect, quiz);

router.post("/explain", aiRateLimiter, protect,  explain);
router.post("/quiz/submit", aiRateLimiter, protect, submitQuiz);

export default router;