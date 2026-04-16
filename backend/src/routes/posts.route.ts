import { Router } from "express";
import * as postsController from "../controllers/posts.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";
import { uploadBlogImage } from "../middlewares/upload.middleware";

const router = Router();

// ─── PUBLIC ───────────────────────────────────────────────
router.get("/", postsController.listPublishedPosts);
router.get("/categories", postsController.listCategories);
router.get("/recent", postsController.listRecentPosts);
router.get("/:slug", postsController.getPost);

// ─── ADMIN ────────────────────────────────────────────────
router.get("/admin/all", verifyToken, isAdmin, postsController.listAllPostsAdmin);
router.get("/admin/slug/:slug", verifyToken, isAdmin, postsController.getPostAdmin);
router.post("/admin", verifyToken, isAdmin, postsController.createPost);
router.patch("/admin/:id", verifyToken, isAdmin, postsController.updatePost);
router.delete("/admin/:id", verifyToken, isAdmin, postsController.deletePost);
router.post("/admin/upload-image", verifyToken, isAdmin, uploadBlogImage.single("image"), postsController.uploadImage);

export default router;
