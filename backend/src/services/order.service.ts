import prisma from "../config/prisma";
import { OrderStatus } from "@prisma/client";
import moment from "moment";
import qs from "qs";
import crypto from "crypto";
import { sortObject } from "../utils/vnpay.util";

export const checkout = async (
  userId: string,
  billingAddress: any,
  paymentMethod: string,
  ipAddr: string,
) => {
  // Sử dụng Transaction: Đảm bảo toàn vẹn dữ liệu
  return await prisma.$transaction(async (tx) => {
    // 1. Lấy giỏ hàng và danh sách sản phẩm bên trong
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { variant: true, product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Giỏ hàng trống!");
    }

    let totalAmount = 0;

    // 2. Chốt chặn bảo mật: Kiểm tra tồn kho & Tính lại tổng tiền thực tế
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new Error(
          `Sản phẩm ${item.product.name} (Size: ${item.variant.size}, Màu: ${item.variant.color}) không đủ số lượng trong kho!`,
        );
      }
      const basePrice = item.variant.price;
      const discount = item.product.discountPercent || 0;
      const actualPrice =
        discount > 0 ? basePrice - (basePrice * discount) / 100 : basePrice;
      totalAmount += actualPrice * item.quantity;
      (item as any).computedPrice = actualPrice;
    }

    // 3. Tạo Đơn hàng (Order) và Chi tiết đơn hàng (OrderItem) cùng lúc
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        paymentMethod,
        billingAddress,
        status: "PENDING",
        isPaid: false,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: (item as any).computedPrice,
          })),
        },
      },
      include: { items: true },
    });

    // 4. XỬ LÝ RIÊNG CHO COD
    // Nhắc lại: COD KHÔNG trừ kho ở đây. Tồn kho Tạm thời chỉ trừ khi Admin Duyệt (PENDING -> PROCESSING).
    // Nhưng lúc Đặt hàng xong thì phải xóa Giỏ hàng!
    if (paymentMethod === "COD") {
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    // Với VNPAY: Không làm gì ở bước này. Nó sẽ được xử lý Xóa giỏ + Trừ kho khi VNPAY gọi API webhook (vnpayReturn) trả về thành công.

    // tích hợp vnpay
    let paymentUrl = "";

    if (paymentMethod === "VNPAY") {
      const tmnCode = process.env.VNP_TMNCODE!;
      const secretKey = process.env.VNP_HASHSECRET!;
      let vnpUrl = process.env.VNP_URL!;
      const returnUrl = process.env.VNP_RETURN_URL!;

      const createDate = moment(new Date()).format("YYYYMMDDHHmmss");
      const amount = order.totalAmount * 100; // VNPAY yêu cầu nhân 100
      const orderInfo = `Thanh toan don hang ${order.id}`;

      let vnp_Params: any = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = "vn";
      vnp_Params["vnp_CurrCode"] = "VND";
      vnp_Params["vnp_TxnRef"] = order.id;
      vnp_Params["vnp_OrderInfo"] = orderInfo;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;

      vnp_Params = sortObject(vnp_Params);
      const signData = qs.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac("sha512", secretKey);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;

      vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });
      paymentUrl = vnpUrl;
    }

    return { order, paymentUrl };
  });
};

// Lịch sử mua hàng: Trả về thông tin danh sách đơn hàng
export const getUserOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              variants: { select: { color: true, size: true } }, // Thêm để tìm index ảnh
            },
          },
          variant: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return orders;
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Cập nhật trạng thái đơn hàng và xử lý Kho
export const updateStatus = async (orderId: string, status: string) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Không tìm thấy đơn hàng");

    const oldStatus = order.status;
    const newStatus = status as OrderStatus;

    if (oldStatus === newStatus) return order;

    // CHẶN: Không cho phép chuyển trạng thái nếu đơn đã HỦY
    if (oldStatus === "CANCELLED") {
      throw new Error("Đơn hàng đã bị hủy, không thể thay đổi trạng thái!");
    }

    // CHẶN: Admin không được phép set trạng thái COMPLETED (chỉ khách hàng mới được)
    if (newStatus === "COMPLETED") {
      throw new Error(
        "Chỉ khách hàng mới có thể xác nhận hoàn thành đơn hàng!",
      );
    }

    const allowedTransitions: Record<string, string[]> = {
      PENDING: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["PROCESSING", "SHIPPED", "DELIVERED"],
      SHIPPED: ["PROCESSING", "SHIPPED", "DELIVERED"],
      DELIVERED: ["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"],
    };

    const allowed = allowedTransitions[oldStatus] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Không thể chuyển từ trạng thái "${oldStatus}" sang "${newStatus}"!`,
      );
    }

    // KỊCH BẢN 1: DUYỆT ĐƠN COD (PENDING -> PROCESSING)
    // Lúc này ta mới trừ kho!
    if (
      order.paymentMethod === "COD" &&
      oldStatus === "PENDING" &&
      newStatus === "PROCESSING"
    ) {
      for (const item of order.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });
        if (!variant || variant.stock < item.quantity) {
          throw new Error(
            `Kho không đủ hàng để duyệt đối với sản phẩm (Variant ID: ${item.variantId})`,
          );
        }

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    // KỊCH BẢN 2: HỦY ĐƠN HÀNG (Bất kỳ -> CANCELLED)
    if (newStatus === "CANCELLED" && (oldStatus as string) !== "CANCELLED") {
      // Hoàn lại kho nếu đơn đã được trừ kho trước đó
      let hadStockDeducted = false;

      if (order.paymentMethod === "COD" && oldStatus !== "PENDING") {
        hadStockDeducted = true;
      } else if (order.paymentMethod === "VNPAY" && order.isPaid) {
        hadStockDeducted = true;
      }

      if (hadStockDeducted) {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
    }

    return await tx.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  });
};

// Người dùng xác nhận đã nhận hàng
export const completeOrder = async (orderId: string, userId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Không tìm thấy đơn hàng");
  if (order.userId !== userId)
    throw new Error("Bạn không có quyền cập nhật đơn hàng này");
  if (order.status !== "DELIVERED")
    throw new Error(
      "Chỉ có thể hoàn thành đơn hàng khi đang ở trạng thái Đã giao",
    );

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED" },
  });
};

export const vnpayReturn = async (query: any) => {
  let vnp_Params = { ...query };
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  const secretKey = process.env.VNP_HASHSECRET!;

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    const orderId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Không tìm thấy đơn hàng");

    if (responseCode === "00") {
      // 00 là mã Thành công của VNPAY
      if (!order.isPaid) {
        await prisma.$transaction(async (tx) => {
          // Cập nhật đơn hàng thành Đã thanh toán
          await tx.order.update({
            where: { id: orderId },
            data: { isPaid: true, status: "PROCESSING" },
          });

          // TRỪ KHO BÂY GIỜ MỚI DIỄN RA
          for (const item of order.items) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          }

          // XÓA GIỎ HÀNG BÂY GIỜ MỚI DIỄN RA
          const cart = await tx.cart.findUnique({
            where: { userId: order.userId },
          });
          if (cart) {
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
          }
        });
      }
      return { success: true, message: "Thanh toán thành công" };
    } else {
      if (order.status === "PENDING") {
        await prisma.$transaction(async (tx) => {
          await tx.orderItem.deleteMany({
            where: { orderId: orderId },
          });

          await tx.order.delete({
            where: { id: orderId },
          });
        });
      }
      return { success: false, message: "Giao dịch bị hủy hoặc thất bại" };
    }
  } else {
    throw new Error("Chữ ký bảo mật không hợp lệ!");
  }
};
