import { Router } from "express";
import {
  getLesson,
  completeLesson,
  getCurrentLesson,
} from "../controllers/lesson.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/current", protect, getCurrentLesson);
router.get("/:id", protect, getLesson);
router.patch("/:id/complete", protect, completeLesson);

export default router;