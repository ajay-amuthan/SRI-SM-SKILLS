import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { format, subMonths, startOfMonth } from "date-fns";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [totalRevenue, totalOrders, totalCustomers, totalProducts, recentOrders, orderItems] =
    await Promise.all([
      prisma.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 10,
        include: { items: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.orderItem.findMany({
        where: { order: { paymentStatus: "PAID" } },
        select: { name: true, quantity: true, price: true },
      }),
    ]);

  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(new Date(), i));
    const monthEnd = startOfMonth(subMonths(new Date(), i - 1));
    const revenue = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: { total: true },
    });
    monthlyRevenue.push({
      month: format(monthStart, "MMM yyyy"),
      revenue: revenue._sum.total || 0,
    });
  }

  const productMap = new Map<string, { sold: number; revenue: number }>();
  for (const item of orderItems) {
    const existing = productMap.get(item.name) || { sold: 0, revenue: 0 };
    existing.sold += item.quantity;
    existing.revenue += item.price * item.quantity;
    productMap.set(item.name, existing);
  }

  const topProducts = Array.from(productMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return NextResponse.json({
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    monthlyRevenue,
    topProducts,
  });
}
