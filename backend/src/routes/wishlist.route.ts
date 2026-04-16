import express from "express";
import { get, getIds, toggle, check } from "../controllers/wishlist.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

// Tất cả wishlist routes đều yêu cầu đăng nhập
router.get("/", verifyToken, get);
router.get("/ids", verifyToken, getIds);
router.post("/toggle", verifyToken, toggle);
router.get("/check/:productId", verifyToken, check);

export default router;
