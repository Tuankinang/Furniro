"use client";

import Link from "next/link";
import Image from "next/image";
import {
  User,
  Search,
  Heart,
  ShoppingCart,
  LogOut,
  ChevronDown,
  Settings,
  Package,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice } from "@/lib/utils";

const Navbar = () => {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { openCart, clearCart, items, fetchCart } = useCartStore();
  const { fetchIds, clearWishlist, wishlistedIds } = useWishlistStore();

  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search API call (with 500ms debounce)
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        // Call API with a small limit for a clean popup display
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.data.success) {
          const rawData = res.data.data;
          const productList = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.data) ? rawData.data : [];
          setSearchResults(productList);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    // Wait for user to finish typing (500ms) before calling API
    const timeoutId = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchIds(); // Sync wishlist IDs when logged in
    } else {
      clearCart();
      clearWishlist();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("Backend logout error", error);
    } finally {
      clearAuth();
      clearCart();
      clearWishlist();
      setShowUserMenu(false);
      toast.success("Logged out successfully!");
      router.push("/login");
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalWishlist = mounted ? wishlistedIds.size : 0;

  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md h-[100px] flex items-center shadow-sm z-40">
      <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between px-4 md:px-12">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Furniro Logo"
            width={50}
            height={32}
            className="w-auto h-8"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-[75px] font-medium text-black">
          <Link href="/" className="hover:text-[#B88E2F] transition-colors">
            Home
          </Link>
          <Link href="/shop" className="hover:text-[#B88E2F] transition-colors">
            Shop
          </Link>
          <Link
            href="/about"
            className="hover:text-[#B88E2F] transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#B88E2F] transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-11 text-black">
          <div className="relative" ref={searchRef}>
            <button 
              onClick={() => {
                setShowSearch(!showSearch);
                if (!showSearch) setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
              }}
              className="hover:text-[#B88E2F] transition-colors flex items-center"
            >
              <Search className="w-7 h-7 stroke-[1.5]" />
            </button>

            {/* Search Dropdown */}
            {showSearch && (
              <div className="absolute top-full right-0 md:right-auto md:-left-40 mt-6 w-[320px] md:w-[400px] bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                  <input
                    id="searchInput"
                    type="text"
                    placeholder="Product search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 focus:border-[#B88E2F] rounded-lg outline-none text-sm transition-colors shadow-sm"
                  />
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  {isSearching ? (
                    <div className="p-6 text-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#B88E2F] mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          // Change this path if your detail page is different (e.g., /shop/${product.slug})
                          href={`/product/${product.slug}`} 
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-[#F9F1E7]/50 transition-colors border-b border-gray-50 last:border-0 group"
                        >
                          <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                             {product.images?.[0]?.url ? (
                               <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                             )}
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-[#B88E2F] transition-colors">{product.name}</p>
                            <p className="text-sm text-[#B88E2F] font-semibold mt-0.5">
                              {formatPrice ? formatPrice(product.currentPrice) : `${product.currentPrice?.toLocaleString()} VND`}
                            </p>
                          </div>
                        </Link>
                      ))}
                      <div className="p-2 bg-gray-50 text-center">
                        <Link href={`/shop?search=${searchQuery}`} onClick={() => setShowSearch(false)} className="text-xs font-semibold text-[#B88E2F] hover:underline">
                          See all results
                        </Link>
                      </div>
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="p-6 text-center text-sm text-gray-500">
                      No products found <br/> <span className="font-bold text-black">"{searchQuery}"</span>
                    </div>
                  ) : (
                     <div className="p-6 text-center text-sm text-gray-400">
                        Enter product name you want to search for...
                     </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Heart / Wishlist */}
          <button
            onClick={() => router.push("/wishlist")}
            className="relative hover:text-[#B88E2F] transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-7 h-7 stroke-[1.5]" />
            {mounted && totalWishlist > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                {totalWishlist}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative hover:text-[#B88E2F] transition-colors"
          >
            <ShoppingCart className="w-7 h-7 stroke-[1.5]" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#B88E2F] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>

          {mounted && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative flex items-center group"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#B88E2F] transition-all duration-300">
                  <Image
                    src="/images/avatar-placeholder.png"
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                  <ChevronDown className="w-3 h-3 text-white" />
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile/orders"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#B88E2F] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Package className="w-4 h-4" />
                    My orders
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#B88E2F] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Heart className="w-4 h-4" />
                    My wishlist
                    {totalWishlist > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {totalWishlist}
                      </span>
                    )}
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#B88E2F] transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}

                  <hr className="my-1 border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:text-[#B88E2F] transition-colors"
            >
              <User className="w-7 h-7 stroke-[1.5]" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
