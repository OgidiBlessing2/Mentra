import { getDashboardService } from "../services/dashboard.service.js";

export async function getDashboard(req, res) {
  try {
    const dashboard = await getDashboardService(req.user.id);

    res.json({
      success: true,
      dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}