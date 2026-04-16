"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100/50 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Admin Panel Error
      </h2>
      <p className="text-gray-500 mb-6 max-w-[400px]">
        Something went wrong while loading this page or component. You can try reloading or taking a step back.
      </p>
      
      {process.env.NODE_ENV === "development" && error?.message && (
        <div className="w-full max-w-[600px] mb-8 bg-black/5 p-4 rounded-xl text-left border border-black/10">
          <p className="font-mono text-sm text-red-600 break-words">
            {error.message}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-[#B88E2F] hover:bg-[#a07b28] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry action
        </button>
        <button
          onClick={() => window.location.href = "/admin"}
          className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
