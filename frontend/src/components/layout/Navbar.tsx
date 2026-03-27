import Link from "next/link";
import Image from "next/image";
import { User, Search, Heart, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full bg-white h-[100px] flex items-center">
      <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between px-4 md:px-12">
        {/* 1. Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Furniro Logo"
            width={50}
            height={32}
            className="w-auto h-8"
          />
        </Link>

        {/* 2. Menu Navigation */}
        <nav className="hidden md:flex items-center gap-[75px] font-medium text-black">
          <Link
            href="/"
            className="text-base hover:text-[#B88E2F] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-base hover:text-[#B88E2F] transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-base hover:text-[#B88E2F] transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-base hover:text-[#B88E2F] transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* 3. Icons Action */}
        <div className="flex items-center gap-11 text-black">
          <button
            className="hover:text-[#B88E2F] transition-colors"
            aria-label="Account"
          >
            <User className="w-7 h-7 stroke-[1.5]" />
          </button>
          <button
            className="hover:text-[#B88E2F] transition-colors"
            aria-label="Search"
          >
            <Search className="w-7 h-7 stroke-[1.5]" />
          </button>
          <button
            className="hover:text-[#B88E2F] transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-7 h-7 stroke-[1.5]" />
          </button>
          <button
            className="hover:text-[#B88E2F] transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-7 h-7 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
