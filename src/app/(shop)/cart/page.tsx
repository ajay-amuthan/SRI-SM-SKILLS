"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatPrice, getProductImage } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { CartItemWithProduct } from "@/types";
import toast from "react-hot-toast";

export default function CartPage() {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQuantity = async (id: string, quantity: number) => {
    await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity }),
    });
    fetchCart();
  };

  const removeItem = async (id: string) => {
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
    toast.success("Item removed");
    fetchCart();
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : subtotal > 0 ? 99 : 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted mb-6">Add some stylish pieces to get started!</p>
        <Link href="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({items.length})</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border border-border p-4">
              <div className="relative h-24 w-20 shrink-0 bg-card overflow-hidden">
                <Image
                  src={getProductImage(item.product.images, item.product.category?.slug)}
                  alt={item.product.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.slug}`} className="text-sm font-medium hover:text-gold">
                  {item.product.name}
                </Link>
                <p className="text-xs text-muted mt-1">
                  {item.size && `Size: ${item.size}`}
                  {item.color && ` | Color: ${item.color}`}
                </p>
                <p className="text-sm font-semibold mt-2">{formatPrice(item.product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center border border-border">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-border p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(subtotal + shipping)}</span>
            </div>
          </div>
          <Link href="/checkout" className="block mt-6">
            <Button className="w-full" size="lg">Proceed to Checkout</Button>
          </Link>
          <Link href="/shop" className="block text-center text-sm text-muted mt-3 hover:text-gold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
