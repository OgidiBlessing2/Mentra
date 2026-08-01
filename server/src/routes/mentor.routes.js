import { Router } from "express";

import {
  chat,
  explain,
  quiz,
  submitQuiz,
} from "../controllers/mentor.controller.js";

import { aiRateLimiter } from "../middlewares/rateLimiter.js";


const router = Router();

router.post("/chat", aiRateLimiter, chat);
router.post("/quiz", aiRateLimiter, quiz);

router.post("/explain", aiRateLimiter,  explain);
router.post("/quiz/submit", aiRateLimiter, submitQuiz);

export default router;