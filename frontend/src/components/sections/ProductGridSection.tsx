"use client";

import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Product } from "@/types/product";

const ProductGridSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const { data: response } = await api.get("/products?limit=8");

        // Logic lấy mảng được rút gọn siêu ngắn và an toàn bằng Optional Chaining
        const rawData = response?.data;
        const productList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
            ? rawData.data
            : [];

        setProducts(productList);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm trang chủ:", error);
        setProducts([]); // Lỗi thì hiển thị mảng rỗng cho an toàn
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <section className="w-full bg-white py-[56px] md:py-[70px]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center gap-[52px]">
        {/* Header */}
        <SectionHeader title="Our Products" />

        {/* Product Grid — 4 cột desktop, 2 tablet, 1 mobile */}
        {isLoading ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Show More CTA */}
        <Link
          href="/shop"
          className="px-[72px] py-[15px] border border-[#B88E2F] text-[#B88E2F] font-semibold hover:bg-[#B88E2F] hover:text-white transition-all duration-200 active:scale-95"
        >
          Show More
        </Link>
      </div>
    </section>
  );
};

export default ProductGridSection;
