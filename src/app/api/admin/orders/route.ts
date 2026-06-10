import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id, status, paymentStatus, trackingNumber } = await req.json();

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(trackingNumber !== undefined && { trackingNumber }),
    },
    include: { items: true, user: { select: { name: true, email: true } } },
  });

  if (status) {
    await createNotification(
      order.userId,
      "order",
      "Order Update",
      `Your order ${order.orderNumber} status is now: ${status}${trackingNumber ? `. Tracking: ${trackingNumber}` : ""}`
    );
  }

  return NextResponse.json(order);
}
