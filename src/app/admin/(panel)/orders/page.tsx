"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  trackingNumber: string | null;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () =>
    fetch("/api/admin/orders").then((r) => r.json()).then(setOrders);

  useEffect(() => { fetchOrders(); }, []);

  const updateOrder = async (id: string, data: Record<string, string>) => {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    if (res.ok) {
      toast.success("Order updated");
      fetchOrders();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-border p-6">
            <div className="flex flex-wrap justify-between gap-4 mb-4">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-muted">{order.user.name} ({order.user.email})</p>
                <p className="text-xs text-muted">{format(new Date(order.createdAt), "MMM dd, yyyy h:mm a")}</p>
              </div>
              <p className="font-bold text-lg">{formatPrice(order.total)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={order.status}
                onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                className="border border-border px-3 py-1.5 text-sm"
              >
                {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={order.paymentStatus}
                onChange={(e) => updateOrder(order.id, { paymentStatus: e.target.value })}
                className="border border-border px-3 py-1.5 text-sm"
              >
                {["PENDING", "PAID", "FAILED", "REFUNDED"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input
                placeholder="Tracking number"
                defaultValue={order.trackingNumber || ""}
                onBlur={(e) => {
                  if (e.target.value !== (order.trackingNumber || "")) {
                    updateOrder(order.id, { trackingNumber: e.target.value });
                  }
                }}
                className="border border-border px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
      </div>
    </div>
  );
}
