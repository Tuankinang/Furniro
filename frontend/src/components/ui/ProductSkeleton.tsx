import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-[#F4F5F7] overflow-hidden">
      {/* Hình ảnh sản phẩm */}
      <Skeleton className="w-full aspect-square rounded-none" />
      
      {/* Chi tiết sản phẩm */}
      <div className="p-4 md:p-[18px] pb-6 flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4 rounded bg-gray-200" />
        <Skeleton className="h-4 w-full rounded bg-gray-200 mt-1" />
        <Skeleton className="h-4 w-1/2 rounded bg-gray-200" />
        
        <div className="flex items-center gap-3 mt-2">
          <Skeleton className="h-6 w-1/3 rounded bg-gray-300" />
          <Skeleton className="h-4 w-1/4 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
