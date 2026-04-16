import prisma from "../config/prisma";

// Lấy danh sách wishlist của user kèm thông tin sản phẩm đầy đủ
export const getWishlist = async (userId: string) => {
  return await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: true,
          variants: true,
          category: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Toggle: Nếu chưa có → thêm vào; Nếu đã có → xóa đi
export const toggleWishlist = async (userId: string, productId: string) => {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { wishlisted: false };
  } else {
    await prisma.wishlist.create({
      data: { userId, productId },
    });
    return { wishlisted: true };
  }
};

// Kiểm tra nhanh 1 sản phẩm có trong wishlist không
export const checkWishlisted = async (userId: string, productId: string) => {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  return !!existing;
};

// Lấy danh sách productId trong wishlist (cho frontend store)
export const getWishlistProductIds = async (userId: string) => {
  const items = await prisma.wishlist.findMany({
    where: { userId },
    select: { productId: true },
  });
  return items.map((item) => item.productId);
};
