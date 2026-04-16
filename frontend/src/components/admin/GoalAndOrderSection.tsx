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
import { formatPrice } from "@/lib/utils";

const TARGET_AMOUNT = 500000000; // 500M

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-md">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#B88E2F]">
          {payload[0].value} order{payload[0].value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

// SVG Gauge Component
function GaugeChart({
  current,
  target,
  previous,
}: {
  current: number;
  target: number;
  previous: number;
}) {
  const percent = Math.min((current / target) * 100, 100);

  // Biến động % so với tháng trước
  let growthPercent = 0;
  if (previous > 0) {
    growthPercent = ((current - previous) / previous) * 100;
  } else if (current > 0) {
    growthPercent = 100; // Nếu tháng trước = 0 mà tháng này có doanh thu
  }

  const isPositiveGrowth = growthPercent >= 0;

  return (
    <div className="flex flex-col items-center">
      {/* Khối Vẽ SVG Gauge */}
      <div className="relative w-full max-w-[280px] aspect-[2/1.1] overflow-hidden flex justify-center items-end mt-2">
        <svg viewBox="0 0 200 110" className="w-[85%] h-full overflow-visible">
          {/* Background Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="#fdebc8"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Foreground Arc */}
          <path
            d="M 10 90 A 80 80 0 0 1 190 90"
            fill="none"
            stroke="#B88E2F"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (percent / 100) * 251.2}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Text ở giữa vòng cung */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-[36px] font-bold text-gray-800 leading-none">
            {percent.toFixed(0)}%
          </span>
          <span
            className={`text-sm font-semibold mt-1 ${isPositiveGrowth ? "text-green-500" : "text-red-500"} bg-white/80 px-1 rounded`}
          >
            {isPositiveGrowth ? "+" : ""}
            {growthPercent.toFixed(2)}%{" "}
            <span className="text-gray-400 font-normal">vs last month</span>
          </span>
        </div>
      </div>

      {/* Lời động viên */}
      <div className="mt-8 text-center px-4">
        <p className="text-[13px] text-gray-500 font-medium">
          Our revenue has reached{" "}
          <span className="font-semibold text-[#B88E2F]">
            {formatPrice(current)}
          </span>
          <br />
          reach 100% this month
        </p>
      </div>

      {/* 2 Cột Mục Tiêu / Doanh Thu */}
      <div className="mt-8 w-full flex justify-between border-t border-border pt-5 px-4 mb-2">
        <div className="flex flex-col border-r w-1/2 items-center">
          <span className="text-sm text-[#B88E2F] font-medium mb-1">
            Target
          </span>
          <span className="text-[15px] font-bold text-gray-800">
            {formatPrice(target)}
          </span>
        </div>
        <div className="flex flex-col w-1/2 items-center">
          <span className="text-sm text-[#B88E2F] font-medium mb-1">
            Revenue
          </span>
          <span className="text-[15px] font-bold text-gray-800">
            {formatPrice(current)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GoalAndOrderSection() {
  const [orderMode, setOrderMode] = useState<"monthly" | "daily">("monthly");

  const [analytics, setAnalytics] = useState({
    monthlyData: [] as any[],
    dailyData: [] as any[],
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

  const orderData =
    orderMode === "monthly" ? analytics.monthlyData : analytics.dailyData;

  // Lấy data tháng hiện tại và tháng trước (2 phần tử cuối của monthlyData)
  const len = analytics.monthlyData.length;
  const currentMonthData =
    len > 0 ? analytics.monthlyData[len - 1] : { revenue: 0 };
  const prevMonthData =
    len > 1 ? analytics.monthlyData[len - 2] : { revenue: 0 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* === MỤC TIÊU THÁNG === */}
      <Card className="border-border shadow-sm flex flex-col justify-center">
        <CardHeader className="pb-0 flex-none items-center text-center">
          <CardTitle className="text-[17px] font-bold text-[#B88E2F]">
            Monthly Target
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-4 flex-1 flex items-center justify-center">
          {loading ? (
            <div className="w-full flex justify-center items-center h-[280px]">
              <Skeleton className="w-[180px] h-[90px] rounded-t-[90px]" />
            </div>
          ) : (
            <div className="w-full">
              <GaugeChart
                current={currentMonthData.revenue}
                target={TARGET_AMOUNT}
                previous={prevMonthData.revenue}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* === BIỂU ĐỒ ĐƠN HÀNG === */}
      <Card className="lg:col-span-2 border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">
            Orders Over Time
          </CardTitle>
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            <button
              onClick={() => setOrderMode("monthly")}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                orderMode === "monthly"
                  ? "bg-white text-[#B88E2F] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setOrderMode("daily")}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                orderMode === "daily"
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
                data={orderData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="orderGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                  tick={{ fontSize: 11, fill: "#9f9f9f" }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#orderGradient)"
                  dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: "#3b82f6",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
