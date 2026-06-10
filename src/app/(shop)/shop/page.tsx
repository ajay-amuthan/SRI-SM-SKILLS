import { getProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    featured?: string;
    newArrival?: string;
    bestSeller?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [result, categories] = await Promise.all([
    getProducts({
      category: params.category,
      search: params.search,
      featured: params.featured === "true",
      newArrival: params.newArrival === "true",
      bestSeller: params.bestSeller === "true",
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort,
      page,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const title = params.search
    ? `Search: ${params.search}`
    : params.newArrival
      ? "New Arrivals"
      : params.bestSeller
        ? "Best Sellers"
        : params.featured
          ? "Featured Products"
          : params.category
            ? categories.find((c) => c.slug === params.category)?.name || "Shop"
            : "All Products";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <p className="text-sm text-muted mt-1">{result.total} products found</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <ShopFilters categories={categories} currentParams={params} />
        <div className="flex-1">
          {result.products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted">No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {result.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {result.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/shop?${new URLSearchParams({ ...params, page: String(p) } as Record<string, string>).toString()}`}
                      className={`px-4 py-2 text-sm border ${
                        p === page
                          ? "bg-foreground text-white border-foreground"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
