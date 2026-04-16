"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShoppingCart, Package } from "lucide-react";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
};

export default function RecentActivitySection() {
  const [data, setData] = useState({
    lowStockItems: [] as any[],
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/recent-activity");
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* === STOCK ALERTS === */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Low Stock Alert
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Products running low (stock &lt; 6)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-[60px] rounded-xl" />
            ))
          ) : data.lowStockItems.length === 0 ? (
            <div className="text-sm text-center text-gray-500 py-6">
            No low stock alerts.
            </div>
          ) : (
            data.lowStockItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                  item.level === "critical"
                    ? "bg-red-50 border-red-100"
                    : "bg-amber-50 border-amber-100"
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.level === "critical" ? "bg-red-100" : "bg-amber-100"
                  }`}
                >
                  <Package
                    className={`w-4 h-4 ${
                      item.level === "critical"
                        ? "text-red-500"
                        : "text-amber-500"
                    }`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.variant}
                  </p>
                </div>

                {/* Stock badge */}
                <div
                  className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                    item.level === "critical"
                      ? "bg-red-500 text-white"
                      : "bg-amber-400 text-white"
                  }`}
                >
                  {item.stock} left
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* === RECENT ORDERS === */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#F9F1E7]">
                <ShoppingCart className="w-5 h-5 text-[#B88E2F]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Recent Orders
                </CardTitle>
                <p className="text-xs text-muted-foreground">Latest 5 orders</p>
              </div>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#B88E2F] hover:underline font-medium"
            >
              View all →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-[60px] rounded-xl" />
            ))
          ) : data.recentOrders.length === 0 ? (
            <div className="text-sm text-center text-gray-500 py-6">
            No orders yet.
            </div>
          ) : (
            data.recentOrders.map((order) => {
              const s = statusConfig[order.status] ?? statusConfig["PENDING"];
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors"
                >
                  {/* Order ID + time */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground font-mono">
                      {order.id}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.customer} · {formatTimeAgo(order.createdAt)}
                    </p>
                  </div>

                  {/* Amount */}
                  <p className="text-sm font-semibold text-foreground shrink-0 text-right min-w-[100px]">
                    {formatPrice(order.amount)}
                  </p>

                  {/* Status badge */}
                  <div className="w-[100px] flex justify-end">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 text-center w-full ${s.className}`}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
