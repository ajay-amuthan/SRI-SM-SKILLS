import { prisma } from "./prisma";
import { parseJsonArray } from "./utils";
import type { ProductWithCategory } from "@/types";

export function formatProduct(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  categoryId: string;
  images: string;
  sizes: string;
  colors: string;
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  category: { id: string; name: string; slug: string };
}): ProductWithCategory {
  return {
    ...product,
    images: parseJsonArray(product.images),
    sizes: parseJsonArray(product.sizes),
    colors: parseJsonArray(product.colors),
  };
}

export async function getProducts(filters?: {
  category?: string;
  excludeCategory?: string;
  search?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (filters?.category) {
    where.category = { slug: filters.category };
  } else if (filters?.excludeCategory) {
    where.category = { slug: { not: filters.excludeCategory } };
  }
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }
  if (filters?.featured) where.isFeatured = true;
  if (filters?.newArrival) where.isNewArrival = true;
  if (filters?.bestSeller) where.isBestSeller = true;
  if (filters?.minPrice || filters?.maxPrice) {
    where.price = {
      ...(filters.minPrice && { gte: filters.minPrice }),
      ...(filters.maxPrice && { lte: filters.maxPrice }),
    };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (filters?.sort === "price-asc") orderBy = { price: "asc" };
  if (filters?.sort === "price-desc") orderBy = { price: "desc" };
  if (filters?.sort === "rating") orderBy = { rating: "desc" };
  if (filters?.sort === "name") orderBy = { name: "asc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(formatProduct),
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) return null;
  return {
    ...formatProduct(product),
    reviews: product.reviews,
  };
}
