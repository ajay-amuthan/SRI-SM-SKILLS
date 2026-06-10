"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductWithCategory } from "@/types";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data.map((item: { product: ProductWithCategory }) => item.product));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">Loading...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted mb-6">Save items you love for later!</p>
        <Link href="/shop"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">My Wishlist ({products.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
