import { Router } from "express";
import {
  generateRoadmap,
  getRoadmap,
} from "../controllers/roadmap.controller.js";

const router = Router();

router.post("/generate", generateRoadmap);

router.get("/:id", getRoadmap);

export default router;