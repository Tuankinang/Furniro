"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatShortPrice } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-md">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#B88E2F]">
          {formatPrice(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function RevenueSection() {
  const [mode, setMode] = useState<"monthly" | "daily">("monthly");
  const [analytics, setAnalytics] = useState({
    monthlyData: [],
    dailyData: [],
    topCountries: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/dashboard/analytics");
        if (res.data.success) {
          setAnalytics(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const data = mode === "monthly" ? analytics.monthlyData : analytics.dailyData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* === REVENUE CHART === */}
      <Card className="lg:col-span-2 border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">
            Revenue Over Time
          </CardTitle>
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            <button
              onClick={() => setMode("monthly")}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                mode === "monthly"
                  ? "bg-white text-[#B88E2F] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setMode("daily")}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                mode === "daily"
                  ? "bg-white text-[#B88E2F] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Daily
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="w-full h-[280px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={data}
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#B88E2F" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B88E2F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0ebe2"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#9f9f9f" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatShortPrice}
                  tick={{ fontSize: 11, fill: "#9f9f9f" }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#B88E2F"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={{ r: 3, fill: "#B88E2F", strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: "#B88E2F",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* === TOP COUNTRIES BY SALES === */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Top Countries By Sales
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Revenue by country
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))
          ) : analytics.topCountries.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
              No transaction data yet
            </div>
          ) : (
            analytics.topCountries.map((item: any) => (
              <div key={item.code}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.country}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#B88E2F]">
                    {formatShortPrice(item.revenue)}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B88E2F] rounded-full transition-all duration-700"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
