"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import OrderCardSkeleton from "@/components/ui/OrderCardSkeleton";
import FeaturesBar from "@/components/ui/FeaturesBar";

export default function OrdersHistoryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!user) {
      toast.error("Please log in to view your order history!");
      window.location.href = "/login";
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error loading order history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, mounted]);

  const renderStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="flex items-center gap-1 text-[#B88E2F] bg-[#F9F1E7] px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" /> Pending Review
          </span>
        );
      case "PROCESSING":
        return (
          <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
            <Package className="w-4 h-4" /> Processing
          </span>
        );
      case "SHIPPED":
        return (
          <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm font-medium">
            <Package className="w-4 h-4" /> Shipped
          </span>
        );
      case "DELIVERED":
        return (
          <span className="flex items-center gap-1 text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Delivered
          </span>
        );
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" /> Cancelled
          </span>
        );
      default:
        return <span className="text-gray-500">{status}</span>;
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const res = await api.patch(`/orders/${orderId}/complete`);
      if (res.data.success) {
        toast.success("Order receipt confirmed successfully!");
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: "COMPLETED" } : o,
          ),
        );
      }
    } catch (error) {
      toast.error("An error occurred while confirming order receipt");
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="w-full bg-white">
      {/* 1. BANNER & BREADCRUMB */}
      <section className="relative w-full h-[316px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/shop-hero.png"
            alt="Orders Banner"
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
            Order History
          </h1>
          <div className="flex items-center gap-2 text-base">
            <Link href="/" className="font-medium hover:text-[#B88E2F]">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-light">Orders</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-16 lg:px-[72px] pt-[60px] pb-[100px]">
        {isLoading ? (
          <div className="flex flex-col gap-6">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#F9F1E7]/50 p-16 rounded-xl border border-[#F9F1E7] flex flex-col items-center justify-center gap-4 text-center">
            <Package className="w-16 h-16 text-[#B88E2F] mb-2 opacity-80" />
            <h2 className="text-2xl font-medium text-black">
              You have no orders yet.
            </h2>
            <Link
              href="/shop"
              className="mt-4 h-[64px] px-10 border border-black text-black hover:bg-black hover:text-white rounded-[15px] text-xl transition-all flex items-center justify-center"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border rounded-[10px] shadow-sm overflow-hidden border-[#D9D9D9]"
              >
                {/* Order Header */}
                <div className="bg-[#F9F1E7]/30 px-6 py-4 border-b border-[#D9D9D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#9F9F9F]">
                      Order ID:{" "}
                      <span className="text-black font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm text-[#9F9F9F]">
                      Order Date:{" "}
                      <span className="text-black">
                        {new Date(order.createdAt).toLocaleDateString("en-US")}
                      </span>
                    </p>
                  </div>
                  <div>{renderStatus(order.status)}</div>
                </div>

                <div className="px-6 py-6 flex flex-col gap-6">
                  {order.items.map((item: any) => {
                    const variantIndex =
                      item.product?.variants?.findIndex(
                        (v: any) => v.color === item.variant?.color,
                      ) ?? -1;

                    const imageUrl =
                      item.product?.images[variantIndex]?.url ||
                      item.product?.images?.find((img: any) => img.isDefault)
                        ?.url ||
                      item.product?.images?.[0]?.url ||
                      "/images/placeholder.png";

                    return (
                      <div key={item.id} className="flex items-center gap-6">
                        <div className="w-[105px] h-[105px] bg-[#F9F1E7] rounded-[10px] overflow-hidden relative shrink-0">
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-normal text-black mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-[#9F9F9F]">
                            Variant: {item.variant.size} -{" "}
                            {item.variant.color}
                          </p>
                          <p className="text-sm text-[#9F9F9F]">
                            x{item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-normal text-black">
                            {formatPrice(item.priceAtPurchase)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer */}
                <div className="bg-[#F9F1E7]/30 px-6 py-5 border-t border-[#D9D9D9] flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-[#9F9F9F]">
                    Payment method:{" "}
                    <span className="font-medium text-black">
                      {order.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : "Bank Transfer"}
                    </span>
                  </p>
                  <div className="flex items-center gap-6">
                    {order.status === "DELIVERED" && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="px-6 h-[48px] bg-[#B88E2F] text-white rounded-[10px] text-lg hover:bg-[#a07b28] transition-colors"
                      >
                        I've received my order
                      </button>
                    )}
                    <div className="text-right">
                      <p className="text-sm text-[#9F9F9F]">Total</p>
                      <p className="text-2xl font-bold text-[#B88E2F]">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <FeaturesBar />
    </main>
  );
}
