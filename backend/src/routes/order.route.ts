import express from "express";
import {
  checkout,
  getUserOrders,
  vnpayReturn,
  completeOrder,
  getAllOrders,
  updateStatus,
} from "../controllers/order.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = express.Router();

router.post("/checkout", verifyToken, checkout);
router.get("/my-orders", verifyToken, getUserOrders);
router.get("/vnpay-return", vnpayReturn);
router.patch("/:id/complete", verifyToken, completeOrder);
router.get("/admin", verifyToken, isAdmin, getAllOrders);
router.patch("/admin/:id/status", verifyToken, isAdmin, updateStatus);

export default router;
