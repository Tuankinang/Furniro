import prisma from "../config/prisma";

// Lấy (hoặc tạo) giỏ hàng của User, kèm đủ thông tin để render
export const getCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: true, variants: { select: { color: true } } },
          },
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                variants: { select: { color: true } },
              },
            },
            variant: true,
          },
        },
      },
    });
  }

  return cart;
};

// Thêm sản phẩm vào giỏ (upsert: chưa có → tạo, đã có → cộng dồn)
export const addToCart = async (
  userId: string,
  productId: string,
  variantId: string,
  quantity: number,
) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });
  if (!variant) throw new Error("Biến thể không tồn tại");

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });

  const currentQty = existingItem ? existingItem.quantity : 0;
  if (currentQty + quantity > variant.stock) {
    throw new Error(`Kho chỉ còn ${variant.stock} sản phẩm này!`);
  }

  return await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    update: { quantity: { increment: quantity } },
    create: { cartId: cart.id, productId, variantId, quantity },
  });
};

// Cập nhật số lượng (gõ trực tiếp vào input ở cart page)
export const updateQuantity = async (
  userId: string,
  cartItemId: string,
  quantity: number,
) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Giỏ hàng không tồn tại");

  const cartItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cartId: cart.id },
    include: { variant: true },
  });
  if (!cartItem) throw new Error("Sản phẩm không có trong giỏ hàng");

  const requestedQty = Math.max(1, quantity);
  if (requestedQty > cartItem.variant.stock) {
    throw new Error(`Kho chỉ còn ${cartItem.variant.stock} sản phẩm này!`);
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: requestedQty },
  });
};

// Xóa một món khỏi giỏ
export const removeItem = async (userId: string, cartItemId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new Error("Cart not found");

  return await prisma.cartItem.deleteMany({
    where: { id: cartItemId, cartId: cart.id },
  });
};
