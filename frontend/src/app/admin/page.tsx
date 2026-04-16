import RevenueSection from "@/components/admin/RevenueSection";
import GoalAndOrderSection from "@/components/admin/GoalAndOrderSection";
import TopProductsSection from "@/components/admin/TopProductsSection";
import RecentActivitySection from "@/components/admin/RecentActivitySection";
import OverviewStats from "@/components/admin/OverviewStats";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome to Furniro Admin
        </p>
      </div>

      {/* Row 1 — Stats Grid */}
      <OverviewStats />

      {/* Row 2 — Biểu đồ Doanh thu (2/3) + Top Countries (1/3) */}
      <RevenueSection />

      {/* Row 3 — Mục tiêu tháng (1/3) + Biểu đồ Đơn hàng (2/3) */}
      <GoalAndOrderSection />

      {/* Row 4 — Top Sản phẩm (2/3) + Donut Danh mục (1/3) */}
      <TopProductsSection />

      {/* Row 5 — Cảnh báo Tồn kho (1/2) + Đơn hàng gần đây (1/2) */}
      <RecentActivitySection />
    </div>
  );
}
