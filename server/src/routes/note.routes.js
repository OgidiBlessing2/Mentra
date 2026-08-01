import { Router } from "express";
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";

const router = Router();

router.post("/", createNote);

router.get("/", getNotes);

router.get("/:id", getNote);

router.patch("/:id", updateNote);

router.delete("/:id", deleteNote);

export default router