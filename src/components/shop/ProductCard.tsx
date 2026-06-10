"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: ProductWithCategory;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.status === 401) {
        toast.error("Please login to add to wishlist");
        return;
      }
      const data = await res.json();
      setWishlisted(data.added);
      toast.success(data.added ? "Added to wishlist" : "Removed from wishlist");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          size: product.sizes[0],
          color: product.colors[0],
        }),
      });
      if (res.status === 401) {
        toast.error("Please login to add to cart");
        return;
      }
      toast.success("Added to cart");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-card aspect-[3/4]">
        <Image
          src={product.images[0] || "https://images.unsplash.com/photo-1441984904996-e0b6b687ef1e?w=600&q=80"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-gold px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-3 right-3 bg-foreground px-2 py-1 text-xs font-semibold text-white">
            NEW
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 bg-white/95 p-3 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-1.5 bg-foreground py-2 text-xs font-medium text-white transition-colors hover:bg-gold"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add to Cart
          </button>
          <button
            onClick={handleWishlist}
            className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:border-gold hover:text-gold"
          >
            <Heart className={`h-4 w-4 ${wishlisted ? "fill-gold text-gold" : ""}`} />
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs uppercase tracking-wider text-muted">{product.category.name}</p>
        <h3 className="text-sm font-medium leading-tight group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-gold text-gold" />
          <span className="text-xs text-muted">{product.rating.toFixed(1)} ({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
