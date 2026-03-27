import Link from "next/link";
import { products } from "@/lib/data";
import { Product } from "@/types";
import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";

const ProductGridSection = () => {
  return (
    <section className="w-full bg-white py-[56px] md:py-[70px]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center gap-[52px]">
        {/* Header */}
        <SectionHeader title="Our Products" />

        {/* Product Grid — 4 cột desktop, 2 tablet, 1 mobile */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Show More CTA */}
        <Link
          href="/shop"
          className="px-[72px] py-[15px] border border-[#B88E2F] text-[#B88E2F] font-semibold hover:bg-[#B88E2F] hover:text-white transition-all duration-200 active:scale-95"
        >
          Show More
        </Link>
      </div>
    </section>
  );
};

export default ProductGridSection;
