import prisma from "../config/prisma";

export const getOverviewStats = async () => {
  const revenueAgg = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: "COMPLETED" },
  });
  const totalRevenue = revenueAgg._sum.totalAmount || 0;

  const totalOrders = await prisma.order.count({
    where: { status: { not: "CANCELLED" } },
  });

  const totalCustomers = await prisma.user.count({
    where: { role: "CUSTOMER" },
  });

  const totalProducts = await prisma.product.count();

  return {
    revenue: totalRevenue,
    orders: totalOrders,
    customers: totalCustomers,
    products: totalProducts,
  };
};

export const getAnalytics = async () => {
  const orders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    select: {
      createdAt: true,
      totalAmount: true,
      billingAddress: true,
      status: true,
    },
  });

  const now = new Date();

  const monthlyDataMap: Record<string, { revenue: number; orders: number }> =
    {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyDataMap[`T${d.getMonth() + 1}`] = { revenue: 0, orders: 0 };
  }

  const dailyDataMap: Record<string, { revenue: number; orders: number }> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    dailyDataMap[`${d.getDate()}/${d.getMonth() + 1}`] = {
      revenue: 0,
      orders: 0,
    };
  }

  const countryMap: Record<string, number> = {};
  let totalRevenue = 0;

  orders.forEach((order) => {
    const amount = order.totalAmount;
    const isCompleted = order.status === "COMPLETED";

    if (isCompleted) {
      totalRevenue += amount;
    }

    const orderDate = new Date(order.createdAt);

    const monthLabel = `T${orderDate.getMonth() + 1}`;
    if (monthlyDataMap[monthLabel] !== undefined) {
      monthlyDataMap[monthLabel].orders += 1;
      if (isCompleted) {
        monthlyDataMap[monthLabel].revenue += amount;
      }
    }

    const dayDiff = Math.floor(
      (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24),
    );
    if (dayDiff <= 11 && dayDiff >= 0) {
      const dayLabel = `${orderDate.getDate()}/${orderDate.getMonth() + 1}`;
      if (dailyDataMap[dayLabel] !== undefined) {
        dailyDataMap[dayLabel].orders += 1;
        if (isCompleted) {
          dailyDataMap[dayLabel].revenue += amount;
        }
      }
    }

    if (isCompleted) {
      const address = order.billingAddress as any;
      if (address && address.country) {
        const c = address.country;
        countryMap[c] = (countryMap[c] || 0) + amount;
      }
    }
  });

  const monthlyData = Object.keys(monthlyDataMap).map((k) => ({
    label: k,
    revenue: monthlyDataMap[k].revenue,
    orders: monthlyDataMap[k].orders,
  }));
  const dailyData = Object.keys(dailyDataMap).map((k) => ({
    label: k,
    revenue: dailyDataMap[k].revenue,
    orders: dailyDataMap[k].orders,
  }));

  const flagMap: Record<string, string> = {
    Vietnam: "🇻🇳",
    USA: "🇺🇸",
    "United States": "🇺🇸",
    "Sri Lanka": "🇱🇰",
    Japan: "🇯🇵",
    "South Korea": "🇰🇷",
    Australia: "🇦🇺",
  };

  const topCountries = Object.keys(countryMap)
    .map((k) => ({
      country: k,
      code: k.toLowerCase().slice(0, 2),
      flag: flagMap[k] || "🌍",
      revenue: countryMap[k],
      percent: totalRevenue > 0 ? (countryMap[k] / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return { monthlyData, dailyData, topCountries };
};

export const getRecentActivity = async () => {
  const lowStockVariants = await prisma.productVariant.findMany({
    where: { stock: { lt: 6 } },
    include: { product: { select: { name: true } } },
    orderBy: { stock: "asc" },
    take: 10,
  });

  const lowStockItems = lowStockVariants.map((v) => {
    const variantName = [v.color, v.size].filter(Boolean).join(" / ");
    return {
      id: v.id,
      name: v.product.name,
      variant: variantName || "Mặc định",
      stock: v.stock,
      level: v.stock <= 2 ? "critical" : "warning",
    };
  });

  const recentDbOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: { select: { name: true } } },
  });

  const recentOrders = recentDbOrders.map((o) => {
    const shortId = `#FNR-${o.id.split("-")[0].toUpperCase()}`;
    return {
      id: shortId,
      customer: o.user.name,
      amount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt,
    };
  });

  return { lowStockItems, recentOrders };
};

export const getTopProducts = async () => {
  const orderItems = await prisma.orderItem.findMany({
    where: { order: { status: { not: "CANCELLED" } } },
    include: { product: { include: { category: true } }, variant: true },
  });

  const variantStats: Record<
    string,
    { id: string; name: string; variant: string; sold: number; revenue: number }
  > = {};
  const categoryStats: Record<string, number> = {};
  let totalRevenue = 0;

  orderItems.forEach((item) => {
    const revenue = item.priceAtPurchase * item.quantity;
    const vName =
      `${item.variant.color || ""} / ${item.variant.size || ""}`.replace(
        /^ \/ | \/ $/,
        "",
      );

    if (!variantStats[item.variantId]) {
      variantStats[item.variantId] = {
        id: item.variantId,
        name: item.product.name,
        variant: vName || "Standard",
        sold: 0,
        revenue: 0,
      };
    }
    variantStats[item.variantId].sold += item.quantity;
    variantStats[item.variantId].revenue += revenue;

    const catName = item.product?.category?.name || "Khác";
    categoryStats[catName] = (categoryStats[catName] || 0) + revenue;
    totalRevenue += revenue;
  });

  const topProducts = Object.values(variantStats)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)
    .map((p, index) => ({ rank: index + 1, ...p }));

  const colors = ["#B88E2F", "#3b82f6", "#22c55e", "#f97316", "#a855f7"];
  const categoryData = Object.keys(categoryStats)
    .sort((a, b) => categoryStats[b] - categoryStats[a])
    .slice(0, 5)
    .map((cat, index) => ({
      name: cat,
      value:
        totalRevenue > 0
          ? Number(((categoryStats[cat] / totalRevenue) * 100).toFixed(1))
          : 0,
      color: colors[index % colors.length],
    }));

  return { topProducts, categoryData };
};
