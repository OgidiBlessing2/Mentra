import { getDashboardService } from "../services/dashboard.service.js";

export async function getDashboard(req, res) {
  try {
    console.log("📊 GET DASHBOARD START");
    console.log("📊 User ID:", req.user.id);

    const dashboard = await getDashboardService(req.user.id);

    console.log("📊 DASHBOARD SERVICE RESULT:", dashboard);

    res.json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.error("❌ GET DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}