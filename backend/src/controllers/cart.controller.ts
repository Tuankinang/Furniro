import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
} from "../services/cart.service";
import { catchAsync } from "../utils/catchAsync";

export const get = catchAsync(async (req, res) => {
  const cart = await getCart(req.user.id);
  res.status(200).json({ success: true, data: cart });
});

export const add = catchAsync(async (req, res) => {
  const { productId, variantId, quantity } = req.body;
  if (!productId || !variantId || !quantity)
    throw new Error("Thiếu thông tin bắt buộc!");

  await addToCart(req.user.id, productId, variantId, quantity);
  const updatedCart = await getCart(req.user.id);

  res
    .status(200)
    .json({ success: true, message: "Đã thêm vào giỏ", data: updatedCart });
});

export const update = catchAsync(async (req, res) => {
  const { cartItemId, quantity } = req.body;
  if (!cartItemId || quantity === undefined)
    throw new Error("Thiếu cartItemId hoặc quantity");

  await updateQuantity(req.user.id, cartItemId, quantity);
  const updatedCart = await getCart(req.user.id);

  res.status(200).json({ success: true, data: updatedCart });
});

export const remove = catchAsync(async (req, res) => {
  await removeItem(req.user.id, req.params.cartItemId);
  const updatedCart = await getCart(req.user.id);
  res.status(200).json({ success: true, data: updatedCart });
});
