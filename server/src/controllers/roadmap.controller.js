import {
  generateRoadmapService,
  getRoadmapService,
  searchRoadmapsService,
} from "../services/roadmap.service.js";
export async function generateRoadmap(req, res) {
  try {
    const userId = req.user.id;

    const roadmap = await generateRoadmapService(
      userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error(error);

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


export async function searchRoadmaps(req, res) {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    if (!q?.trim()) {
      return res.json({
        success: true,
        roadmaps: [],
      });
    }

    const roadmaps = await searchRoadmapsService(
      userId,
      q
    );

    return res.json({
      success: true,
      roadmaps,
    });
  } catch (error) {
    console.error(
      "❌ Failed to search roadmaps:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}