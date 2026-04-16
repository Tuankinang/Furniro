"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export default function CartSidebar() {
  const { isOpen, closeCart, items, removeItem } = useCartStore();

  // Tính tổng tiền tự động
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      {/* Lớp phủ đen (Overlay) - Bấm vào đây để đóng */}
      {isOpen && (
        <div 
          onClick={closeCart} 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity" 
        />
      )}

      {/* Thanh trượt Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[417px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8">
          <h2 className="text-2xl font-semibold">Shopping Cart</h2>
          <button onClick={closeCart}>
            <X className="w-5 h-5 text-[#9F9F9F] hover:text-black transition-colors" />
          </button>
        </div>
        
        <div className="w-4/5 mx-auto border-b border-[#D9D9D9]"></div>

        {/* Danh sách sản phẩm */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-5">
          {items.length === 0 ? (
            <p className="text-center text-[#9F9F9F] mt-10">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-8">
                {/* Ảnh */}
                <div className="w-[105px] h-[105px] bg-[#F9F1E7] rounded-[10px] overflow-hidden relative shrink-0">
                  <Image src={item.image} fill className="object-cover" alt={item.name} />
                </div>
                
                {/* Thông tin */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-normal line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-[#9F9F9F] mt-1">{item.size} | {item.color}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-base">{item.quantity}</span>
                    <span className="text-xs">X</span>
                    <span className="text-[#B88E2F] font-medium text-xs">{formatPrice(item.price)}</span>
                  </div>
                </div>

                {/* Nút Xóa */}
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="w-[20px] h-[20px] bg-[#9F9F9F] hover:bg-red-500 rounded-full flex items-center justify-center text-white shrink-0 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer (Tính tiền & Nút điều hướng) */}
        <div className="p-8 mt-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-base font-normal">Subtotal</span>
            <span className="text-base font-semibold text-[#B88E2F]">{formatPrice(subtotal)}</span>
          </div>
          <div className="w-full border-b border-[#D9D9D9] mb-6"></div>
          
          <div className="flex justify-between gap-3">
            <Link href="/cart" onClick={closeCart} className="flex-1 py-[6px] text-center border border-black rounded-[50px] text-[12px] hover:bg-black hover:text-white transition-colors">
              Cart
            </Link>
            <Link href="/checkout" onClick={closeCart} className="flex-1 py-[6px] text-center border border-black rounded-[50px] text-[12px] hover:bg-black hover:text-white transition-colors">
              Checkout
            </Link>
            <Link href="/comparison" onClick={closeCart} className="flex-1 py-[6px] text-center border border-black rounded-[50px] text-[12px] hover:bg-black hover:text-white transition-colors">
              Comparison
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}