import * as orderService from "../services/order.service";
import { catchAsync } from "../utils/catchAsync";

export const checkout = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { billingAddress, paymentMethod } = req.body;

  if (!billingAddress || !paymentMethod)
    throw new Error("Thiếu thông tin thanh toán!");

  const ipAddr =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const result = await orderService.checkout(
    userId,
    billingAddress,
    paymentMethod,
    ipAddr as string,
  );

  res.status(200).json({
    success: true,
    message: "Đặt hàng thành công!",
    data: result.order,
    paymentUrl: result.paymentUrl,
  });
});

export const getUserOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.status(200).json({ success: true, data: orders });
});

export const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(200).json({ success: true, data: orders });
});

export const updateStatus = catchAsync(async (req, res) => {
  const updatedOrder = await orderService.updateStatus(
    req.params.id,
    req.body.status,
  );
  res.status(200).json({ success: true, data: updatedOrder });
});

export const completeOrder = catchAsync(async (req, res) => {
  const updatedOrder = await orderService.completeOrder(
    req.params.id,
    req.user.id,
  );
  res.status(200).json({
    success: true,
    message: "Đã xác nhận nhận hàng",
    data: updatedOrder,
  });
});

export const vnpayReturn = catchAsync(async (req, res) => {
  const result = await orderService.vnpayReturn(req.query);
  res.status(200).json(result);
});
