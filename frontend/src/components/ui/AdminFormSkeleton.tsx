import { Skeleton } from "@/components/ui/skeleton";

export default function AdminFormSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
          <div>
            <Skeleton className="w-48 h-8 bg-gray-200 mb-2" />
            <Skeleton className="w-64 h-4 bg-gray-200" />
          </div>
        </div>
        <Skeleton className="w-36 h-10 rounded-md bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <Skeleton className="w-32 h-6 bg-gray-200 mb-4" />
            <div className="space-y-2">
              <Skeleton className="w-24 h-4 bg-gray-200" />
              <Skeleton className="w-full h-10 rounded-lg bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-24 h-4 bg-gray-200" />
              <Skeleton className="w-full h-10 rounded-lg bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-24 h-4 bg-gray-200" />
              <Skeleton className="w-full h-24 rounded-lg bg-gray-100" />
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <Skeleton className="w-32 h-6 bg-gray-200 mb-2" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-1/3 h-10 rounded-lg bg-gray-100" />
                <Skeleton className="flex-1 h-10 rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>

          {/* Variants */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <Skeleton className="w-32 h-6 bg-gray-200 mb-2" />
            <Skeleton className="w-full h-40 rounded-xl bg-gray-100" />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Category */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <Skeleton className="w-32 h-6 bg-gray-200 mb-2" />
            <div className="space-y-2">
              <Skeleton className="w-24 h-4 bg-gray-200" />
              <Skeleton className="w-full h-10 rounded-lg bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-24 h-4 bg-gray-200" />
              <Skeleton className="w-full h-10 rounded-lg bg-gray-100" />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <Skeleton className="w-32 h-6 bg-gray-200 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
