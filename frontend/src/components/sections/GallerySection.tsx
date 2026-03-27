import Image from "next/image";
import { galleryImages } from "@/lib/data";

const GallerySection = () => {
  return (
    <section className="w-full bg-white py-[56px] md:py-[70px]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center gap-[52px]">
        {/* Header */}
        <div className="text-center">
          <p className="text-base text-[#616161]">Share your setup with</p>
          <h2 className="text-3xl md:text-[40px] font-bold text-[#3A3A3A] font-poppins">
            #FuniroFurniture
          </h2>
        </div>

        {/* Masonry-style gallery grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-[200px] lg:auto-rows-[240px] gap-3">
          {galleryImages.map((src: string, index: number) => (
            <div
              key={index}
              className={`relative overflow-hidden group ${getGridSpan(index)}`}
            >
              <Image
                src={src}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper: give some cells a larger span to create masonry effect
function getGridSpan(index: number): string {
  const spans: Record<number, string> = {
    0: "col-span-1 row-span-2",
    2: "col-span-2 row-span-1",
    4: "col-span-1 row-span-2",
    6: "col-span-2 row-span-1",
  };
  return spans[index] ?? "col-span-1 row-span-1";
}

export default GallerySection;
