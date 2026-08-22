import {
  getUserAchievements,
} from "../services/achievement.service.js";

export async function getAchievements(req, res) {
  try {
    const achievements =
      await getUserAchievements(req.user.id);

    res.json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error(
      "❌ Failed to get achievements:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}