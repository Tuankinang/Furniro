import {
  getWishlist,
  toggleWishlist,
  checkWishlisted,
  getWishlistProductIds,
} from "../services/wishlist.service";
import { catchAsync } from "../utils/catchAsync";

// GET /wishlist – Lấy danh sách sản phẩm yêu thích kèm đầy đủ thông tin
export const get = catchAsync(async (req, res) => {
  const items = await getWishlist(req.user.id);
  res.status(200).json({ success: true, data: items });
});

// GET /wishlist/ids – Lấy mảng productId (dùng để sync store nhanh)
export const getIds = catchAsync(async (req, res) => {
  const ids = await getWishlistProductIds(req.user.id);
  res.status(200).json({ success: true, data: ids });
});

// POST /wishlist/toggle – Toggle yêu thích / bỏ yêu thích
export const toggle = catchAsync(async (req, res) => {
  const { productId } = req.body;
  if (!productId) throw new Error("Thiếu productId!");

  const result = await toggleWishlist(req.user.id, productId);
  const message = result.wishlisted
    ? "Đã thêm vào danh sách yêu thích"
    : "Đã xóa khỏi danh sách yêu thích";

  res.status(200).json({ success: true, message, data: result });
});

// GET /wishlist/check/:productId – Kiểm tra 1 sản phẩm
export const check = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const wishlisted = await checkWishlisted(req.user.id, productId);
  res.status(200).json({ success: true, data: { wishlisted } });
});
