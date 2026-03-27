import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="w-full bg-[#F9F1E7] min-h-[500px] lg:min-h-[600px] relative overflow-hidden flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt="Furnished room background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Content box — positioned on the right */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 flex justify-end">
        <div className="bg-[#FFF3E3] rounded-[10px] p-8 md:p-[50px] max-w-[500px] w-full">
          <span className="text-sm font-semibold text-[#333333] tracking-widest uppercase">
            New Arrival
          </span>
          <h1 className="mt-3 text-4xl md:text-[52px] font-bold text-[#B88E2F] font-poppins leading-tight">
            Discover Our New Collection
          </h1>
          <p className="mt-4 text-sm md:text-base text-[#333333] leading-6 opacity-80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-block bg-[#B88E2F] text-white font-semibold text-base px-10 py-4 hover:bg-[#a07828] transition-colors duration-200 active:scale-95"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
