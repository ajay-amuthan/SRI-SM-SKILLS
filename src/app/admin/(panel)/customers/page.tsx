"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: { orders: number };
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch("/api/admin/customers").then((r) => r.json()).then(setCustomers);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Orders</th>
              <th className="text-left p-4">Total Spent</th>
              <th className="text-left p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-muted">{c.email}</td>
                <td className="p-4 text-muted">{c.phone || "-"}</td>
                <td className="p-4">{c._count.orders}</td>
                <td className="p-4">{formatPrice(c.totalSpent)}</td>
                <td className="p-4 text-muted">{format(new Date(c.createdAt), "MMM dd, yyyy")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
