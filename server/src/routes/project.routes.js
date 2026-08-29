import { Router } from "express";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Create project
router.post(
  "/",
  protect,
  createProject
);

// Get user's projects
router.get(
  "/",
  protect,
  getProjects
);

// Get single project
router.get(
  "/:id",
  protect,
  getProject
);

// Update project
router.put(
  "/:id",
  protect,
  updateProject
);

// Delete project
router.delete(
  "/:id",
  protect,
  deleteProject
);

export default router;