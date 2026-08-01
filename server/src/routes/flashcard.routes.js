import { Router } from "express";
import { generateFlashcardsService } from "../controllers/flashcard.controller.js";

const router = Router();

router.post("/generate", generateFlashcardsService);

export default router;