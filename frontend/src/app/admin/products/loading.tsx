import TableSkeleton from "@/components/ui/TableSkeleton";
import { Package } from "lucide-react";

export default function AdminProductsLoading() {
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
              View and manage all products, manage inventory. Click "Add New Product" to create a new product for the store.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="h-10 w-44 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      <TableSkeleton columns={6} rows={5} />
    </div>
  );
}
