"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Star, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Product } from "@/types/product";
import ProductDetailSkeleton from "@/components/ui/ProductDetailSkeleton";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProductDetailPage() {
  const router = useRouter();
  const slug = useParams().slug as string;

  // --- Global States ---
  const { user } = useAuthStore();
  const { addItem, openCart } = useCartStore();

  // --- Local States ---
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // UI States
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  // ======================================================
  // 1. DATA FETCHING
  // ======================================================
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        if (data?.success) {
          const prod = data.data;
          setProduct(prod);

          if (prod.images?.[0]) setActiveImage(prod.images[0].url);
          if (prod.variants?.[0]) {
            setSelectedSize(prod.variants[0].size);
            setSelectedColor(prod.variants[0].color);
          }
        }
      } catch (error) {
        console.error("Error loading product details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchProductDetail();
  }, [slug]);

  useEffect(() => {
    if (!product?.categoryId) return;

    const fetchRelatedProducts = async () => {
      try {
        const { data } = await api.get(
          `/products?categoryId=${product.categoryId}&limit=5`,
        );
        const productList = data?.data?.data || data?.data || [];

        // Lọc bỏ sản phẩm hiện tại và lấy 4 cái
        setRelatedProducts(
          productList.filter((p: any) => p.id !== product.id).slice(0, 4),
        );
      } catch (error) {
        console.error("Error loading related products:", error);
      }
    };
    fetchRelatedProducts();
  }, [product?.categoryId, product?.id]);

  // ======================================================
  // 2. TÍNH TOÁN BIẾN THỂ (VARIANTS & PRICE)
  // ======================================================

  // Lấy danh sách Size/Color không trùng lặp (Dùng ES6 Set cho gọn)
  const allSizes = useMemo(
    () =>
      product ? [...new Set(product.variants.map((v: any) => v.size))] : [],
    [product],
  );
  const allColors = useMemo(
    () =>
      product ? [...new Set(product.variants.map((v: any) => v.color))] : [],
    [product],
  );

  // Size khả dụng theo màu
  const availableSizesForColor = useMemo(() => {
    return product
      ? product.variants
          .filter((v: any) => v.color === selectedColor)
          .map((v: any) => v.size)
      : [];
  }, [product, selectedColor]);

  // Biến thể đang được chọn trên màn hình
  const currentDisplayVariant = useMemo(() => {
    return (
      product?.variants?.find(
        (v: any) => v.size === selectedSize && v.color === selectedColor,
      ) || null
    );
  }, [product, selectedSize, selectedColor]);

  // Tính toán thông tin hiển thị
  const basePrice =
    currentDisplayVariant?.price || product?.variants?.[0]?.price || 0;
  const discountPercent = product?.discountPercent || 0;
  const displayPrice =
    discountPercent > 0
      ? basePrice - (basePrice * discountPercent) / 100
      : basePrice;
  const displaySku =
    currentDisplayVariant?.sku || product?.variants?.[0]?.sku || "N/A";

  // ======================================================
  // 3. HANDLERS TƯƠNG TÁC
  // ======================================================
  const handleQuantity = (type: "increase" | "decrease") => {
    const currentQty = typeof quantity === "number" ? quantity : 1;
    const maxStock = currentDisplayVariant?.stock ?? 0;

    if (type === "decrease") {
      setQuantity(Math.max(1, currentQty - 1));
    } else {
      if (currentQty >= maxStock) {
        toast.error(`You can only purchase a maximum of ${maxStock} items!`);
        setQuantity(maxStock);
      } else {
        setQuantity(currentQty + 1);
      }
    }
  };

  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;

    if (val === "") {
      setQuantity("");
      return;
    }

    const num = parseInt(val, 10);
    const maxStock = currentDisplayVariant?.stock ?? 0;

    if (num > maxStock) {
      toast.error(`You can only purchase a maximum of ${maxStock} items!`);
      setQuantity(maxStock);
    } else {
      setQuantity(num);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === "" || Number(quantity) < 1 || isNaN(Number(quantity))) {
      setQuantity(1);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    // Tự động chọn size đầu tiên khả dụng nếu size hiện tại bị vô hiệu hóa
    const validSizes = product.variants
      .filter((v: any) => v.color === color)
      .map((v: any) => v.size);
    if (!validSizes.includes(selectedSize)) setSelectedSize(validSizes[0]);

    // Đổi ảnh theo màu
    const matchedVariant = product.variants.find((v: any) => v.color === color);
    if (
      matchedVariant &&
      product.images[product.variants.indexOf(matchedVariant)]
    ) {
      setActiveImage(
        product.images[product.variants.indexOf(matchedVariant)].url,
      );
    }
  };

  const handleAddToCart = async () => {
    if (!product || isAdding) return;

    if (!user) {
      toast.error("Please log in to add products to your cart!");
      router.push("/login");
      return;
    }

    if (!currentDisplayVariant) {
      toast.error("Please select an available Size and Color!");
      return;
    }

    if (currentDisplayVariant.stock < quantity) {
      toast.error(
        `Sorry, only ${currentDisplayVariant.stock} items left in stock!`,
      );
      return;
    }

    try {
      setIsAdding(true);
      await addItem(product.id, currentDisplayVariant.id, Number(quantity));
      openCart();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Could not add to cart!",
      );
    } finally {
      setIsAdding(false);
    }
  };

  // ======================================================
  // 4. RENDER UI
  // ======================================================
  if (isLoading) return <ProductDetailSkeleton />;
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-500">
        No product found.
      </div>
    );

  return (
    <main className="w-full bg-white pb-20">
      {/* 1. BREADCRUMB */}
      <section className="w-full bg-[#F9F1E7] h-[100px] flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] flex items-center gap-4 text-base">
          <Link
            href="/"
            className="text-[#9F9F9F] hover:text-black transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-black" />
          <Link
            href="/shop"
            className="text-[#9F9F9F] hover:text-black transition-colors"
          >
            Shop
          </Link>
          <ChevronRight className="w-4 h-4 text-black" />
          <div className="w-[2px] h-8 bg-[#9F9F9F] mx-2"></div>
          <span className="font-normal text-black truncate max-w-[200px] md:max-w-none">
            {product.name}
          </span>
        </div>
      </section>

      {/* 2. PRODUCT MAIN SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] pt-10 pb-[72px] flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Cột trái: Gallery Ảnh */}
        <div className="flex flex-col-reverse md:flex-row gap-8 lg:w-1/2">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
            {product.images?.map((img: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setActiveImage(img.url)}
                className={`w-[76px] h-[80px] rounded-[10px] overflow-hidden cursor-pointer border-2 transition-all shrink-0 bg-[#F9F1E7] ${
                  activeImage === img.url
                    ? "border-[#B88E2F]"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`Thumb ${idx}`}
                  width={76}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="relative w-full aspect-square md:w-[423px] md:h-[500px] bg-[#F9F1E7] rounded-[10px] overflow-hidden">
            <Image
              src={activeImage || "/images/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Cột phải: Thông tin sản phẩm */}
        <div className="flex flex-col lg:w-1/2">
          <h1 className="text-[42px] font-normal text-black leading-tight mb-2">
            {product.name}
          </h1>
          {currentDisplayVariant && (
            <div className="mb-4 text-[15px] font-medium">
              {currentDisplayVariant.stock > 0 ? (
                <span className="text-black">
                  In Stock: {currentDisplayVariant.stock}
                </span>
              ) : (
                <span className="text-red-500">
                  This product is currently out of stock
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-[24px] font-medium text-[#9F9F9F]">
              {formatPrice(displayPrice)}
            </p>
            {discountPercent > 0 && (
              <p className="text-lg text-[#B0B0B0] line-through">
                {formatPrice(basePrice)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex text-[#FFC700]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="w-[1px] h-6 bg-gray-300"></div>
            <span className="text-[#9F9F9F] text-[13px]">
              5 Customer Review
            </span>
          </div>

          <p className="text-[13px] text-black leading-relaxed mb-6 lg:w-[400px]">
            {product.shortDescription}
          </p>

          {/* Chọn Size */}
          <div className="mb-4">
            <p className="text-[#9F9F9F] text-sm mb-3">Size</p>
            <div className="flex flex-wrap gap-4">
              {(allSizes as string[]).map((size) => {
                const isAvailable = availableSizesForColor.includes(size);
                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-[5px] text-[13px] border transition-all ${
                      !isAvailable ? "opacity-20 cursor-not-allowed" : ""
                    } ${selectedSize === size ? "bg-[#B88E2F] text-white" : "bg-[#F9F1E7]"}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chọn Màu */}
          <div className="mb-8">
            <p className="text-[#9F9F9F] text-sm mb-3">Color</p>
            <div className="flex flex-wrap gap-4">
              {(allColors as string[]).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`px-4 py-2 rounded-[5px] text-[13px] border transition-all ${
                    selectedColor === color
                      ? "bg-black text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Cụm Action */}
          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-[#D9D9D9] flex-wrap">
            <div className="flex items-center justify-between w-[123px] h-[64px] rounded-[10px] border border-[#9F9F9F] px-4 shrink-0">
              <button
                disabled={
                  !currentDisplayVariant || currentDisplayVariant.stock === 0
                }
                onClick={() => handleQuantity("decrease")}
                className="hover:text-[#B88E2F] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityInputChange}
                onBlur={handleQuantityBlur}
                disabled={
                  !currentDisplayVariant || currentDisplayVariant.stock === 0
                }
                className="w-full text-center text-base font-medium bg-transparent border-none outline-none focus:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                disabled={
                  !currentDisplayVariant || currentDisplayVariant.stock === 0
                }
                onClick={() => handleQuantity("increase")}
                className="hover:text-[#B88E2F] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="h-[64px] px-8 md:px-10 rounded-[15px] border border-black text-black hover:bg-black hover:text-white transition-all text-lg md:text-xl shrink-0 disabled:opacity-50 disabled:cursor-wait"
            >
              {isAdding ? "Adding..." : "Add To Cart"}
            </button>

            <button className="h-[64px] px-8 md:px-10 rounded-[15px] border border-black text-black hover:bg-black hover:text-white transition-all text-lg md:text-xl flex items-center gap-2 shrink-0">
              <Plus className="w-5 h-5" /> Compare
            </button>
          </div>

          {/* Meta Info */}
          <div className="flex flex-col gap-3 text-[#9F9F9F] text-base">
            <div className="flex">
              <span className="w-24">SKU</span> <span>: {displaySku}</span>
            </div>
            <div className="flex">
              <span className="w-24">Category</span>{" "}
              <span>: {product.category?.name || "Uncategorized"}</span>
            </div>
            <div className="flex">
              <span className="w-24">Tags</span>{" "}
              <span>: Sofa, Chair, Home, Shop</span>
            </div>
            <div className="flex items-center">
              <span className="w-24">Share</span>
              <span className="flex items-center gap-4 text-black ml-1">
                :
                <Image
                  src="/images/facebook.png"
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="cursor-pointer hover:opacity-70"
                />
                <Image
                  src="/images/linkedin.png"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                  className="cursor-pointer hover:opacity-70"
                />
                <Image
                  src="/images/twitter.png"
                  alt="Twitter"
                  width={20}
                  height={20}
                  className="cursor-pointer hover:opacity-70"
                />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABS SECTION */}
      <section className="w-full border-t border-[#D9D9D9]">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px]">
          <div className="flex items-center justify-center gap-[52px] pt-[36px] pb-[36px] flex-wrap">
            {(["description", "additional", "reviews"] as const).map((tab) => {
              const labels: Record<string, string> = {
                description: "Description",
                additional: "Additional Information",
                reviews: "Reviews [5]",
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-2xl transition-colors font-normal leading-tight ${
                    activeTab === tab
                      ? "text-black font-medium"
                      : "text-[#9F9F9F] hover:text-black"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          <div className="w-full pb-[56px]">
            {activeTab === "description" && (
              <div>
                <p className="text-[#9F9F9F] text-base leading-[26px] text-justify mb-8">
                  {product.description ??
                    "No description available for this product."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#F9F1E7] rounded-[10px] w-full aspect-[1.4] relative overflow-hidden">
                    <Image
                      src={
                        product.images?.[0]?.url ?? "/images/placeholder.png"
                      }
                      fill
                      className="object-cover"
                      alt="Description 1"
                    />
                  </div>
                  <div className="bg-[#F9F1E7] rounded-[10px] w-full aspect-[1.4] relative overflow-hidden">
                    <Image
                      src={
                        product.images?.[1]?.url ??
                        product.images?.[0]?.url ??
                        "/images/placeholder.png"
                      }
                      fill
                      className="object-cover"
                      alt="Description 2"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "additional" && (
              <div>
                {product.specifications ? (
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <tr
                            key={key}
                            className="border-b border-[#D9D9D9] last:border-0"
                          >
                            <td className="py-4 font-medium text-black w-[200px] pr-8 align-top">
                              {key}
                            </td>
                            <td className="py-4 text-[#9F9F9F]">
                              {String(value)}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-[#9F9F9F] py-10">
                    No detailed specifications available.
                  </p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <p className="text-xl text-black font-medium mb-2">
                  No reviews yet
                </p>
                <p className="text-[#9F9F9F]">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="w-full border-t border-[#D9D9D9] pt-[56px] pb-[56px]">
          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] flex flex-col items-center">
            <h2 className="text-[36px] font-medium text-black mb-[32px] text-center">
              Related Products
            </h2>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-[36px]">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Link href="/shop">
              <button className="h-[48px] px-[72px] border border-[#B88E2F] text-[#B88E2F] bg-white text-base font-semibold hover:bg-[#B88E2F] hover:text-white transition-all">
                Show More
              </button>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
