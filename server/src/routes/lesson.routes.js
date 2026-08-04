import { Router } from "express";
import {
  getLesson,
  completeLesson,
} from "../controllers/lesson.controller.js";

const router = Router();

router.get("/:id", getLesson);

router.post("/:id/complete", completeLesson);

export default router;