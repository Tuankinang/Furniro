"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, Users, TrendingUp } from "lucide-react";
import api from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewStats() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Revenue",
      value: formatPrice(stats.revenue),
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Orders",
      value: `${stats.orders} order${stats.orders !== 1 ? "s" : ""}`,
      icon: ShoppingBag,
      color: "text-[#B88E2F]",
      bg: "bg-[#F9F1E7]",
    },
    {
      title: "Customers",
      value: `${stats.customers} customer${stats.customers !== 1 ? "s" : ""}`,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Products",
      value: `${stats.products} type${stats.products !== 1 ? "s" : ""}`,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-9 w-2/3 mb-2" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
