
import express from "express";

import {

  getProjectTasks,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
} from "../controllers/projectTasks.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Project Tasks
|--------------------------------------------------------------------------
*/

// GET /api/projects/:projectId/tasks
router.get(
  "/:projectId/tasks",
  protect,
  getProjectTasks
);

// POST /api/projects/:projectId/tasks
router.post(
  "/:projectId/tasks",
  protect,
  createProjectTask
);

// PATCH /api/projects/:projectId/tasks/:taskId
router.patch(
  "/:projectId/tasks/:taskId",
  protect,
  updateProjectTask
);

// DELETE /api/projects/:projectId/tasks/:taskId
router.delete(
  "/:projectId/tasks/:taskId",
  protect,
  deleteProjectTask
);

export default router;