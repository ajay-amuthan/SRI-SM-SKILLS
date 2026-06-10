import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { calculateDiscount, generateOrderNumber, parseJsonArray } from "@/lib/utils";
import { createRazorpayOrder } from "@/lib/razorpay";
import {
  createNotification,
  sendOrderConfirmationEmail,
  sendOrderConfirmationSMS,
} from "@/lib/notifications";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let discount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });
      if (coupon?.isActive && subtotal >= coupon.minOrder) {
        if (!coupon.expiresAt || coupon.expiresAt > new Date()) {
          if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
            discount = calculateDiscount(subtotal, coupon.discountType, coupon.discountValue);
          }
        }
      }
    }

    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal - discount + shipping;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
        status: "PENDING",
        subtotal,
        discount,
        shipping,
        total,
        couponCode: data.couponCode?.toUpperCase(),
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        shippingState: data.shippingState,
        shippingPincode: data.shippingPincode,
        notes: data.notes,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: parseJsonArray(item.product.images)[0] || null,
          })),
        },
      },
      include: { items: true },
    });

    if (data.couponCode) {
      await prisma.coupon.updateMany({
        where: { code: data.couponCode.toUpperCase() },
        data: { usedCount: { increment: 1 } },
      });
    }

    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

    if (data.paymentMethod === "COD") {
      await createNotification(
        session.user.id,
        "order",
        "Order Placed",
        `Your order ${orderNumber} has been placed successfully.`
      );
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (user) {
        await sendOrderConfirmationEmail(user.email, orderNumber, total);
        if (user.phone) await sendOrderConfirmationSMS(user.phone, orderNumber);
      }
      return NextResponse.json({ order, cod: true });
    }

    try {
      const razorpayOrder = await createRazorpayOrder(total, orderNumber);
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id },
      });
      return NextResponse.json({
        order,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch {
      return NextResponse.json(
        { error: "Payment gateway unavailable. Try COD.", order },
        { status: 503 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
