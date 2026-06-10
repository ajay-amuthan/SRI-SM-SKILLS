import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPayment } from "@/lib/razorpay";
import {
  createNotification,
  sendOrderConfirmationEmail,
  sendOrderConfirmationSMS,
  sendPaymentStatusUpdate,
} from "@/lib/notifications";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    await req.json();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const isValid = verifyRazorpayPayment(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  if (!isValid) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" },
    });
    await sendPaymentStatusUpdate(session.user.id, order.orderNumber, "FAILED");
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayPaymentId,
    },
    include: { items: true },
  });

  await createNotification(
    session.user.id,
    "order",
    "Payment Successful",
    `Payment for order ${order.orderNumber} was successful. Your order is confirmed!`
  );

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user) {
    await sendOrderConfirmationEmail(user.email, order.orderNumber, order.total);
    if (user.phone) await sendOrderConfirmationSMS(user.phone, order.orderNumber);
  }

  return NextResponse.json({ success: true, order: updated });
}
