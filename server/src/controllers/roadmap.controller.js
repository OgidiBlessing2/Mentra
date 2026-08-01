import {
  generateRoadmapService,
  getRoadmapService,
} from "../services/roadmap.service.js";

export async function generateRoadmap(req, res) {
  try {
    const userId = null; // Temporary until Clerk

    const roadmap = await generateRoadmapService(userId, req.body);

    return res.status(201).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getRoadmap(req, res) {
  try {
    const { id } = req.params;

    const roadmap = await getRoadmapService(id);

    return res.json({
      success: true,
      roadmap,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}