import { Router } from "express";
import productRoutes from "./product.route";
import authRoutes from "./auth.route";
import cartRoutes from "./cart.route";
import orderRoutes from "./order.route";
import userRoutes from "./user.route";
import dashboardRoutes from "./dashboard.route";
import wishlistRoutes from "./wishlist.route";
import postsRoutes from "./posts.route";

const router = Router();

router.use("/products", productRoutes);
router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/posts", postsRoutes);

export default router;

