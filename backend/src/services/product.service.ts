import prisma from "../config/prisma";

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};

interface ProductFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getAllProducts = async (query: ProductFilterQuery) => {
  // 1. Cấu hình phân trang
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 16;
  const skip = (page - 1) * limit;

  // 2. Xây dựng "Mẻ lưới" (Điều kiện Lọc)
  const whereCondition: any = {};

  if (query.search) {
    whereCondition.name = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  if (query.categoryId) {
    whereCondition.categoryId = query.categoryId;
  }

  if (query.categorySlug) {
    whereCondition.category = {
      slug: query.categorySlug,
    };
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    whereCondition.variants = { some: { price: {} } };
    if (query.minPrice !== undefined)
      whereCondition.variants.some.price.gte = Number(query.minPrice);
    if (query.maxPrice !== undefined)
      whereCondition.variants.some.price.lte = Number(query.maxPrice);
  }

  // 3. Lấy TOÀN BỘ sản phẩm khớp với bộ lọc (Bỏ skip, take, orderBy của Prisma đi)
  const allProducts = await prisma.product.findMany({
    where: whereCondition,
    include: {
      category: { select: { name: true, slug: true } },
      images: true, // Trả về tất cả ảnh để frontend chọn ảnh theo màu variant
      variants: {
        select: {
          id: true,
          price: true,
          stock: true,
          size: true,
          color: true,
          sku: true,
        },
      },
    },
  });

  // 4. Tính toán "Giá thực tế trên UI" cho từng sản phẩm
  const productsWithRealPrice = allProducts.map((product) => {
    const basePrice = product.variants?.[0]?.price || 0;
    const discount = product.discountPercent || 0;

    const currentPrice =
      discount > 0 ? basePrice - (basePrice * discount) / 100 : basePrice;

    return {
      ...product,
      currentPrice,
    };
  });

  // 5. THỰC HIỆN SẮP XẾP TOÀN CỤC (Global Sorting)
  if (query.sortBy === "price") {
    productsWithRealPrice.sort((a, b) => {
      if (query.sortOrder === "asc") {
        return a.currentPrice - b.currentPrice;
      } else {
        return b.currentPrice - a.currentPrice;
      }
    });
  } else {
    // Mặc định: Sản phẩm mới nhất xếp lên đầu
    productsWithRealPrice.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // 6. Cắt mảng để Phân trang (Pagination)
  const totalItems = productsWithRealPrice.length;
  // Ví dụ: Trang 1 (0 -> 16), Trang 2 (16 -> 32)
  const paginatedProducts = productsWithRealPrice.slice(skip, skip + limit);
  const totalPages = Math.ceil(totalItems / limit);

  // 7. Trả kết quả
  return {
    success: true,
    data: paginatedProducts,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
    },
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
    include: {
      category: {
        select: { name: true, slug: true },
      },
      images: true,
      variants: true,
    },
  });

  if (!product) {
    return {
      success: false,
      message: "Không tìm thấy sản phẩm",
    };
  }

  // Tính toán lại giá hiện tại (currentPrice) cho sản phẩm này
  const basePrice = product.variants?.[0]?.price || 0;
  const discount = product.discountPercent || 0;
  const currentPrice =
    discount > 0 ? basePrice - (basePrice * discount) / 100 : basePrice;

  return {
    success: true,
    data: {
      ...product,
      currentPrice,
    },
  };
};

// API DÀNH CHO ADMIN
export const getAllProductsAdmin = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true, slug: true } },
      images: true,
      variants: {
        include: {
          orderItems: { select: { quantity: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Map lại dữ liệu để tính toán số lượng đã bán
  return products.map((product) => {
    let totalProductSold = 0;

    const variantsWithStats = product.variants.map((variant) => {
      const variantSold = variant.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      totalProductSold += variantSold;

      // Trả về biến thể kèm theo con số đã bán, loại bỏ cục orderItems cồng kềnh
      const { orderItems, ...variantData } = variant;
      return {
        ...variantData,
        soldCount: variantSold,
      };
    });

    return {
      ...product,
      variants: variantsWithStats,
      totalSold: totalProductSold,
    };
  });
};

export const createProduct = async (productData: any, imageUrls: string[]) => {
  const {
    name,
    slug,
    shortDescription,
    description,
    categoryId,
    discountPercent,
    specifications,
    variants,
  } = productData;

  let parsedVariants: any[] = [];
  if (variants) {
    parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;
  }

  let parsedSpecs: any = null;
  if (specifications) {
    parsedSpecs =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications;
  }
  return await prisma.$transaction(async (tx) => {
    // 1. Tạo Product gốc
    const newProduct = await tx.product.create({
      data: {
        name,
        slug,
        shortDescription,
        description,
        categoryId,
        discountPercent: Number(discountPercent) || 0,
        specifications: parsedSpecs,
      },
    });
    // 2. Tạo Variants (Biến thể)
    if (parsedVariants.length > 0) {
      await tx.productVariant.createMany({
        data: parsedVariants.map((v: any) => ({
          productId: newProduct.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          price: Number(v.price),
          stock: Number(v.stock),
        })),
      });
    }
    // 3. Tạo Images (Lấy URL từ mảng Cloudinary truyền vào)
    if (imageUrls && imageUrls.length > 0) {
      await tx.productImage.createMany({
        data: imageUrls.map((url, index) => ({
          productId: newProduct.id,
          url: url,
          isDefault: index === 0,
        })),
      });
    }
    return newProduct;
  });
};

export const updateProduct = async (productId: string, data: any) => {
  let parsedSpecs = data.specifications;
  if (typeof parsedSpecs === "string") parsedSpecs = JSON.parse(parsedSpecs);

  return await prisma.product.update({
    where: { id: productId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.shortDescription !== undefined && {
        shortDescription: data.shortDescription,
      }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.discountPercent !== undefined && {
        discountPercent: Number(data.discountPercent),
      }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(parsedSpecs && { specifications: parsedSpecs }),
    },
  });
};

export const updateVariant = async (
  variantId: string,
  data: { price?: number; stock?: number; size?: string; color?: string },
) => {
  return await prisma.productVariant.update({
    where: { id: variantId },
    data: {
      ...(data.price !== undefined && { price: Number(data.price) }),
      ...(data.stock !== undefined && { stock: Number(data.stock) }),
      ...(data.size !== undefined && { size: data.size }),
      ...(data.color !== undefined && { color: data.color }),
    },
  });
};

export const addVariantToProduct = async (productId: string, data: any) => {
  return await prisma.productVariant.create({
    data: {
      productId,
      sku: data.sku,
      size: data.size,
      color: data.color,
      price: Number(data.price),
      stock: Number(data.stock),
    },
  });
};

export const deleteVariant = async (variantId: string) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { productId: true },
  });

  if (!variant) throw new Error("Không tìm thấy biến thể");

  return await prisma.$transaction(async (tx) => {
    try {
      // 1. Xóa biến thể
      await tx.productVariant.delete({ where: { id: variantId } });

      // 2. Kiểm tra xem còn biến thể nào khác của sản phẩm này không
      const remainingVariants = await tx.productVariant.count({
        where: { productId: variant.productId },
      });

      // 3. Nếu không còn biến thể nào, xóa luôn sản phẩm gốc
      if (remainingVariants === 0) {
        try {
          await tx.product.delete({ where: { id: variant.productId } });
        } catch (error: any) {
          console.warn(
            "Không thể xóa sản phẩm gốc sau khi hết biến thể:",
            error.message,
          );
        }
      }

      return { success: true };
    } catch (error: any) {
      if (error.code === "P2003") {
        throw new Error(
          "Không thể xóa biến thể này vì đã có đơn hàng hoặc giỏ hàng liên quan!",
        );
      }
      throw error;
    }
  });
};

export const addImagesToProduct = async (
  productId: string,
  imageUrls: string[],
) => {
  const images = await Promise.all(
    imageUrls.map((url) =>
      prisma.productImage.create({
        data: {
          productId,
          url,
          isDefault: false,
        },
      }),
    ),
  );
  return images;
};

export const deleteImage = async (imageId: string) => {
  return await prisma.productImage.delete({
    where: { id: imageId },
  });
};

export const setDefaultImage = async (productId: string, imageId: string) => {
  return await prisma.$transaction(async (tx) => {
    // Xóa default hiện tại
    await tx.productImage.updateMany({
      where: { productId, isDefault: true },
      data: { isDefault: false },
    });
    // Set default mới
    return await tx.productImage.update({
      where: { id: imageId },
      data: { isDefault: true },
    });
  });
};
