"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, Heart, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";
import { formatPrice, getProductImage } from "@/lib/utils";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    sizes: string[];
    colors: string[];
    stock: number;
    rating: number;
    reviewCount: number;
    category: { name: string; slug: string };
    reviews: {
      id: string;
      rating: number;
      comment: string | null;
      createdAt: Date;
      user: { name: string; image: string | null };
    }[];
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0] || "");
  const [color, setColor] = useState(product.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity, size, color }),
      });
      if (res.status === 401) {
        toast.error("Please login to add to cart");
        return;
      }
      toast.success("Added to cart!");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.status === 401) {
        toast.error("Please login first");
        return;
      }
      const data = await res.json();
      toast.success(data.added ? "Added to wishlist" : "Removed from wishlist");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleReview = async () => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (res.status === 401) {
        toast.error("Please login to leave a review");
        return;
      }
      toast.success("Review submitted!");
      setReviewComment("");
    } catch {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="relative aspect-[3/4] bg-card overflow-hidden mb-4">
            <Image
              src={getProductImage(product.images[selectedImage], product.category.slug)}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 ${
                    i === selectedImage ? "border-gold" : "border-transparent"
                  }`}
                >
                  <Image src={getProductImage(img, product.category.slug)} alt="" fill unoptimized className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-muted mb-2">{product.category.name}</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <>
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <span className="bg-gold text-white text-xs px-2 py-1 font-semibold">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-muted leading-relaxed mb-6">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      size === s
                        ? "border-foreground bg-foreground text-white"
                        : "border-border hover:border-gold"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      color === c
                        ? "border-foreground bg-foreground text-white"
                        : "border-border hover:border-gold"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center border border-border w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-card"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-card"
              >
                +
              </button>
            </div>
            <p className="text-xs text-muted mt-1">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
          </div>

          <div className="flex gap-3 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1"
              size="lg"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </Button>
            <Button onClick={handleWishlist} variant="outline" size="lg">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { icon: Truck, text: "Free shipping above ₹999" },
              { icon: Shield, text: "Secure payment" },
              { icon: RotateCcw, text: "7-day easy returns" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="text-center">
                <Icon className="h-5 w-5 mx-auto mb-1 text-gold" />
                <p className="text-xs text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
        <div className="mb-8 p-6 bg-card">
          <p className="text-sm font-medium mb-3">Write a Review</p>
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} onClick={() => setReviewRating(i + 1)}>
                <Star
                  className={`h-5 w-5 ${i < reviewRating ? "fill-gold text-gold" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full border border-border p-3 text-sm focus:border-gold focus:outline-none mb-3"
            rows={3}
          />
          <Button onClick={handleReview} size="sm">Submit Review</Button>
        </div>

        {product.reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{review.user.name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? "fill-gold text-gold" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-sm text-muted">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
