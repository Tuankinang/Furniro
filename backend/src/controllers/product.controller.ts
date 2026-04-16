import * as productService from "../services/product.service";
import { catchAsync } from "../utils/catchAsync";

export const getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts(req.query as any);
  res.status(200).json({ success: true, data: products });
});

export const getProductBySlug = catchAsync(async (req, res) => {
  const result = await productService.getProductBySlug(req.params.slug);
  if (!result.success) return res.status(404).json(result);
  res.status(200).json(result);
});

export const getAllCategories = catchAsync(async (req, res) => {
  const categories = await productService.getAllCategories();
  res.status(200).json({ success: true, data: categories });
});

export const getAllProductsAdmin = catchAsync(async (req, res) => {
  const products = await productService.getAllProductsAdmin();
  res.status(200).json({ success: true, data: products });
});

export const createProduct = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const imageUrls = files ? files.map((f) => f.path) : [];
  const newProduct = await productService.createProduct(req.body, imageUrls);
  res
    .status(201)
    .json({ success: true, message: "Tạo thành công!", data: newProduct });
});

export const updateProduct = catchAsync(async (req, res) => {
  const updatedProduct = await productService.updateProduct(
    req.params.id,
    req.body,
  );
  res.status(200).json({
    success: true,
    message: "Cập nhật thành công",
    data: updatedProduct,
  });
});

export const addVariant = catchAsync(async (req, res) => {
  const newVariant = await productService.addVariantToProduct(
    req.params.id,
    req.body,
  );
  res.status(201).json({
    success: true,
    message: "Thêm biến thể thành công",
    data: newVariant,
  });
});

export const updateVariant = catchAsync(async (req, res) => {
  const updated = await productService.updateVariant(
    req.params.variantId,
    req.body,
  );
  res.status(200).json({ success: true, data: updated });
});

export const deleteVariant = catchAsync(async (req, res) => {
  await productService.deleteVariant(req.params.variantId);
  res.status(200).json({ success: true, message: "Đã xóa biến thể" });
});

export const addImages = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) throw new Error("Không có ảnh tải lên");
  const imageUrls = files.map((f) => f.path);
  const addedImages = await productService.addImagesToProduct(
    req.params.id,
    imageUrls,
  );
  res
    .status(201)
    .json({ success: true, message: "Thêm ảnh thành công", data: addedImages });
});

export const deleteImage = catchAsync(async (req, res) => {
  await productService.deleteImage(req.params.imageId);
  res.status(200).json({ success: true, message: "Xóa ảnh thành công" });
});

export const setDefaultImage = catchAsync(async (req, res) => {
  await productService.setDefaultImage(req.params.id, req.params.imageId);
  res.status(200).json({ success: true, message: "Đã đặt làm ảnh mặc định" });
});
