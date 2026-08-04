import { Router } from "express";
import {
  generateRoadmap,
  getRoadmap,
} from "../controllers/roadmap.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/generate", protect,  generateRoadmap);

router.get("/:id",protect, getRoadmap);

export default router;