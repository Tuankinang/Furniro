"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Search, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { user } = useAuthStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // 1. Lấy dữ liệu an toàn từ cấu trúc của Prisma
  const imageUrl = product.images?.[0]?.url || "/images/placeholder.png";
  const defaultVariant = product.variants?.[0];
  const basePrice = defaultVariant?.price || 0;
  const discount = product.discountPercent || 0;

  // 2. Tính toán giá hiện tại (nếu có giảm giá)
  const isSale = discount > 0;
  const currentPrice = isSale
    ? basePrice - (basePrice * discount) / 100
    : basePrice;

  // Xác định sản phẩm mới (trong vòng 30 ngày)
  const isNew = new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;

  // Kiểm tra trạng thái yêu thích
  const wishlisted = isWishlisted(product.id);

  // 3. Hàm chuyển trang khi click vào thẻ sản phẩm
  const handleCardClick = () => {
    if (product?.slug) {
      router.push(`/product/${product.slug}`);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to add products to your cart");
      router.push("/login");
      return;
    }

    if (!defaultVariant?.id) {
      toast.error("This product has no variants");
      return;
    }

    if ((defaultVariant?.stock ?? 0) < 1) {
      toast.error("This product is temporarily out of stock!");
      return;
    }
    
    try {
      setIsAdding(true);
      await addItem(product.id, defaultVariant.id, 1);
      openCart();
      toast.success(`Added 1 ${product.name} to your cart`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cannot add to cart!");
    } finally {
      setIsAdding(false);
    }
  };

  // Xử lý toggle wishlist
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to save your wishlist");
      router.push("/login");
      return;
    }

    try {
      setIsTogglingWishlist(true);
      await toggle(product.id);
    } catch {
      // Lỗi đã được xử lý trong store (rollback optimistic)
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  // 4. Hàm ngăn chặn click bị lan (khi bấm Add to cart thì không bị nhảy trang)
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };

  return (
    <div onClick={handleCardClick} className="group relative bg-[#F4F5F7] overflow-hidden flex flex-col cursor-pointer">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name || "Product Image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Badge */}
        {(isSale || isNew) && (
          <div
            className={`absolute top-5 right-5 w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-medium z-10 shadow-sm ${
              isSale ? "bg-[#E97171]" : "bg-[#2EC1AC]"
            }`}
          >
            {isSale ? `-${discount}%` : "New"}
          </div>
        )}

        {/* Wishlist button floating – hiển thị khi đã yêu thích */}
        {wishlisted && (
          <button
            onClick={handleToggleWishlist}
            className="absolute top-3 left-3 z-30 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
            aria-label="Remove from wishlist"
          >
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          </button>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#3A3A3A]/70 flex flex-col items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`bg-white text-[#B88E2F] font-semibold text-sm px-10 py-3 hover:bg-[#B88E2F] hover:text-white transition-all duration-200 ${
              isAdding ? "opacity-50 cursor-wait" : ""
            }`}
            aria-label="Add to cart"
          >
            {isAdding ? "Adding..." : "Add to cart"}
          </button>

          {/* Icon actions */}
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={handleActionClick}
              className="flex items-center gap-1 text-xs font-semibold hover:text-[#B88E2F] transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleActionClick}
              className="flex items-center gap-1 text-xs font-semibold hover:text-[#B88E2F] transition-colors"
              aria-label="Compare"
            >
              <Search className="w-4 h-4" />
              Compare
            </button>
            <button
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
              className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                wishlisted
                  ? "text-red-400 hover:text-red-300"
                  : "hover:text-[#B88E2F]"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  wishlisted ? "fill-red-400" : ""
                }`}
              />
              {wishlisted ? "Liked" : "Like"}
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#F4F5F7] px-4 py-[18px] pb-6 flex flex-col gap-1">
        <h3 className="text-[24px] font-semibold text-[#3A3A3A] leading-tight truncate">
          {product.name}
        </h3>
        <p className="text-sm text-[#898989] truncate">
          {product.shortDescription}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xl font-semibold text-[#3A3A3A]">
            {formatPrice(currentPrice)}
          </span>
          {isSale && (
            <span className="text-base text-[#B0B0B0] line-through">
              {formatPrice(basePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
