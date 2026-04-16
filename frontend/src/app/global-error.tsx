"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

// global-error.tsx phải có layout riêng vì nó thay thế RootLayout khi gặp lỗi nghiêm trọng
// Không thể dùng Toaster ở đây vì RootLayout (chứa Toaster) bị bypass
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Furniro CRITICAL ERROR]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#F9F1E7] font-sans px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full flex flex-col items-center gap-6 text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>

          {/* Logo chữ */}
          <span className="text-2xl font-extrabold tracking-widest text-[#B88E2F]">
            FURNIRO
          </span>

          <div>
            <h1 className="text-2xl font-bold text-[#3A3A3A]">Critical System Error</h1>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              The application has encountered an unrecoverable error. Please try reloading the page.
            </p>
            {process.env.NODE_ENV === "development" && error?.message && (
              <p className="mt-3 text-xs text-red-400 font-mono bg-red-50 p-3 rounded-lg text-left break-words">
                {error.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 bg-[#B88E2F] hover:bg-[#a07b28] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
            <a
              href="/"
              className="flex-1 flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
