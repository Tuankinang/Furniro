"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Layers,
  Package,
  BarChart3,
  Edit,
} from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import TableSkeleton from "@/components/ui/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ========== MODAL CHỈNH SỬA BIẾN THỂ ==========
function EditVariantModal({
  variant,
  onClose,
  onSaved,
}: {
  variant: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [price, setPrice] = useState(variant.price);
  const [stock, setStock] = useState(variant.stock);
  const [size, setSize] = useState(variant.size || "");
  const [color, setColor] = useState(variant.color || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/products/admin/variant/${variant.id}`, {
        price: Number(price),
        stock: Number(stock),
        size,
        color,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating variant!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          Edit Variant —{" "}
          <span className="text-gray-500 text-sm font-normal">
            {variant.sku}
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">Color</label>
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B88E2F]"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Size
            </label>
            <input
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B88E2F]"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Price (VND)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B88E2F]"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B88E2F]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-[#B88E2F] text-white text-sm font-medium hover:bg-[#a07b28] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== COMPONENT CHÍNH ==========
export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [editingVariant, setEditingVariant] = useState<any | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/admin/all");
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error("Error loading products list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const groupedProducts = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        const catName = product.category?.name || "Uncategorized";
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(product);
        return acc;
      },
      {} as Record<string, any[]>,
    );
  }, [products]);

  const handleDeleteVariant = async (variantId: string, sku: string) => {
    if (!confirm(`Are you sure you want to delete the variant "${sku}"?`)) return;
    try {
      await api.delete(`/products/admin/variant/${variantId}`);
      toast.success("Variant deleted successfully!");
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "An error occurred while deleting the variant!");
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory((prev) =>
      prev === categoryName ? null : categoryName,
    );
    setExpandedProduct(null);
  };

  const toggleProduct = (productId: string, e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    )
      return;
    setExpandedProduct((prev) => (prev === productId ? null : productId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-[#B88E2F] rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all products and inventory. Click "Add New Product" to create a new listing.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={6} rows={5} />
      ) : (
        <div className="space-y-4">
          {/* Modal chỉnh sửa nhanh biến thể */}
          {editingVariant && (
            <EditVariantModal
              variant={editingVariant}
              onClose={() => setEditingVariant(null)}
              onSaved={fetchProducts}
            />
          )}

          <div className="flex justify-end">
            <Link
              href="/admin/products/add"
              className="flex items-center gap-2 bg-[#B88E2F] hover:bg-[#a07b28] text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" /> Add New Product
            </Link>
          </div>

          <div className="rounded-md border bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold w-[100px]">Image</TableHead>
                  <TableHead className="font-bold w-[300px]">
                    Product Name
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Variants
                  </TableHead>
                  <TableHead className="font-bold text-right">
                    Price Range
                  </TableHead>
                  <TableHead className="font-bold text-center">
                    Stock
                  </TableHead>
                  <TableHead className="font-bold text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(groupedProducts).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No products yet. Add a new one!
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(groupedProducts as Record<string, any[]>).map(
                    ([categoryName, categoryProducts]) => (
                      <React.Fragment key={categoryName}>
                        {/* LEVEL 1: DÒNG DANH MỤC */}
                        <TableRow
                          className="bg-[#F9F1E7] hover:bg-[#f0e3d1] cursor-pointer transition-colors"
                          onClick={() => toggleCategory(categoryName)}
                        >
                          <TableCell colSpan={6} className="py-4">
                            <div className="flex items-center gap-3 text-[#B88E2F] font-bold text-base">
                              {expandedCategory === categoryName ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                              <Layers className="w-5 h-5" />
                              {categoryName.toUpperCase()}
                              <span className="text-sm font-normal bg-white px-2 py-0.5 rounded-full text-black ml-2">
                                {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* LEVEL 2: DÒNG SẢN PHẨM GỐC */}
                        {expandedCategory === categoryName &&
                          categoryProducts.map((product: any) => {
                            const prices = product.variants?.map(
                              (v: any) => v.price,
                            ) || [0];
                            const minPrice = Math.min(...prices);
                            const maxPrice = Math.max(...prices);
                            const priceRange =
                              minPrice === maxPrice
                                ? formatPrice(minPrice)
                                : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

                            const totalStock =
                              product.variants?.reduce(
                                (sum: number, v: any) => sum + v.stock,
                                0,
                              ) || 0;
                            const totalSold = product.totalSold || 0;
                            const isOutOfStock = totalStock === 0;

                            return (
                              <React.Fragment key={product.id}>
                                <TableRow
                                  className="hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-l-transparent hover:border-l-[#B88E2F]"
                                  onClick={(e) => toggleProduct(product.id, e)}
                                >
                                  <TableCell>
                                    <div className="ml-8 w-12 h-12 rounded-md overflow-hidden bg-gray-100 relative">
                                      {product.images &&
                                      product.images.length > 0 ? (
                                        <Image
                                          src={
                                            product.images.find(
                                              (img: any) => img.isDefault,
                                            )?.url || product.images[0].url
                                          }
                                          alt={product.name}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                          No Img
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      {expandedProduct === product.id ? (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                      )}
                                      <div className="flex flex-col">
                                        <span className="font-medium text-black line-clamp-1">
                                          {product.name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          Click to view variants
                                        </span>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center text-sm font-medium">
                                    {product.variants?.length || 0} Type{(product.variants?.length || 0) !== 1 ? 's' : ''}
                                  </TableCell>
                                  <TableCell className="text-right font-medium text-[#B88E2F]">
                                    {priceRange}
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      <span
                                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${isOutOfStock ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                                      >
                                        In stock: {totalStock}
                                      </span>
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-3">
                                      <span className="text-[10px] font-medium text-blue-600 uppercase flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                                        <BarChart3 className="w-3 h-3" /> Sold:
                                        {totalSold}
                                      </span>
                                      <Link
                                        href={`/admin/products/edit/${product.slug}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-[#B88E2F] hover:text-white text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                                      >
                                        <Edit className="w-3.5 h-3.5" /> Edit
                                      </Link>
                                    </div>
                                  </TableCell>
                                </TableRow>

                                {/* LEVEL 3: DÒNG BIẾN THỂ (VARIANTS) */}
                                {expandedProduct === product.id &&
                                  product.variants?.map(
                                    (variant: any, idx: number) => (
                                      <TableRow
                                        key={variant.id}
                                        className="bg-amber-50/20 border-l-4 border-l-amber-200"
                                      >
                                        <TableCell colSpan={2}>
                                          <div className="flex items-center gap-2 pl-16 text-gray-500 text-sm">
                                            <Package className="w-4 h-4 text-amber-400" />
                                            <span className="font-medium text-gray-700">
                                              Variant {idx + 1}:
                                            </span>
                                            <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-400 uppercase">
                                              {variant.sku || "N/A"}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center text-xs text-gray-600">
                                          {variant.color || "—"} /{" "}
                                          {variant.size || "—"}
                                        </TableCell>
                                        <TableCell className="text-right text-black font-semibold">
                                          {formatPrice(variant.price)}
                                        </TableCell>

                                        <TableCell className="text-center">
                                          <div className="flex items-center justify-center gap-2 text-xs">
                                            <span className="font-bold text-green-700">
                                              In stock: {variant.stock}
                                            </span>
                                            <span className="text-gray-300">
                                              |
                                            </span>
                                            <span className="font-bold text-blue-700">
                                              Sold: {variant.soldCount || 0}
                                            </span>
                                          </div>
                                        </TableCell>

                                        <TableCell className="text-right pr-6">
                                          <div className="flex justify-end gap-2">
                                            <button
                                              onClick={() =>
                                                setEditingVariant(variant)
                                              }
                                              className="text-[10px] px-2 py-1 rounded bg-white border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-colors uppercase"
                                            >
                                              Quick Edit
                                            </button>
                                            <button
                                              onClick={() =>
                                                handleDeleteVariant(
                                                  variant.id,
                                                  variant.sku,
                                                )
                                              }
                                              className="text-[10px] px-2 py-1 rounded bg-white border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors uppercase"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )}
                              </React.Fragment>
                            );
                          })}
                      </React.Fragment>
                    ),
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
