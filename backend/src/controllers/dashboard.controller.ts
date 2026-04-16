import * as dashboardService from "../services/dashboard.service";
import { catchAsync } from "../utils/catchAsync";

// Lấy số liệu tổng quan (Doanh thu, Đơn hàng, Khách hàng, Sản phẩm)
export const getOverviewStats = catchAsync(async (req, res) => {
  const data = await dashboardService.getOverviewStats();
  res.status(200).json({ success: true, data });
});

// Lấy dữ liệu biểu đồ (Tháng, Ngày, Quốc gia)
export const getAnalytics = catchAsync(async (req, res) => {
  const data = await dashboardService.getAnalytics();
  res.status(200).json({ success: true, data });
});

// Lấy hoạt động gần đây (Sản phẩm sắp hết hàng, Đơn hàng mới)
export const getRecentActivity = catchAsync(async (req, res) => {
  const data = await dashboardService.getRecentActivity();
  res.status(200).json({ success: true, data });
});

// Lấy top sản phẩm bán chạy và tỷ lệ danh mục
export const getTopProducts = catchAsync(async (req, res) => {
  const data = await dashboardService.getTopProducts();
  res.status(200).json({ success: true, data });
});
