import {
  getProjectTasksService,
  createProjectTaskService,
  updateProjectTaskService,
  deleteProjectTaskService,
} from "../services/projectTasks.service.js";

// GET /api/projects/:projectId/tasks
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const tasks = await getProjectTasksService(
      userId,
      projectId
    );

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Get project tasks error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/projects/:projectId/tasks
export const createProjectTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      position,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const allowedPriorities = ["low", "medium", "high"];

    if (
      priority !== undefined &&
      !allowedPriorities.includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    const task = await createProjectTaskService(
      userId,
      projectId,
      {
        title: title.trim(),
        description,
        status,
        priority,
        dueDate,
        position,
      }
    );

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Create project task error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/projects/:projectId/tasks/:taskId
export const updateProjectTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const userId = req.user.id;

    const task = await updateProjectTaskService(
      userId,
      projectId,
      taskId,
      req.body
    );

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Update project task error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/projects/:projectId/tasks/:taskId
export const deleteProjectTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const userId = req.user.id;

    const task = await deleteProjectTaskService(
      userId,
      projectId,
      taskId
    );

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Delete project task error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};