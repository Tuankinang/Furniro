"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronRight,
  Search,
} from "lucide-react";
import api from "@/lib/axios";
import ProductCard from "@/components/ui/ProductCard";
import ProductSkeleton from "@/components/ui/ProductSkeleton";
import { Product } from "@/types/product";
import FeaturesBar from "@/components/ui/FeaturesBar";

function ShopContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Quản lý State cho Bộ Lọc và Sắp xếp
  const LIMIT = 16;
  const [sortOption, setSortOption] = useState("default"); // default, price-asc, price-desc

  // 2. Quản lý State cho Tìm kiếm (Search) & Category
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [searchQuery, setSearchQuery] = useState(urlSearch); // Từ khóa thực sự gửi lên API
  const [categoryQuery, setCategoryQuery] = useState(urlCategory); 

  // Cập nhật state khi urlSearch hoặc urlCategory thay đổi (ví dụ: người dùng nhấn vào logo hoặc category từ Navbar lần nữa)
  useEffect(() => {
    setSearchInput(urlSearch);
    setSearchQuery(urlSearch);
    setCategoryQuery(urlCategory);
  }, [urlSearch, urlCategory]);

  // Kỹ thuật Debounce: Chờ người dùng gõ xong 0.5s mới cập nhật searchQuery để gọi API
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 3. Quản lý Phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    totalItems: 0,
    totalPages: 1,
  });

  // 4. Hàm Gọi API tự động bám theo State
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let query = `/products?page=${pagination.page}&limit=${LIMIT}`;

        if (sortOption === "price-asc") query += `&sortBy=price&sortOrder=asc`;
        if (sortOption === "price-desc") query += `&sortBy=price&sortOrder=desc`;
        if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;
        if (categoryQuery) query += `&categorySlug=${encodeURIComponent(categoryQuery)}`;

        const { data: response } = await api.get(query);

        const rawData = response?.data;
        const productList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.data)
            ? rawData.data
            : [];

        setProducts(productList);

        const paginationData = response?.pagination || response?.data?.pagination;

        if (paginationData) {
          setPagination((prev) => ({
            ...prev,
            page: paginationData.currentPage || prev.page,
            totalItems: paginationData.totalItems || 0,
            totalPages: paginationData.totalPages || 1,
          }));
        }
      } catch (error) {
        console.error("Error loading Shop page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.page, sortOption, searchQuery]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <main className="w-full">
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[316px] flex items-center justify-center">
        <Image
          src="/images/shop-hero.png"
          alt="Shop Banner"
          fill
          className="object-cover -z-10 opacity-70"
          priority
        />
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-medium text-black">Shop</h1>
          <div className="flex items-center gap-2 text-base">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light">Shop</span>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SORT BAR */}
      <section className="w-full bg-[#F9F1E7] py-6">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <button className="flex items-center gap-2 hover:text-[#B88E2F] transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="text-xl">Filter</span>
            </button>
            <button className="hover:text-[#B88E2F]">
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button className="hover:text-[#B88E2F]">
              <List className="w-5 h-5" />
            </button>
            <div className="hidden md:block w-[2px] h-9 bg-gray-400 mx-4"></div>

            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white rounded-md outline-none focus:ring-1 focus:ring-[#B88E2F] text-sm w-[200px]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            </div>

            <p className="text-sm md:text-base text-black mt-2 md:mt-0">
              Showing{" "}
              {products.length > 0 ? (pagination.page - 1) * LIMIT + 1 : 0}–
              {Math.min(pagination.page * LIMIT, pagination.totalItems)} of{" "}
              {pagination.totalItems} results
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <span className="text-lg md:text-xl">Show</span>
              <input
                type="number"
                value={LIMIT}
                readOnly
                className="w-12 md:w-14 h-12 md:h-14 text-center bg-white text-[#9F9F9F] text-lg md:text-xl outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg md:text-xl whitespace-nowrap">Sort by</span>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="h-12 md:h-14 bg-white text-[#9F9F9F] px-2 md:px-4 text-sm md:text-xl outline-none cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-16 min-h-[500px]">
        {isLoading ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: LIMIT }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="w-full text-center py-20 text-xl text-gray-500">
            No matching products found.
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 4. PAGINATION */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-[10px] mt-16 flex-wrap">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPagination((prev) => ({ ...prev, page: i + 1 }))}
                className={`w-[50px] md:w-[60px] h-[50px] md:h-[60px] rounded-[10px] text-lg md:text-xl transition-all ${
                  pagination.page === i + 1
                    ? "bg-[#B88E2F] text-white"
                    : "bg-[#F9F1E7] text-black hover:bg-[#B88E2F]/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(prev.page + 1, prev.totalPages),
                }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="px-6 h-[50px] md:h-[60px] bg-[#F9F1E7] text-black rounded-[10px] text-lg md:text-xl hover:bg-[#B88E2F]/20 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      <FeaturesBar />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="w-full max-w-[1440px] px-4 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
