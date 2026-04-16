import ProductSkeleton from "@/components/ui/ProductSkeleton";

export default function ShopLoading() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Skeleton */}
      <section className="relative w-full h-[316px] bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-32 bg-gray-300 rounded" />
          <div className="h-4 w-48 bg-gray-300 rounded mt-2" />
        </div>
      </section>

      {/* Filter Bar Skeleton */}
      <section className="w-full bg-[#F9F1E7] py-6 animate-pulse">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-10 w-[300px] bg-gray-300 rounded" />
          <div className="h-10 w-[200px] bg-gray-300 rounded" />
        </div>
      </section>

      {/* Product Grid Skeleton */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-16 min-h-[500px]">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>
      </section>
    </div>
  );
}
