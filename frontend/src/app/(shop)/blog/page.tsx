"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, User, Calendar, Tag } from "lucide-react";
import api from "@/lib/axios";
import FeaturesBar from "@/components/ui/FeaturesBar";

// Fallback images for posts without a cover
const FALLBACK_IMAGES = [
  "/images/blog-post-1.png",
  "/images/blog-post-2.png",
  "/images/blog-post-3.png",
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async (page = 1, category = "") => {
    setIsLoading(true);
    try {
      let url = `/posts?page=${page}&limit=3`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setPosts(res.data.posts || []);
        setPagination(res.data.pagination || { currentPage: 1, totalPages: 1 });
      }
    } catch (err) {
      console.error("Error loading blog posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchSidebar = async () => {
      try {
        const [catRes, recentRes] = await Promise.all([
          api.get("/posts/categories"),
          api.get("/posts/recent"),
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (recentRes.data.success) setRecentPosts(recentRes.data.data);
      } catch (err) {
        console.error("Error loading sidebar:", err);
      }
    };
    fetchSidebar();
  }, []);

  const handlePageChange = (page: number) => {
    fetchPosts(page, selectedCategory);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredPosts = posts.filter((p) =>
    searchInput
      ? p.title.toLowerCase().includes(searchInput.toLowerCase())
      : true,
  );

  return (
    <main className="w-full bg-white">
      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[316px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/shop-hero.png"
            alt="Blog Banner"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="flex flex-col items-center text-center relative z-10">
          <Image src="/images/house_logo.png" alt="Logo" width={40} height={40} className="mb-2" />
          <h1 className="text-[48px] font-medium text-black leading-tight">Blog</h1>
          <div className="flex items-center gap-2 text-base">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light">Blog</span>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] py-[60px]">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ── LEFT: Post List ── */}
          <div className="flex-1 flex flex-col gap-10">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-[400px] rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl">No posts found.</p>
              </div>
            ) : (
              filteredPosts.map((post, i) => (
                <article key={post.id} className="flex flex-col gap-4">
                  {/* Image */}
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                    <Image
                      src={post.imageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-[#9F9F9F]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {post.author?.name || "Admin"}
                    </span>
                    <span className="w-px h-4 bg-gray-200" />
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(post.createdAt)}
                    </span>
                    <span className="w-px h-4 bg-gray-200" />
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-[26px] font-medium text-black leading-snug hover:text-[#B88E2F] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-[#9F9F9F] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Read More */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="self-start border-b border-black pb-1 text-black font-medium hover:text-[#B88E2F] hover:border-[#B88E2F] transition-colors"
                  >
                    Read more
                  </Link>

                  <hr className="border-gray-100 mt-2" />
                </article>
              ))
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2 mt-4">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-[5px] text-sm font-medium transition-colors ${
                      pagination.currentPage === page
                        ? "bg-[#B88E2F] text-white"
                        : "bg-[#F9F1E7] text-black hover:bg-[#B88E2F] hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {pagination.currentPage < pagination.totalPages && (
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="px-4 h-10 rounded-[5px] text-sm font-medium bg-[#F9F1E7] text-black hover:bg-[#B88E2F] hover:text-white transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-10">
            {/* Search */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border border-[#9F9F9F] rounded-[5px] px-4 py-3 pr-11 text-sm outline-none focus:border-[#B88E2F]"
                />
                <Search className="absolute right-3 top-3.5 w-5 h-5 text-[#9F9F9F]" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xl font-medium text-black mb-5">Categories</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`flex justify-between items-center w-full text-sm transition-colors hover:text-[#B88E2F] ${
                      selectedCategory === "" ? "text-[#B88E2F] font-medium" : "text-[#9F9F9F]"
                    }`}
                  >
                    <span>All Posts</span>
                    <span>{posts.length > 0 ? pagination.totalPages * 3 : 0}</span>
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex justify-between items-center w-full text-sm transition-colors hover:text-[#B88E2F] ${
                        selectedCategory === cat.name ? "text-[#B88E2F] font-medium" : "text-[#9F9F9F]"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span>{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div>
              <h3 className="text-xl font-medium text-black mb-5">Recent Posts</h3>
              <div className="flex flex-col gap-5">
                {recentPosts.map((p, i) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="flex items-center gap-3 group">
                    <div className="w-[80px] h-[80px] rounded-[5px] overflow-hidden relative shrink-0 bg-gray-100">
                      <Image
                        src={p.imageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-normal text-black group-hover:text-[#B88E2F] transition-colors line-clamp-2">
                        {p.title}
                      </span>
                      <span className="text-xs text-[#9F9F9F]">{formatDate(p.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <FeaturesBar />
    </main>
  );
}
