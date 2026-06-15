import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
          stock: true,
          category: { select: { slug: true } },
        },
      },
    },
  });

  const formatted = items.map((item) => ({
    ...item,
    product: { ...item.product, images: parseJsonArray(item.product.images) },
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity = 1, size, color } = await req.json();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const existing = await prisma.cartItem.findFirst({
    where: { userId: session.user.id, productId, size: size || null, color: color || null },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
    return NextResponse.json(updated);
  }

  const item = await prisma.cartItem.create({
    data: {
      userId: session.user.id,
      productId,
      quantity,
      size,
      color,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, quantity } = await req.json();

  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true });
  }

  const item = await prisma.cartItem.update({
    where: { id, userId: session.user.id },
    data: { quantity },
  });

  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    await prisma.cartItem.delete({ where: { id, userId: session.user.id } });
  } else {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
  }

  return NextResponse.json({ success: true });
}
