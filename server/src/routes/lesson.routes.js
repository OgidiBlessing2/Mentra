import { Router } from "express";
import { completeLesson } from "../controllers/lesson.controller.js";

const router = Router();

router.patch("/:id/complete", completeLesson);

export default router;