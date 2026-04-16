import Image from "next/image";

const GallerySection = () => {
  return (
    <section className="w-full bg-white py-[56px] md:py-[70px]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-[72px] flex flex-col items-center gap-[52px]">

        {/* Header */}
        <div className="text-center">
          <p className="text-base text-[#616161]">Share your setup with</p>
          <h2 className="text-[40px] font-bold text-[#3A3A3A] font-poppins">
            #FuniroFurniture
          </h2>
        </div>

        {/* Figma-accurate gallery grid */}
        <div className="w-full grid gap-[14px]"
          style={{
            gridTemplateColumns: "1fr 1fr 2fr 1fr",
            gridTemplateRows: "316px 316px",
          }}
        >
          {/* Col 1: Tall image spanning 2 rows */}
          <div className="relative overflow-hidden rounded-[5px] row-span-2 group">
            <Image
              src="/images/gallery/gallery-1.png"
              alt="Gallery 1"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
          </div>

          {/* Col 2 row 1: Small square */}
          <div className="relative overflow-hidden rounded-[5px] group">
            <Image
              src="/images/gallery/gallery-2.png"
              alt="Gallery 2"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
          </div>

          {/* Col 3 row 1: Wide image */}
          <div className="relative overflow-hidden rounded-[5px] group">
            <Image
              src="/images/gallery/gallery-3.png"
              alt="Gallery 3"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
          </div>

          {/* Col 4 row 1: Square */}
          <div className="relative overflow-hidden rounded-[5px] group">
            <Image
              src="/images/gallery/gallery-4.png"
              alt="Gallery 4"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
          </div>

          {/* Col 2 row 2: Small square */}
          <div className="relative overflow-hidden rounded-[5px] group">
            <Image
              src="/images/gallery/gallery-5.png"
              alt="Gallery 5"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
          </div>

          {/* Col 3 row 2: Square */}
          <div className="relative overflow-hidden rounded-[5px] group">
            <Image
              src="/images/gallery/gallery-6.png"
              alt="Gallery 6"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
          </div>

          {/* Col 4 row 2: Square */}
          <div className="relative overflow-hidden rounded-[5px] group">
            <Image
              src="/images/gallery/gallery-7.png"
              alt="Gallery 7"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default GallerySection;
