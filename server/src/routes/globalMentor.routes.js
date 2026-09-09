import express from "express";

import {
  chatWithGlobalMentorController,
  generateMentorImageController,
} from "../controllers/globalMentor.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/chat",
  protect,
  chatWithGlobalMentorController
);

router.post(
  "/image",
  protect,
  generateMentorImageController
);

export default router;