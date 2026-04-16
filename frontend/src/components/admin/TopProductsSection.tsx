"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Trophy, Package } from "lucide-react";
import { formatShortPrice } from "@/lib/utils";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

const rankColors = [
  "bg-amber-400 text-white",
  "bg-slate-400 text-white",
  "bg-orange-400 text-white",
  "bg-muted text-muted-foreground",
  "bg-muted text-muted-foreground",
];

const CustomDonutTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-md text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-muted-foreground">{payload[0].value}% of revenue</p>
      </div>
    );
  }
  return null;
};

export default function TopProductsSection() {
  const [data, setData] = useState({
    topProducts: [] as any[],
    categoryData: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await api.get("/dashboard/top-products");
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* === TOP SELLING PRODUCTS === */}
      <Card className="lg:col-span-2 border-border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Top Best-Selling Products
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Based on actual sales
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-[64px] rounded-xl" />
            ))
          ) : data.topProducts.length === 0 ? (
            <div className="text-sm text-center text-gray-500 py-6">
              No sales data yet.
            </div>
          ) : (
            data.topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                {/* Rank badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${rankColors[product.rank - 1] || "bg-muted text-muted-foreground"}`}
                >
                  {product.rank}
                </div>

                {/* Product icon placeholder */}
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Name + category + variant */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-[#B88E2F] font-medium truncate">
                    {product.variant}
                  </p>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#B88E2F]">
                    {formatShortPrice(product.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                     {product.sold} sold
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* === REVENUE BY CATEGORY (DONUT) === */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Category Share
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            % revenue by category
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-[200px]">
              <Skeleton className="w-[170px] h-[170px] rounded-full" />
            </div>
          ) : data.categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">
              No data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomDonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Legend */}
          <div className="w-full space-y-2 mt-1">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-full h-[20px] rounded" />
                ))
              : data.categoryData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-foreground truncate max-w-[120px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.value}%
                    </span>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
