"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Trash2, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import FeaturesBar from "@/components/ui/FeaturesBar";

// =========================================================================
// CHILD COMPONENT: Manages quantity state (+, -, manual input) for each item
// =========================================================================
const CartItemRow = ({ item, updateQuantity, removeItem }: any) => {
  const [localQty, setLocalQty] = useState<number | string>(item.quantity);
  const maxStock = item.stock;

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const handleIncrease = () => {
    const currentQty = typeof localQty === "number" ? localQty : 1;

    if (currentQty >= maxStock) {
      toast.error(`Sorry, you can only buy a maximum of ${maxStock} of this item!`);
      setLocalQty(maxStock);
      updateQuantity(item.id, maxStock);
    } else {
      const newQty = currentQty + 1;
      setLocalQty(newQty);
      updateQuantity(item.id, newQty);
    }
  };

  const handleDecrease = () => {
    const currentQty = typeof localQty === "number" ? localQty : 1;
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      setLocalQty(newQty);
      updateQuantity(item.id, newQty);
    }
  };

  // When user types in the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      setLocalQty("");
      return;
    }

    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      if (num > maxStock) {
        toast.error(`Sorry, you can only buy a maximum of ${maxStock} of this item!`);
        setLocalQty(maxStock);
        updateQuantity(item.id, maxStock);
      } else {
        setLocalQty(num);
        updateQuantity(item.id, num);
      }
    }
  };

  const handleBlur = () => {
    if (localQty === "" || Number(localQty) < 1 || isNaN(Number(localQty))) {
      setLocalQty(1);
      updateQuantity(item.id, 1);
    }
  };

  return (
    <tr className="border-b border-[#F0F0F0] last:border-0">
      {/* Product */}
      <td className="py-6 px-6">
        <div className="flex items-center gap-4">
          <div className="w-[105px] h-[105px] bg-[#F9F1E7] rounded-[10px] overflow-hidden relative shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="105px"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-normal text-black line-clamp-2 max-w-[180px]">
              {item.name}
            </span>
            {(item.color !== "Standard" || item.size !== "Standard") && (
              <span className="text-sm text-[#9F9F9F]">
                {item.size} · {item.color}
              </span>
            )}
            <span className="text-[12px] text-[#2EC1AC] font-medium">
              {maxStock} in stock
            </span>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-6 px-6 text-base text-[#9F9F9F] whitespace-nowrap">
        {formatPrice(item.price)}
      </td>

      {/* Quantity - Action group mimicking detail page */}
      <td className="py-6 px-6">
        <div className="flex items-center justify-between w-[100px] h-[40px] rounded-[8px] border border-[#9F9F9F] px-2 shrink-0">
          <button
            onClick={handleDecrease}
            className="hover:text-[#B88E2F] shrink-0"
          >
            <Minus className="w-3 h-3" />
          </button>

          <input
            type="number"
            value={localQty}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full text-center text-sm font-medium bg-transparent border-none outline-none focus:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            onClick={handleIncrease}
            className="hover:text-[#B88E2F] shrink-0"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </td>

      {/* Subtotal */}
      <td className="py-6 px-6 text-base font-medium text-black whitespace-nowrap">
        {formatPrice(item.price * item.quantity)}
      </td>

      {/* Delete */}
      <td className="py-6 px-2">
        <button
          onClick={() => removeItem(item.id)}
          className="text-[#B88E2F] hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

// =========================================================================
// MAIN PAGE: CART PAGE
// =========================================================================
export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <main className="w-full bg-white">
      {/* 1. BANNER & BREADCRUMB */}
      <section className="relative w-full h-[316px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/shop-hero.png"
            alt="Shop Banner"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="flex flex-col items-center text-center relative z-10">
          <Image
            src="/images/house_logo.png"
            alt="House Logo"
            width={40}
            height={40}
            className="mb-2"
          />
          <h1 className="text-[48px] font-medium text-black leading-tight">
            Cart
          </h1>
          <div className="flex items-center gap-2 text-base">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light">Cart</span>
          </div>
        </div>
      </section>

      {/* 2. CART CONTENT */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[75px] pt-[55px] pb-[60px] flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Product List Table */}
        <div className="flex-1 min-w-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <p className="text-xl text-[#9F9F9F]">Your cart is empty.</p>
              <Link
                href="/shop"
                className="px-8 py-3 rounded-[15px] border border-[#B88E2F] text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F9F1E7]">
                  <th className="text-left py-4 px-6 text-base font-medium text-black rounded-l-[10px]">
                    Product
                  </th>
                  <th className="text-left py-4 px-6 text-base font-medium text-black">
                    Price
                  </th>
                  <th className="text-left py-4 px-6 text-base font-medium text-black">
                    Quantity
                  </th>
                  <th className="text-left py-4 px-6 text-base font-medium text-black">
                    Subtotal
                  </th>
                  <th className="py-4 px-2 rounded-r-[10px]"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <CartItemRow
                    key={`${item.id}-${item.size}-${item.color}`}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Column: Cart Totals */}
        <div className="w-full lg:w-[393px] shrink-0">
          <div className="bg-[#F9F1E7] rounded-[10px] px-[75px] py-[30px] flex flex-col">
            <h2 className="text-2xl font-semibold text-black mb-[57px]">
              Cart Totals
            </h2>

            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-medium text-black">Subtotal</span>
              <span className="text-base text-[#9F9F9F]">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-[36px]">
              <span className="text-base font-medium text-black">Total</span>
              <span className="text-xl font-medium text-[#B88E2F]">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <div className="flex justify-center">
              <Link href="/checkout">
                <button className="h-[58px] px-[72px] rounded-[15px] border border-black text-black text-base font-normal hover:bg-black hover:text-white transition-all">
                  Check Out
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeaturesBar />
    </main>
  );
}
