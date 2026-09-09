import { Router } from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", protect,  getDashboard);

export default router;