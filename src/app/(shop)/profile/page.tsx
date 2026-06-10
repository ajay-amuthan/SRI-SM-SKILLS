import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: { take: 5, orderBy: { createdAt: "desc" } },
      _count: { select: { orders: true, wishlistItems: true } },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      <div className="border border-border p-6 mb-6">
        <h2 className="font-semibold mb-4">Account Details</h2>
        <dl className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">Name</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted">Phone</dt>
            <dd className="font-medium">{user.phone || "Not set"}</dd>
          </div>
          <div>
            <dt className="text-muted">Member Since</dt>
            <dd className="font-medium">{format(user.createdAt, "MMM dd, yyyy")}</dd>
          </div>
        </dl>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-border p-6 text-center">
          <p className="text-2xl font-bold text-gold">{user._count.orders}</p>
          <p className="text-sm text-muted">Total Orders</p>
        </div>
        <div className="border border-border p-6 text-center">
          <p className="text-2xl font-bold text-gold">{user._count.wishlistItems}</p>
          <p className="text-sm text-muted">Wishlist Items</p>
        </div>
      </div>
      <div className="border border-border p-6">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        {user.orders.length === 0 ? (
          <p className="text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {user.orders.map((order) => (
              <a
                key={order.id}
                href={`/orders/${order.orderNumber}`}
                className="flex justify-between items-center text-sm border-b border-border pb-3 hover:text-gold"
              >
                <span>{order.orderNumber}</span>
                <span className="text-muted">{order.status}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
