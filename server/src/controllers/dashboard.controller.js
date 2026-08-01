import { getDashboardService } from "../services/dashboard.service.js";

export async function getDashboard(req, res) {
  try {
    // Later this will come from Clerk authentication
    const userId = '9d7d8c9b-5e0e-4f58-a0b4-8f5d3c7b8d12';

    const dashboard = await getDashboardService(userId);

    return res.json({
      success: true,
      dashboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}