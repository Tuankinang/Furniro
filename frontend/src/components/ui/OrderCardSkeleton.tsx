import { Skeleton } from "@/components/ui/skeleton";

export default function OrderCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Order Header Skeleton */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-gray-200" />
          <Skeleton className="h-4 w-40 bg-gray-200" />
        </div>
        <div>
          <Skeleton className="h-7 w-24 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Order Items Skeleton */}
      <div className="px-6 py-4 flex flex-col gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-50 last:border-0 last:pb-0">
            <Skeleton className="w-20 h-20 bg-gray-200 rounded-md shrink-0" />
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48 bg-gray-200" />
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-4 w-12 bg-gray-200" />
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-5 w-24 bg-gray-200 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Footer Skeleton */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-md bg-gray-200" />
        </div>
        <div className="flex items-center gap-4 text-right">
          <Skeleton className="h-4 w-16 bg-gray-200" />
          <Skeleton className="h-6 w-32 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
