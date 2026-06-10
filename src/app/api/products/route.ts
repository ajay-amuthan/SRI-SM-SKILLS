import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const result = await getProducts({
    category: searchParams.get("category") || undefined,
    search: searchParams.get("search") || undefined,
    featured: searchParams.get("featured") === "true",
    newArrival: searchParams.get("newArrival") === "true",
    bestSeller: searchParams.get("bestSeller") === "true",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sort: searchParams.get("sort") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
  });

  return NextResponse.json(result);
}
