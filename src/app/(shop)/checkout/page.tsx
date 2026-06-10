"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/lib/validations";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { CartItemWithProduct } from "@/types";
import toast from "react-hot-toast";

type CheckoutForm = z.infer<typeof checkoutSchema>;

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "RAZORPAY" },
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      });
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const applyCoupon = async () => {
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, subtotal }),
    });
    const data = await res.json();
    if (res.ok) {
      setDiscount(data.discount);
      toast.success(`Coupon applied! Saved ${formatPrice(data.discount)}`);
    } else {
      toast.error(data.error);
    }
  };

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, couponCode: couponCode || undefined }),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to place order");
        return;
      }

      if (result.cod) {
        toast.success("Order placed successfully!");
        router.push(`/orders/${result.order.orderNumber}`);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Payment gateway failed to load");
        return;
      }

      const options = {
        key: result.keyId,
        amount: result.amount,
        currency: result.currency,
        name: "Sri SM Skills",
        description: `Order ${result.order.orderNumber}`,
        order_id: result.razorpayOrderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: result.order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            toast.success("Payment successful!");
            router.push(`/orders/${result.order.orderNumber}`);
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name: data.shippingName, contact: data.shippingPhone },
        theme: { color: "#C9A227" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border p-6">
            <h2 className="font-semibold mb-4">Shipping Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" {...register("shippingName")} error={errors.shippingName?.message} />
              <Input label="Phone" {...register("shippingPhone")} error={errors.shippingPhone?.message} />
              <div className="sm:col-span-2">
                <Input label="Address" {...register("shippingAddress")} error={errors.shippingAddress?.message} />
              </div>
              <Input label="City" {...register("shippingCity")} error={errors.shippingCity?.message} />
              <Input label="State" {...register("shippingState")} error={errors.shippingState?.message} />
              <Input label="Pincode" {...register("shippingPincode")} error={errors.shippingPincode?.message} />
            </div>
          </div>

          <div className="border border-border p-6">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { value: "RAZORPAY", label: "Razorpay (UPI, Cards, Net Banking)" },
                { value: "UPI", label: "UPI (Google Pay, PhonePe, Paytm)" },
                { value: "CARD", label: "Debit / Credit Card" },
                { value: "NETBANKING", label: "Net Banking" },
                { value: "COD", label: "Cash on Delivery" },
              ].map((method) => (
                <label key={method.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value={method.value}
                    {...register("paymentMethod")}
                    className="accent-gold"
                  />
                  <span className="text-sm">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-border p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-muted truncate mr-2">
                  {item.product.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 border border-border px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
            <Button type="button" variant="outline" size="sm" onClick={applyCoupon}>
              Apply
            </Button>
          </div>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Button type="submit" className="w-full mt-6" size="lg" loading={loading}>
            {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
          </Button>
        </div>
      </form>
    </div>
  );
}
