import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { formatProduct } from "@/lib/products";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const products = await prisma.product.findMany({
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map(formatProduct));
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        categoryId: data.categoryId,
        images: JSON.stringify(data.images),
        sizes: JSON.stringify(data.sizes),
        colors: JSON.stringify(data.colors),
        stock: data.stock,
        isFeatured: data.isFeatured ?? false,
        isNewArrival: data.isNewArrival ?? false,
        isBestSeller: data.isBestSeller ?? false,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json(formatProduct(product), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const { id, ...rest } = body;
    const data = productSchema.partial().parse(rest);

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name, slug: slugify(data.name) }),
        ...(data.description && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.comparePrice !== undefined && { comparePrice: data.comparePrice }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.images && { images: JSON.stringify(data.images) }),
        ...(data.sizes && { sizes: JSON.stringify(data.sizes) }),
        ...(data.colors && { colors: JSON.stringify(data.colors) }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.isNewArrival !== undefined && { isNewArrival: data.isNewArrival }),
        ...(data.isBestSeller !== undefined && { isBestSeller: data.isBestSeller }),
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json(formatProduct(product));
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
