import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format, subMonths, startOfMonth } from "date-fns";
import { IndianRupee, ShoppingCart, Users, Package } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const [revenue, orders, customers, products, recentOrders] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.findMany({ take: 5, include: { items: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const start = startOfMonth(subMonths(new Date(), i));
    const end = startOfMonth(subMonths(new Date(), i - 1));
    const rev = await prisma.order.aggregate({
      where: { paymentStatus: "PAID", createdAt: { gte: start, lt: end } },
      _sum: { total: true },
    });
    monthlyRevenue.push({ month: format(start, "MMM"), revenue: rev._sum.total || 0 });
  }

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);

  const stats = [
    { label: "Total Revenue", value: formatPrice(revenue._sum.total || 0), icon: IndianRupee, color: "text-gold" },
    { label: "Total Orders", value: orders.toString(), icon: ShoppingCart, color: "text-blue-600" },
    { label: "Customers", value: customers.toString(), icon: Users, color: "text-green-600" },
    { label: "Products", value: products.toString(), icon: Package, color: "text-purple-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border p-6">
          <h2 className="font-semibold mb-4">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-40">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gold rounded-t transition-all"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: m.revenue > 0 ? "4px" : "0" }}
                />
                <span className="text-xs text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border p-6">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center text-sm border-b border-border pb-2">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted">{order.status} | {order.paymentStatus}</p>
                </div>
                <span className="font-semibold">{formatPrice(order.total)}</span>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-sm text-muted">No orders yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
