import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";
import { uploadProductImage } from "../middlewares/upload.middleware";

const router = Router();

// 1. PUBLIC ROUTES (Dành cho Khách hàng)
router.get("/", productController.getAllProducts);
router.get("/categories", productController.getAllCategories);

// 2. ADMIN ROUTES (Yêu cầu xác thực & quyền)
router.get(
  "/admin/all",
  verifyToken,
  isAdmin,
  productController.getAllProductsAdmin,
);
router.post(
  "/admin/create",
  verifyToken,
  isAdmin,
  uploadProductImage.array("images", 5),
  productController.createProduct,
);
router.post(
  "/admin/:id/variant",
  verifyToken,
  isAdmin,
  productController.addVariant,
);
router.patch(
  "/admin/:id",
  verifyToken,
  isAdmin,
  productController.updateProduct,
);
router.patch(
  "/admin/variant/:variantId",
  verifyToken,
  isAdmin,
  productController.updateVariant,
);
router.delete(
  "/admin/variant/:variantId",
  verifyToken,
  isAdmin,
  productController.deleteVariant,
);

// Quản lý ảnh sản phẩm (Edit page)
router.post(
  "/admin/:id/images",
  verifyToken,
  isAdmin,
  uploadProductImage.array("images", 5),
  productController.addImages,
);
router.delete(
  "/admin/images/:imageId",
  verifyToken,
  isAdmin,
  productController.deleteImage,
);
router.patch(
  "/admin/:id/images/:imageId/default",
  verifyToken,
  isAdmin,
  productController.setDefaultImage,
);

// 3. CATCH-ALL ROUTE (Bắt buộc để dưới cùng)
router.get("/:slug", productController.getProductBySlug);

export default router;
