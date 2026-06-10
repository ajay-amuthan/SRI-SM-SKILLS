import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = reviewSchema.parse(body);

    const review = await prisma.review.upsert({
      where: {
        userId_productId: { userId: session.user.id, productId: data.productId },
      },
      create: {
        userId: session.user.id,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
      update: { rating: data.rating, comment: data.comment },
      include: { user: { select: { name: true, image: true } } },
    });

    const stats = await prisma.review.aggregate({
      where: { productId: data.productId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: data.productId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
