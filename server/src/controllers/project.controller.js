import { generateProjectService } from "../services/project.service.js";

export async function generateProject(req, res) {
  try {
    const { module, level } = req.body;

    const project = await generateProjectService(module, level);

    res.json({
      success: true,
      project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}