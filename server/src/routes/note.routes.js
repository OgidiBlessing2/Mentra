import { Router } from "express";

import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, createNote);

router.get("/", protect, getNotes);

router.get("/:id", protect, getNote);

router.patch("/:id", protect, updateNote);

router.delete("/:id", protect, deleteNote);

export default router;