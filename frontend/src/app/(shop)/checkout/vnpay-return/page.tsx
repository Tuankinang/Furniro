"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";

function VnpayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Gom tất cả parameters trên URL thành một object
        const params = Object.fromEntries(searchParams.entries());

        // Gọi API Backend để xác thực
        const response = await api.get("/orders/vnpay-return", { params });

        if (response.data.success) {
          setStatus("success");
          setMessage(
            "Payment successful! Your order is being processed.",
          );
          clearCart(); // Dọn giỏ hàng trên giao diện (Zustand)
        } else {
          setStatus("error");
          setMessage(response.data.message || "Payment failed.");
        }
      } catch (error: any) {
        setStatus("error");
        setMessage("Transaction verification failed or transaction was cancelled.");
      }
    };

    if (searchParams.toString()) {
      verifyPayment();
    }
  }, [searchParams, clearCart]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]"></div>
        <p className="mt-4 text-lg text-gray-500">
          Verifying VNPAY transaction...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-[500px] w-full">
        {status === "success" ? (
          <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        ) : (
          <XCircle className="w-20 h-20 text-red-500 mb-6" />
        )}

        <h1 className="text-2xl font-bold text-black mb-4">
          {status === "success"
            ? "Payment successful!"
            : "Payment failed"}
        </h1>
        <p className="text-gray-500 mb-8">{message}</p>

        <div className="flex gap-4 w-full">
          <Link
            href="/profile/orders"
            className="flex-1 px-6 py-3 bg-[#F9F1E7] text-black font-medium rounded-xl hover:bg-[#e8dfd3] transition-all"
          >
            View orders
          </Link>
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-[#B88E2F] text-white font-medium rounded-xl hover:bg-[#a07b28] transition-all"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Bắt buộc phải bọc trong Suspense ở Next.js 13+ khi dùng useSearchParams
export default function VnpayReturnPage() {
  return (
    <main className="w-full bg-gray-50">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <VnpayReturnContent />
      </Suspense>
    </main>
  );
}
