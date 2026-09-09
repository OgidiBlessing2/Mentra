
import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";

import { chat } from "../controllers/mentor.controller.js";

const router = Router();

router.post(
  "/chat",
  protect,
  chat
);

export default router;