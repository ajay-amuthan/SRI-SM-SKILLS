import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { orders: true } },
      orders: {
        select: { total: true, paymentStatus: true },
        where: { paymentStatus: "PAID" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = customers.map((c) => ({
    ...c,
    totalSpent: c.orders.reduce((sum, o) => sum + o.total, 0),
    orders: undefined,
  }));

  return NextResponse.json(formatted);
}
