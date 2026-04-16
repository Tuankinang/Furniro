"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, User, Calendar, Tag } from "lucide-react";
import api from "@/lib/axios";
import FeaturesBar from "@/components/ui/FeaturesBar";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [post, setPost] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, recentRes] = await Promise.all([
          api.get(`/posts/${slug}`),
          api.get("/posts/recent"),
        ]);
        if (postRes.data.success) setPost(postRes.data.data);
        if (recentRes.data.success) setRecentPosts(recentRes.data.data);
      } catch (err) {
        console.error("Error loading post:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-500">Post not found.</p>
        <Link href="/blog" className="text-[#B88E2F] hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <main className="w-full bg-white">
      {/* ── Hero ── */}
      <section className="relative w-full h-[316px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={"/images/shop-hero.png"}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="flex flex-col items-center text-center relative z-10 px-4">
          <Image src="/images/house_logo.png" alt="Logo" width={40} height={40} className="mb-2" />
          <h1 className="text-[36px] md:text-[48px] font-medium text-black leading-tight max-w-2xl line-clamp-2">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-base mt-2">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="font-medium hover:text-[#B88E2F]">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light line-clamp-1 max-w-[200px]">{post.title}</span>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] py-[60px]">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Article */}
          <article className="flex-1">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#9F9F9F] mb-6">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {post.author?.name || "Admin"}
              </span>
              <span className="w-px h-4 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {formatDate(post.createdAt)}
              </span>
              <span className="w-px h-4 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> {post.category}
              </span>
            </div>

            {/* Cover */}
            {post.imageUrl && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Body */}
            <div className="prose max-w-none text-[#9F9F9F] leading-loose whitespace-pre-wrap text-base">
              {post.content}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <Link href="/blog" className="text-[#B88E2F] hover:underline font-medium">
                ← Back to Blog
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] shrink-0">
            <h3 className="text-xl font-medium text-black mb-5">Recent Posts</h3>
            <div className="flex flex-col gap-5">
              {recentPosts.filter((p) => p.slug !== slug).map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="flex items-center gap-3 group">
                  <div className="w-[80px] h-[80px] rounded-[5px] overflow-hidden relative shrink-0 bg-gray-100">
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#F9F1E7]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-black group-hover:text-[#B88E2F] transition-colors line-clamp-2">
                      {p.title}
                    </span>
                    <span className="text-xs text-[#9F9F9F]">{formatDate(p.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <FeaturesBar />
    </main>
  );
}
