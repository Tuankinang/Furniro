import Image from "next/image";

export default function FeaturesBar() {
  return (
    <section className="w-full bg-[#FAF3EA] py-16 md:py-24 mt-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="flex items-center gap-4">
          <Image
            src="/images/trophy.png"
            alt="High Quality"
            width={60}
            height={60}
            className="object-contain"
          />
          <div>
            <h4 className="text-[20px] md:text-[25px] font-semibold text-[#242424]">
              High Quality
            </h4>
            <p className="text-[#898989] text-base md:text-xl font-medium">
              crafted from top materials
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="/images/guarantee.png"
            alt="Warranty Protection"
            width={60}
            height={60}
            className="object-contain"
          />
          <div>
            <h4 className="text-[20px] md:text-[25px] font-semibold text-[#242424]">
              Warranty Protection
            </h4>
            <p className="text-[#898989] text-base md:text-xl font-medium">
              Over 2 years
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="/images/shipping.png"
            alt="Free Shipping"
            width={60}
            height={60}
            className="object-contain"
          />
          <div>
            <h4 className="text-[20px] md:text-[25px] font-semibold text-[#242424]">
              Free Shipping
            </h4>
            <p className="text-[#898989] text-base md:text-xl font-medium">
              Order over 150 $
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="/images/customer-support.png"
            alt="24 / 7 Support"
            width={60}
            height={60}
            className="object-contain"
          />
          <div>
            <h4 className="text-[20px] md:text-[25px] font-semibold text-[#242424]">
              24 / 7 Support
            </h4>
            <p className="text-[#898989] text-base md:text-xl font-medium">
              Dedicated support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
