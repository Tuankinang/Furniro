import { Router } from "express";
import {
  getOverviewStats,
  getAnalytics,
  getRecentActivity,
  getTopProducts,
} from "../controllers/dashboard.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

// Only admin can access dashboard stats
router.get("/stats", verifyToken, isAdmin, getOverviewStats);
router.get("/analytics", verifyToken, isAdmin, getAnalytics);
router.get("/recent-activity", verifyToken, isAdmin, getRecentActivity);
router.get("/top-products", verifyToken, isAdmin, getTopProducts);

export default router;
