import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Trophy,
  Users,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import FeaturesBar from "@/components/ui/FeaturesBar";

const stats = [
  {
    icon: Trophy,
    value: "400+",
    label: "High Quality Products",
    description: "crafted with premium materials",
  },
  {
    icon: Users,
    value: "1,500+",
    label: "Happy Customers",
    description: "across 30+ countries worldwide",
  },
  {
    icon: ShieldCheck,
    value: "10+",
    label: "Years Experience",
    description: "in premium furniture design",
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Customer Support",
    description: "always here to help you",
  },
];

const team = [
  {
    name: "James Wilson",
    role: "Founder & CEO",
    image: "/images/avatar-placeholder.png",
  },
  {
    name: "Sarah Chen",
    role: "Head of Design",
    image: "/images/avatar-placeholder.png",
  },
  {
    name: "Michael Torres",
    role: "Head of Craftsmanship",
    image: "/images/avatar-placeholder.png",
  },
];

export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      {/* 1. HERO BANNER */}
      <section className="relative w-full h-[316px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/shop-hero.png"
            alt="About Banner"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="flex flex-col items-center text-center relative z-10">
          <Image
            src="/images/house_logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="mb-2"
          />
          <h1 className="text-[48px] font-medium text-black leading-tight">
            About
          </h1>
          <div className="flex items-center gap-2 text-base">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light">About</span>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY – Two Columns */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Text */}
        <div className="flex-1 flex flex-col gap-6">
          <span className="text-sm font-semibold text-[#B88E2F] uppercase tracking-widest">
            Our Story
          </span>
          <h2 className="text-[40px] font-bold text-[#3A3A3A] leading-tight">
            Crafting spaces
            <br />
            that inspire living
          </h2>
          <p className="text-base text-[#9F9F9F] leading-relaxed">
            Furniro was born from a simple belief: your home deserves furniture
            as unique as you are. Founded in 2014, we set out to bridge the gap
            between world-class craftsmanship and everyday living — creating
            pieces that combine lasting quality with timeless beauty.
          </p>
          <p className="text-base text-[#9F9F9F] leading-relaxed">
            Every detail at Furniro is intentional. From sustainably sourced
            solid woods to precision-stitched upholstery, our artisans pour
            decades of expertise into every joint, curve, and finish. The
            result? Furniture that doesn't just furnish a room — it transforms
            it.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/shop"
              className="bg-[#B88E2F] text-white px-8 py-3 font-semibold hover:bg-[#a07828] transition-colors"
            >
              Explore Our Products
            </Link>
            <Link
              href="/contact"
              className="border border-[#B88E2F] text-[#B88E2F] px-8 py-3 font-semibold hover:bg-[#B88E2F] hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative w-full aspect-[4/3] rounded-sm overflow-hidden shadow-xl">
          <Image
            src="/images/shop-hero.png"
            alt="Furniro Showroom"
            fill
            className="object-cover"
          />
          {/* Floating badge */}
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-6 py-4 shadow-lg">
            <p className="text-3xl font-bold text-[#B88E2F]">10+</p>
            <p className="text-sm text-[#3A3A3A] font-medium">
              Years of Excellence
            </p>
          </div>
        </div>
      </section>

      {/* 3. STATS */}
      <section className="w-full bg-[#F9F1E7] py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Icon className="w-7 h-7 text-[#B88E2F]" />
                  </div>
                  <p className="text-4xl font-bold text-[#3A3A3A]">
                    {stat.value}
                  </p>
                  <div>
                    <p className="text-base font-semibold text-[#3A3A3A]">
                      {stat.label}
                    </p>
                    <p className="text-sm text-[#9F9F9F] mt-1">
                      {stat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. OUR VALUES */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] py-20">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-sm font-semibold text-[#B88E2F] uppercase tracking-widest mb-3">
            What We Stand For
          </span>
          <h2 className="text-[36px] font-bold text-[#3A3A3A]">Our Values</h2>
          <p className="text-base text-[#9F9F9F] max-w-[600px] mt-3 leading-relaxed">
            These principles guide everything we do — from how we source
            materials to how we treat every customer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality First",
              desc: "We never compromise on materials or craftsmanship. Every Furniro piece is built to last generations, not seasons.",
              color: "bg-amber-50 border-amber-200",
              accent: "text-[#B88E2F]",
              num: "01",
            },
            {
              title: "Sustainable Design",
              desc: "We source responsibly and design with longevity in mind — because great furniture and a healthy planet aren't mutually exclusive.",
              color: "bg-green-50 border-green-200",
              accent: "text-green-600",
              num: "02",
            },
            {
              title: "Customer Delight",
              desc: "From your first browse to your final delivery, we're committed to making the Furniro experience seamless and joyful.",
              color: "bg-blue-50 border-blue-200",
              accent: "text-blue-600",
              num: "03",
            },
          ].map((val) => (
            <div
              key={val.title}
              className={`border ${val.color} p-8 flex flex-col gap-4 rounded-sm`}
            >
              <span className={`text-5xl font-bold opacity-20 ${val.accent}`}>
                {val.num}
              </span>
              <h3 className="text-[22px] font-semibold text-[#3A3A3A]">
                {val.title}
              </h3>
              <p className="text-base text-[#9F9F9F] leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TEAM */}
      <section className="w-full bg-[#F9F1E7] py-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px]">
          <div className="flex flex-col items-center text-center mb-14">
            <span className="text-sm font-semibold text-[#B88E2F] uppercase tracking-widest mb-3">
              The Minds Behind Furniro
            </span>
            <h2 className="text-[36px] font-bold text-[#3A3A3A]">
              Meet Our Team
            </h2>
            <p className="text-base text-[#9F9F9F] max-w-[560px] mt-3 leading-relaxed">
              A passionate group of designers, craftsmen, and dreamers united by
              a love for exceptional furniture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[900px] mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center gap-4 group"
              >
                <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-[#B88E2F] transition-all duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-[#3A3A3A]">
                    {member.name}
                  </p>
                  <p className="text-sm text-[#B88E2F] font-medium">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/shop-hero.png"
          alt="CTA"
          fill
          className="object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
          <h2 className="text-[36px] md:text-[48px] font-bold text-black">
            Ready to transform your space?
          </h2>
          <p className="text-base text-[#3A3A3A] max-w-[500px]">
            Browse our full collection and find the pieces that speak to you.
          </p>
          <Link
            href="/shop"
            className="bg-[#B88E2F] text-white px-10 py-3.5 font-semibold text-base hover:bg-[#a07828] transition-colors shadow-lg mt-2"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* 7. FEATURES BAR */}
      <FeaturesBar />
    </main>
  );
}
