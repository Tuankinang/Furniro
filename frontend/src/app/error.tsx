"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Phân loại và hiển thị thông báo lỗi phù hợp qua toast
    const message = error?.message || "";

    if (
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("Network") ||
      message.includes("ECONNREFUSED")
    ) {
      toast.error("Cannot connect to the server. Please check your network!", {
        duration: 5000,
      });
    } else if (
      message.includes("401") ||
      message.includes("Unauthorized") ||
      message.includes("unauthorized")
    ) {
      toast.error("Your session has expired. Please log in again!", {
        duration: 5000,
      });
    } else if (
      message.includes("403") ||
      message.includes("Forbidden") ||
      message.includes("forbidden")
    ) {
      toast.error("You do not have permission to access this page!", {
        duration: 5000,
      });
    } else if (message.includes("404") || message.includes("Not found")) {
      toast.error("The requested resource was not found!", {
        duration: 5000,
      });
    } else {
      toast.error("An unexpected error occurred. Please try again!", {
        duration: 5000,
      });
    }

    // Log lỗi để debug
    console.error("[Furniro Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F1E7] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* Tiêu đề */}
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Oops, something went wrong!</h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            An unexpected error occurred. You can try reloading the page or
            return to the homepage.
          </p>
          {process.env.NODE_ENV === "development" && error?.message && (
            <p className="mt-3 text-xs text-red-400 font-mono bg-red-50 p-3 rounded-lg text-left break-words">
              {error.message}
            </p>
          )}
        </div>

        {/* Nút thao tác */}
        <div className="flex gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 bg-[#B88E2F] hover:bg-[#a07b28] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <a
            href="/"
            className="flex-1 flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
