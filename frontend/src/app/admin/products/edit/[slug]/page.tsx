"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Save, Plus, Trash2, Edit2, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import AdminFormSkeleton from "@/components/ui/AdminFormSkeleton";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingMain, setIsSavingMain] = useState(false);
  const [productId, setProductId] = useState("");

  // --- STATE THÔNG TIN GỐC ---
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // --- STATE BIẾN THỂ ---
  const [variants, setVariants] = useState<any[]>([]);
  // Dùng để chứa dữ liệu form thêm biến thể mới
  const [newVariant, setNewVariant] = useState({
    sku: "",
    color: "",
    size: "",
    price: 0,
    stock: 0,
  });
  const [isAddingVariant, setIsAddingVariant] = useState(false);

  // --- STATE QUẢN LÝ ẢNH ---
  const [images, setImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isUploadingImgs, setIsUploadingImgs] = useState(false);

  // FETCH DỮ LIỆU BAN ĐẦU
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh mục
        const catRes = await api.get("/products/categories");
        if (catRes.data.success) setCategories(catRes.data.data);

        // Lấy chi tiết sản phẩm theo slug
        const prodRes = await api.get(`/products/${slug}`);
        if (prodRes.data.success) {
          const p = prodRes.data.data;
          setProductId(p.id);
          setName(p.name);
          setShortDescription(p.shortDescription || "");
          setDescription(p.description || "");
          setCategoryId(p.categoryId);
          setDiscountPercent(p.discountPercent || 0);
          setVariants(p.variants || []);
          setImages(p.images || []);

          // Chuyển JSON specs thành mảng để hiển thị Form
          const specObj = p.specifications || {};
          const specArr = Object.entries(specObj).map(([k, v]) => ({
            key: k,
            value: v as string,
          }));
          setSpecs(specArr.length > 0 ? specArr : [{ key: "", value: "" }]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Cannot load product information!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // ==========================================
  // 1. XỬ LÝ SẢN PHẨM GỐC
  // ==========================================
  const handleUpdateMainInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMain(true);
    try {
      const specsObj: Record<string, string> = {};
      specs.forEach(({ key, value }) => {
        if (key.trim()) specsObj[key.trim()] = value.trim();
      });

      const res = await api.patch(`/products/admin/${productId}`, {
        name,
        shortDescription,
        description,
        categoryId,
        discountPercent,
        specifications: specsObj,
      });

      if (res.data.success) {
        toast.success("✅ General information updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating product!");
    } finally {
      setIsSavingMain(false);
    }
  };

  // Quản lý Specs UI
  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (i: number) =>
    setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    const next = [...specs];
    next[i][field] = val;
    setSpecs(next);
  };

  // ==========================================
  // 2. XỬ LÝ BIẾN THỂ (VARIANTS)
  // ==========================================

  // SỬA BIẾN THỂ (Inline)
  const handleUpdateExistingVariant = async (
    index: number,
    variantId: string,
  ) => {
    try {
      const v = variants[index];
      const res = await api.patch(`/products/admin/variant/${variantId}`, {
        sku: v.sku,
        color: v.color,
        size: v.size,
        price: Number(v.price),
        stock: Number(v.stock),
      });
      if (res.data.success) toast.success("✅ Variant saved!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error saving variant!");
    }
  };

  // XÓA BIẾN THỂ
  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    try {
      const res = await api.delete(`/products/admin/variant/${variantId}`);
      if (res.data.success) {
        setVariants(variants.filter((v) => v.id !== variantId));
        toast.success("🗑️ Deleted successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Cannot delete this variant!");
    }
  };

  // THÊM BIẾN THỂ MỚI
  const handleAddNewVariant = async () => {
    if (!newVariant.sku) { toast.error("Please enter an SKU code!"); return; }
    try {
      const res = await api.post(
        `/products/admin/${productId}/variant`,
        newVariant,
      );
      if (res.data.success) {
        setVariants([...variants, res.data.data]);
        setNewVariant({ sku: "", color: "", size: "", price: 0, stock: 0 });
        setIsAddingVariant(false);
        toast.success("✅ New variant added!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error adding variant!");
    }
  };

  // ==========================================
  // 3. XỬ LÝ ẢNH (IMAGES)
  // ==========================================
  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await api.delete(`/products/admin/images/${imageId}`);
      if (res.data.success) {
        setImages(images.filter((img) => img.id !== imageId));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting image!");
    }
  };

  const handleSetDefaultImage = async (imageId: string) => {
    try {
      const res = await api.patch(
        `/products/admin/${productId}/images/${imageId}/default`,
      );
      if (res.data.success) {
        setImages(
          images.map((img) => ({ ...img, isDefault: img.id === imageId })),
        );
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating cover image!");
    }
  };

  const handleUploadNewImages = async () => {
    if (newImages.length === 0) { toast.error("Please select an image!"); return; }
    setIsUploadingImgs(true);
    try {
      const formData = new FormData();
      newImages.forEach((file) => formData.append("images", file));

      const res = await api.post(
        `/products/admin/${productId}/images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success) {
        setImages([...images, ...res.data.data]);
        setNewImages([]);
        toast.success("✅ Images uploaded successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error uploading images!");
    } finally {
      setIsUploadingImgs(false);
    }
  };

  if (isLoading) return <AdminFormSkeleton />;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-black">Edit Product</h1>
          <p className="text-sm text-gray-500">ID: {productId}</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* KHU VỰC 1: FORM THÔNG TIN GỐC */}
        <form onSubmit={handleUpdateMainInfo} className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">General Information</h2>
              <button
                type="submit"
                disabled={isSavingMain}
                className="bg-[#B88E2F] hover:bg-[#9a7726] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSavingMain ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Info
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#B88E2F]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#B88E2F] bg-white"
                  >
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
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#B88E2F]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#B88E2F]"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#B88E2F]"
                />
              </div>

              {/* Thông số kỹ thuật (Specs) */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Specifications
                  </label>
                  <button
                    type="button"
                    onClick={addSpec}
                    className="text-[#B88E2F] hover:bg-[#F9F1E7] p-1.5 rounded-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        value={spec.key}
                        onChange={(e) => updateSpec(i, "key", e.target.value)}
                        className="w-1/3 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none"
                        placeholder="Attribute"
                      />
                      <input
                        value={spec.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm outline-none"
                        placeholder="Value"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="text-red-400 p-1.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* KHU VỰC 2: QUẢN LÝ BIẾN THỂ */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-black">Variant Management</h2>
            <button
              onClick={() => setIsAddingVariant(!isAddingVariant)}
              className="flex items-center gap-1 text-sm font-medium text-[#B88E2F] bg-[#F9F1E7] px-3 py-1.5 rounded-md hover:bg-[#f0e3d1]"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>

          {/* Form Thêm Biến thể mới (Ẩn/Hiện) */}
          {isAddingVariant && (
            <div className="bg-[#F9F1E7] p-4 rounded-xl border border-[#e0cba3] shadow-sm">
              <h3 className="text-sm font-bold mb-3 text-[#B88E2F]">
                Add New Variant
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="SKU Code *"
                  value={newVariant.sku}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, sku: e.target.value })
                  }
                  className="px-3 py-2 text-sm rounded-md border outline-none"
                />
                <input
                  placeholder="Color"
                  value={newVariant.color}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, color: e.target.value })
                  }
                  className="px-3 py-2 text-sm rounded-md border outline-none"
                />
                <input
                  placeholder="Size"
                  value={newVariant.size}
                  onChange={(e) =>
                    setNewVariant({ ...newVariant, size: e.target.value })
                  }
                  className="px-3 py-2 text-sm rounded-md border outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Price *"
                    value={newVariant.price || ""}
                    onChange={(e) =>
                      setNewVariant({
                        ...newVariant,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-1/2 px-3 py-2 text-sm rounded-md border outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Stock *"
                    value={newVariant.stock || ""}
                    onChange={(e) =>
                      setNewVariant({
                        ...newVariant,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-1/2 px-3 py-2 text-sm rounded-md border outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingVariant(false)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:bg-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewVariant}
                  className="px-3 py-1.5 text-sm text-white bg-[#B88E2F] rounded-md"
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Danh sách biến thể hiện có (Inline Edit) */}
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group"
              >
                {/* Nút Xóa */}
                <button
                  onClick={() => handleDeleteVariant(variant.id)}
                  className="absolute -top-2 -right-2 bg-white text-red-500 border border-gray-200 p-1.5 rounded-full shadow-sm hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">SKU Code</label>
                    <input
                      value={variant.sku}
                      onChange={(e) => {
                        const newV = [...variants];
                        newV[index].sku = e.target.value;
                        setVariants(newV);
                      }}
                      className="w-full text-sm font-medium border-b border-transparent hover:border-gray-300 focus:border-[#B88E2F] outline-none py-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-xs text-gray-500">Color</label>
                      <input
                        value={variant.color || ""}
                        onChange={(e) => {
                          const newV = [...variants];
                          newV[index].color = e.target.value;
                          setVariants(newV);
                        }}
                        className="w-full text-sm border-b border-transparent hover:border-gray-300 focus:border-[#B88E2F] outline-none py-1"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-xs text-gray-500">Size</label>
                      <input
                        value={variant.size || ""}
                        onChange={(e) => {
                          const newV = [...variants];
                          newV[index].size = e.target.value;
                          setVariants(newV);
                        }}
                        className="w-full text-sm border-b border-transparent hover:border-gray-300 focus:border-[#B88E2F] outline-none py-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Selling Price</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => {
                        const newV = [...variants];
                        newV[index].price = Number(e.target.value);
                        setVariants(newV);
                      }}
                      className="w-full text-sm text-[#B88E2F] font-bold border-b border-transparent hover:border-gray-300 focus:border-[#B88E2F] outline-none py-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Stock</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => {
                          const newV = [...variants];
                          newV[index].stock = Number(e.target.value);
                          setVariants(newV);
                        }}
                        className="w-full text-sm border-b border-transparent hover:border-gray-300 focus:border-[#B88E2F] outline-none py-1"
                      />
                      <button
                        onClick={() =>
                          handleUpdateExistingVariant(index, variant.id)
                        }
                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-100 flex-shrink-0"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KHU VỰC 3: QUẢN LÝ ẢNH */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Image Management</h2>
          <label className="bg-[#B88E2F] hover:bg-[#9a7726] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Image
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) setNewImages(Array.from(e.target.files));
              }}
            />
          </label>
        </div>

        {/* Preview Ảnh Mới Chuẩn Bị Upload */}
        {newImages.length > 0 && (
          <div className="mb-4 p-4 border border-[#e0cba3] bg-[#F9F1E7] rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium text-[#B88E2F]">
              {newImages.length} new image{newImages.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setNewImages([])}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadNewImages}
                disabled={isUploadingImgs}
                className="px-3 py-1.5 text-sm bg-[#B88E2F] text-white rounded-md flex items-center gap-2 disabled:opacity-70"
              >
                {isUploadingImgs ? (
                  "Uploading..."
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save New Images
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Lưới Ảnh Hiện Có */}
        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No images yet. Please add some.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className={`relative group rounded-xl overflow-hidden border-2 aspect-square ${img.isDefault ? "border-[#B88E2F]" : "border-transparent hover:border-gray-300"}`}
              >
                <img
                  src={img.url}
                  alt="product"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  {!img.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultImage(img.id)}
                      className="bg-white text-xs font-medium px-2 py-1 rounded-sm shadow-sm hover:bg-gray-100"
                    >
                      Set as Cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="bg-red-500 text-white p-2 rounded-full shadow-sm hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {img.isDefault && (
                  <div className="absolute top-2 left-2 bg-[#B88E2F] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    COVER
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
