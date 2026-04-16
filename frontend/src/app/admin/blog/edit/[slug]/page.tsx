"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import Image from "next/image";

const CATEGORIES = ["General", "Wood", "Interior", "Design", "Handmade", "Tips & Tricks"];

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [postId, setPostId] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    category: "General",
    published: false,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/admin/slug/${slug}`);
        if (res.data.success) {
          const p = res.data.data;
          setPostId(p.id);
          setForm({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || "",
            content: p.content,
            imageUrl: p.imageUrl || "",
            category: p.category || "General",
            published: p.published || false,
          });
        }
      } catch {
        toast.error("Cannot load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/posts/admin/upload-image", formData);
      if (res.data.success) {
        setForm((prev) => ({ ...prev, imageUrl: res.data.url }));
        toast.success("Image uploaded!");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/posts/admin/${postId}`, form);
      toast.success("✅ Post updated successfully!");
      router.push("/admin/blog");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black">Edit Post</h1>
            <p className="text-sm text-gray-500 font-mono">{form.slug}</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#B88E2F] hover:bg-[#a07b28] text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-70"
        >
          {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold">Post Content</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={14}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold">Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none bg-white"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              {form.imageUrl ? (
                <div className="relative rounded-xl overflow-hidden aspect-video group">
                  <Image src={form.imageUrl} alt="preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: "" })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  {uploadingImage ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B88E2F]" />
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">Click to upload</span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 accent-[#B88E2F]"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Published
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
