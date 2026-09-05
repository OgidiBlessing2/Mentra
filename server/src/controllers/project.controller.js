import {
  createProjectService,
  getProjectsService,
  getProjectService,
  updateProjectService,
  deleteProjectService,
  searchProjectsService,
} from "../services/project.service.js";


// -----------------------------------------
// Create Project
// -----------------------------------------

export async function createProject(req, res) {
  try {
    const userId = req.user.id;

    const {
      title,
      description,
      githubUrl,
      liveUrl,
      status,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    const project =
      await createProjectService(
        userId,
        {
          title: title.trim(),
          description,
          githubUrl,
          liveUrl,
          status,
        }
      );

    res.status(201).json({
      success: true,
      project,
    });

  } catch (error) {
    console.error(
      "❌ Failed to create project:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// -----------------------------------------
// Get Projects
// -----------------------------------------

export async function getProjects(req, res) {
  try {
    const userId = req.user.id;

    const projects =
      await getProjectsService(userId);

    res.json({
      success: true,
      projects,
    });

  } catch (error) {
    console.error(
      "❌ Failed to get projects:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// -----------------------------------------
// Get Single Project
// -----------------------------------------

export async function getProject(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const project =
      await getProjectService(
        userId,
        id
      );

    res.json({
      success: true,
      project,
    });

  } catch (error) {
    console.error(
      "❌ Failed to get project:",
      error
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

// -----------------------------------------
// Search Projects
// -----------------------------------------

export async function searchProjects(req, res) {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q?.trim()) {
      return res.json({
        success: true,
        projects: [],
      });
    }

    const projects = await searchProjectsService(
      userId,
      q
    );

    res.json({
      success: true,
      projects,
    });

  } catch (error) {
    console.error(
      "❌ Failed to search projects:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


// -----------------------------------------
// Update Project
// -----------------------------------------

export async function updateProject(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      title,
      description,
      githubUrl,
      liveUrl,
      status,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    const project =
      await updateProjectService(
        userId,
        id,
        {
          title: title.trim(),
          description,
          githubUrl,
          liveUrl,
          status,
        }
      );

    res.json({
      success: true,
      project,
    });

  } catch (error) {
    console.error(
      "❌ Failed to update project:",
      error
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}


// -----------------------------------------
// Delete Project
// -----------------------------------------

export async function deleteProject(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const project =
      await deleteProjectService(
        userId,
        id
      );

    res.json({
      success: true,
      project,
    });

  } catch (error) {
    console.error(
      "❌ Failed to delete project:",
      error
    );

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}