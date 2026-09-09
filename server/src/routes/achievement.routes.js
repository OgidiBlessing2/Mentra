import { Router } from "express";

import {
  getAchievements,
} from "../controllers/achievement.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protect, getAchievements);

export default router;