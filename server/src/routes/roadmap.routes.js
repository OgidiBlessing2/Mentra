import {
  generateRoadmap,
  getRoadmap,
  searchRoadmaps,
} from "../controllers/roadmap.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post(
  "/generate",
  protect,
  generateRoadmap
);

// Search user's roadmaps
router.get(
  "/search",
  protect,
  searchRoadmaps
);

// Get single roadmap
router.get(
  "/:id",
  protect,
  getRoadmap
);

export default router;