import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDiscount } from "@/lib/utils";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json();

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
  }

  if (subtotal < coupon.minOrder) {
    return NextResponse.json(
      { error: `Minimum order of ₹${coupon.minOrder} required` },
      { status: 400 }
    );
  }

  const discount = calculateDiscount(subtotal, coupon.discountType, coupon.discountValue);

  return NextResponse.json({
    code: coupon.code,
    discount,
    description: coupon.description,
  });
}
