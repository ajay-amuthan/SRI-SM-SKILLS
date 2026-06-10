"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ShopFilters({
  categories,
  currentParams,
}: {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => router.push("/shop");

  return (
    <>
      <button
        className="lg:hidden flex items-center gap-2 text-sm font-medium border border-border px-4 py-2"
        onClick={() => setOpen(!open)}
      >
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </button>

      <aside className={`lg:w-56 shrink-0 space-y-6 ${open ? "block" : "hidden lg:block"}`}>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => updateFilter("category", "")}
                className={`text-sm ${!currentParams.category ? "text-gold font-medium" : "text-muted hover:text-foreground"}`}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => updateFilter("category", cat.slug)}
                  className={`text-sm ${
                    currentParams.category === cat.slug
                      ? "text-gold font-medium"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Sort By</h3>
          <select
            value={currentParams.sort || ""}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
          >
            <option value="">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={currentParams.minPrice}
              onBlur={(e) => updateFilter("minPrice", e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              defaultValue={currentParams.maxPrice}
              onBlur={(e) => updateFilter("maxPrice", e.target.value)}
              className="w-full border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <button onClick={clearFilters} className="text-sm text-gold hover:underline">
          Clear All Filters
        </button>
      </aside>
    </>
  );
}
