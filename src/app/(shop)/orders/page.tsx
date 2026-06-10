import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export const metadata = { title: "My Orders" };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="text-gold hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.orderNumber}`}
              className="block border border-border p-6 hover:border-gold transition-colors"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-xs text-muted">{format(order.createdAt, "MMM dd, yyyy 'at' h:mm a")}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 font-medium ${statusColors[order.status] || ""}`}>
                    {order.status}
                  </span>
                  <span className={`text-xs px-2 py-1 font-medium ${
                    order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted mb-2">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </p>
              <p className="font-semibold">{formatPrice(order.total)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
