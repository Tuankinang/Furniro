"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ChevronRight,
  ShoppingCart,
  Trash2,
  PackageOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import FeaturesBar from "@/components/ui/FeaturesBar";
import ProductSkeleton from "@/components/ui/ProductSkeleton";

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, isLoading, fetchWishlist, toggle } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId: string) => {
    await toggle(productId);
  };

  const handleAddToCart = async (
    productId: string,
    variantId: string,
    productName: string,
    stock: number,
  ) => {
    if (stock < 1) {
      toast.error("This product is temporarily out of stock!");
      return;
    }
    try {
      await addItem(productId, variantId, 1);
      openCart();
      toast.success(`${productName} has been added to your cart!`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Cannot add to cart!",
      );
    }
  };

  return (
    <main className="w-full">
      {/* HERO BANNER */}
      <section className="relative w-full h-[316px] flex items-center justify-center">
        <Image
          src="/images/shop-hero.png"
          alt="Wishlist Banner"
          fill
          className="object-cover -z-10 opacity-70"
          priority
        />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-medium text-black flex items-center gap-3">
            Wishlist
          </h1>
          <div className="flex items-center gap-2 text-base">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light">Wishlist</span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-16 min-h-[500px]">
        {isLoading ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
              <PackageOpen className="w-12 h-12 text-red-300" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 max-w-md">
                You have no products in your wishlist. Explore the store and
                save the products you love!
              </p>
            </div>
            <Link
              href="/shop"
              className="bg-[#B88E2F] text-white px-8 py-3 font-semibold hover:bg-[#a07828] transition-colors"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                {items.length} favourite product{items.length !== 1 ? "s" : ""}
              </h2>
              <Link
                href="/shop"
                className="text-[#B88E2F] hover:underline text-sm font-medium"
              >
                Continue Shopping →
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const product = item.product;
                const imageUrl =
                  product.images?.[0]?.url || "/images/placeholder.png";
                const defaultVariant = product.variants?.[0];
                const basePrice = defaultVariant?.price || 0;
                const discount = product.discountPercent || 0;
                const isSale = discount > 0;
                const currentPrice = isSale
                  ? basePrice - (basePrice * discount) / 100
                  : basePrice;

                return (
                  <div
                    key={item.id}
                    className="group bg-[#F4F5F7] overflow-hidden flex flex-col relative"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative aspect-square overflow-hidden block"
                    >
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {isSale && (
                        <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-[#E97171] flex items-center justify-center text-white text-sm font-medium z-10 shadow-sm">
                          -{discount}%
                        </div>
                      )}
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="absolute top-3 left-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group/btn"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover/btn:text-red-500 transition-colors" />
                    </button>

                    {/* Info */}
                    <div className="px-4 py-4 flex flex-col gap-2 flex-1">
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-lg font-semibold text-[#3A3A3A] leading-tight hover:text-[#B88E2F] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      {product.shortDescription && (
                        <p className="text-sm text-[#898989] line-clamp-1">
                          {product.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-semibold text-[#3A3A3A]">
                          {formatPrice(currentPrice)}
                        </span>
                        {isSale && (
                          <span className="text-sm text-[#B0B0B0] line-through">
                            {formatPrice(basePrice)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart */}
                      {defaultVariant ? (
                        <button
                          onClick={() =>
                            handleAddToCart(
                              product.id,
                              defaultVariant.id,
                              product.name,
                              defaultVariant.stock,
                            )
                          }
                          disabled={defaultVariant.stock < 1}
                          className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all ${
                            defaultVariant.stock < 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-[#B88E2F] text-white hover:bg-[#a07828]"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {defaultVariant.stock < 1
                            ? "Out of stock"
                            : "Add to Cart"}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="mt-2 w-full py-2.5 text-sm font-semibold bg-gray-200 text-gray-400 cursor-not-allowed"
                        >
                          No variants available
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      <FeaturesBar />
    </main>
  );
}
