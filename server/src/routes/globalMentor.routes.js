
import express from "express";

import {
  chatWithGlobalMentorController,
} from "../controllers/globalMentor.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/chat",
  protect,
  chatWithGlobalMentorController
);

export default router;
