import { Router } from "express";

import {
  createBookmark,
  getBookmarks,
  deleteBookmark,
} from "../controllers/bookmark.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protect, createBookmark);

router.get("/", protect, getBookmarks);

router.delete("/:lessonId", protect, deleteBookmark);

export default router;