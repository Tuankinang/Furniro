"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, Plus, Trash2, X, ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. STATE THÔNG TIN CƠ BẢN
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Tự động gợi ý slug khi nhập tên
  const handleNameChange = (value: string) => {
    setName(value);
    // Chỉ auto-fill slug nếu người dùng chưa tự nhập slug
    if (!slug || slug === autoSlugFrom(name)) {
      setSlug(autoSlugFrom(value));
    }
  };

  const autoSlugFrom = (text: string) => {
    const baseSlug = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // Thêm chuỗi 4 số ngẫu nhiên ở đuôi để tránh lỗi trùng lặp Slug trong Database
    return baseSlug
      ? `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`
      : "";
  };

  // 2. STATE SPECIFICATIONS (dạng mảng key-value)
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (i: number) =>
    setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    const next = [...specs];
    next[i][field] = val;
    setSpecs(next);
  };

  // 3. Lấy danh sách Category thật từ API
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/products/categories");
        if (res.data.success) setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 4. STATE ẢNH VÀ PREVIEW
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 5. STATE BIẾN THỂ (VARIANTS)
  const [variants, setVariants] = useState([
    { sku: "", size: "", color: "", price: 0, stock: 0 },
  ]);

  const addVariant = () =>
    setVariants([
      ...variants,
      { sku: "", size: "", color: "", price: 0, stock: 0 },
    ]);

  const updateVariant = (index: number, field: string, value: any) => {
    const next = [...variants];
    (next[index] as any)[field] = value;
    setVariants(next);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) { toast.error("There must be at least 1 variant!"); return; }
    setVariants(variants.filter((_, i) => i !== index));
  };

  // 6. XỬ LÝ SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least 1 product image!");
      return;
    }
    if (!categoryId) { toast.error("Please select a product category!"); return; }
    if (!slug.trim()) { toast.error("Please enter a Slug for the product!"); return; }

    const missingSku = variants.find((v) => !v.sku.trim());
    if (missingSku) { toast.error("Each variant must have an SKU code!"); return; }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug.trim());
      formData.append("shortDescription", shortDescription);
      formData.append("description", description);
      formData.append("categoryId", categoryId);
      formData.append("discountPercent", discountPercent.toString());

      // Chuyển Specifications thành object JSON
      const specsObj: Record<string, string> = {};
      specs.forEach(({ key, value }) => {
        if (key.trim()) specsObj[key.trim()] = value.trim();
      });
      if (Object.keys(specsObj).length > 0) {
        formData.append("specifications", JSON.stringify(specsObj));
      }

      formData.append(
        "variants",
        JSON.stringify(
          variants.map((v) => ({
            ...v,
            price: Number(v.price) || 0,
            stock: Number(v.stock) || 0,
          })),
        ),
      );

      images.forEach((img) => formData.append("images", img));

      const res = await api.post("/products/admin/create", formData);
      if (res.data.success) {
        toast.success("🎉 Product added successfully!");
        router.push("/admin/products");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred while saving the product!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 max-w-6xl mx-auto pb-10"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-black">Add New Product</h1>
            <p className="text-sm text-gray-500">
              Create product and product variants
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#B88E2F] hover:bg-[#a07b28] text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-70"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isLoading ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* CỘT TRÁI */}
        <div className="xl:col-span-2 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none"
                  placeholder="e.g. Milano Leather Sofa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL) *
                  <span className="text-xs text-gray-400 font-normal ml-2">
                    — auto-generated from name, editable
                  </span>
                </label>
                <input
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none font-mono text-sm"
                  placeholder="e.g. milano-leather-sofa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none"
                  placeholder="Summarize the key highlights..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none"
                  placeholder="Write detailed information about the product here..."
                />
              </div>
            </div>
          </div>

          {/* Thông số kỹ thuật */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-black">
                Specifications
              </h2>
              <button
                type="button"
                onClick={addSpec}
                className="text-[#B88E2F] hover:bg-[#F9F1E7] p-2 rounded-md transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    value={spec.key}
                    onChange={(e) => updateSpec(i, "key", e.target.value)}
                    className="w-2/5 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B88E2F]"
                    placeholder="e.g. Material"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B88E2F]"
                    placeholder="e.g. Natural oak wood"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="text-red-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Rows with empty attribute names will be ignored.
            </p>
          </div>

          {/* Upload Ảnh */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-4">
              Product Images *
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                >
                  <Image
                    src={url}
                    alt={`preview ${index}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">
                      Cover Image
                    </span>
                  )}
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 font-medium">
                  Upload Image
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">
              Supports JPG, PNG, WEBP. Select multiple images at once. Max 5 images.
            </p>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="space-y-6">
          {/* Phân loại */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-4">
              Category & Promotions
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none bg-white"
                >
                  <option value="" disabled>
                    -- Select a category --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-[#B88E2F] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Biến thể */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-black">Variants</h2>
              <button
                type="button"
                onClick={addVariant}
                className="text-[#B88E2F] hover:bg-[#F9F1E7] p-2 rounded-md transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-xl relative bg-gray-50/50"
                >
                  <div className="absolute -top-3 -right-3">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="bg-white border border-gray-200 text-red-500 hover:bg-red-50 p-1.5 rounded-full shadow-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        SKU Code *
                      </label>
                      <input
                        required
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(index, "sku", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[#B88E2F]"
                        placeholder={`e.g. SOFA-MILANO-0${index + 1}`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Color
                      </label>
                      <input
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(index, "color", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[#B88E2F]"
                        placeholder="e.g. Tan leather"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Size
                      </label>
                      <input
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(index, "size", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[#B88E2F]"
                        placeholder="e.g. 2m x 1.8m"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Selling Price (VND) *
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(index, "price", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[#B88E2F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Stock *
                      </label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(index, "stock", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-[#B88E2F]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
