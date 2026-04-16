import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

// Lấy danh sách khách hàng (chỉ admin có quyền)
router.get("/admin/all", verifyToken, isAdmin, userController.getAllUsers);

// Xóa khách hàng
router.delete("/admin/:id", verifyToken, isAdmin, userController.deleteUser);

export default router;
