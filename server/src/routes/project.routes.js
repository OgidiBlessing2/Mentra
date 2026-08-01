import { Router } from "express";
import { generateProject } from "../controllers/project.controller.js";

const router = Router();

router.post("/generate", generateProject);

export default router;