import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="w-full bg-white pb-20 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <section className="w-full bg-[#F9F1E7] h-[100px] flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] flex items-center gap-4">
          <Skeleton className="h-4 w-16 bg-gray-300" />
          <Skeleton className="h-4 w-4 bg-gray-300" />
          <Skeleton className="h-4 w-16 bg-gray-300" />
          <Skeleton className="h-4 w-4 bg-gray-300" />
          <Skeleton className="h-6 w-32 bg-gray-300 border-l border-gray-400 pl-4" />
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] pt-[35px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        {/* Images Column */}
        <div className="flex flex-col-reverse md:flex-row gap-8">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:w-[76px] shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-[76px] h-[76px] rounded-[10px] bg-gray-200" />
            ))}
          </div>
          <Skeleton className="w-full aspect-[4/5] max-h-[500px] rounded-[10px] bg-gray-200" />
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4 bg-gray-200" />
          <Skeleton className="h-8 w-1/3 bg-gray-200" />
          
          {/* Reviews pseudo */}
          <div className="flex gap-4 items-center">
            <Skeleton className="h-4 w-24 bg-gray-200" />
            <Skeleton className="h-4 w-24 bg-gray-200 border-l pl-4" />
          </div>
          
          <Skeleton className="h-20 w-full bg-gray-200 mt-4" />
          
          {/* Sizes */}
          <div className="mt-4">
            <Skeleton className="h-4 w-12 bg-gray-200 mb-2" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-8 h-8 rounded bg-gray-200" />
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mt-4">
            <Skeleton className="h-4 w-12 bg-gray-200 mb-2" />
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-8 h-8 rounded-full bg-gray-200" />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-8 pb-10 border-b border-[#D9D9D9]">
            <Skeleton className="w-[123px] h-[64px] rounded-[10px] bg-gray-200" />
            <Skeleton className="w-[215px] h-[64px] rounded-[15px] bg-gray-200" />
            <Skeleton className="w-[215px] h-[64px] rounded-[15px] bg-gray-200" />
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-3 mt-8">
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
          </div>
        </div>
      </section>
    </div>
  );
}
