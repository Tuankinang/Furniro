"use client";

import Image from "next/image";
import { Heart, Search, Share2, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative bg-[#F4F5F7] overflow-hidden flex flex-col cursor-pointer">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Badge */}
        {product.badge && (
          <div
            className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 ${
              product.badge === "New" ? "bg-[#2EC1AC]" : "bg-[#E97171]"
            }`}
          >
            {product.badge === "Sale" && product.discount
              ? `-${product.discount}%`
              : "New"}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#3A3A3A]/70 flex flex-col items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          {/* Add to cart button */}
          <button
            className="bg-white text-[#B88E2F] font-semibold text-sm px-10 py-3 hover:bg-[#B88E2F] hover:text-white transition-all duration-200"
            aria-label="Add to cart"
          >
            Add to cart
          </button>

          {/* Icon actions */}
          <div className="flex items-center gap-4 text-white">
            <button className="flex items-center gap-1 text-xs font-semibold hover:text-[#B88E2F] transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-1 text-xs font-semibold hover:text-[#B88E2F] transition-colors" aria-label="Compare">
              <Search className="w-4 h-4" />
              Compare
            </button>
            <button className="flex items-center gap-1 text-xs font-semibold hover:text-[#B88E2F] transition-colors" aria-label="Like">
              <Heart className="w-4 h-4" />
              Like
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#F4F5F7] px-4 py-[18px] flex flex-col gap-1">
        <h3 className="text-[24px] font-semibold text-[#3A3A3A] leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-[#898989]">{product.category}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xl font-semibold text-[#3A3A3A]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#B0B0B0] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
