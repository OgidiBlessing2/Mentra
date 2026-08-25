import { Router } from "express";

import {
  createFlashcard,
  getFlashcards,
  updateFlashcard,
  deleteFlashcard,
} from "../controllers/flashcard.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();


// 🧠 Create flashcard
router.post(
  "/",
  protect,
  createFlashcard
);


// 📚 Get user's flashcards
router.get(
  "/",
  protect,
  getFlashcards
);


// ✏️ Update flashcard
router.put(
  "/:id",
  protect,
  updateFlashcard
);


// 🗑️ Delete flashcard
router.delete(
  "/:id",
  protect,
  deleteFlashcard
);


export default router;