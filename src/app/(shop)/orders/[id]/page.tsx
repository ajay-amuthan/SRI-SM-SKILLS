import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusSteps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderNumber: id }],
      userId: session.user.id,
    },
    include: { items: true },
  });

  if (!order) notFound();

  const currentStep = statusSteps.indexOf(order.status);
  
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919952522102";
  const waMessage = encodeURIComponent(
    `Hi Sri SM Skills! I just placed an order.\n\nOrder Number: ${order.orderNumber}\nTotal: ${formatPrice(order.total)}\nPayment: ${order.paymentMethod}\n\nPlease confirm my order!`
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-sm text-muted">{format(order.createdAt, "MMMM dd, yyyy 'at' h:mm a")}</p>
        </div>
        <div className="text-right text-sm">
          <p>Status: <span className="font-semibold">{order.status}</span></p>
          <p>Payment: <span className="font-semibold">{order.paymentStatus}</span></p>
          {order.status === "PENDING" && (
            <a
              href={`https://wa.me/${phone}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#20b858] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Confirm on WhatsApp
            </a>
          )}
        </div>
      </div>

      {order.status !== "CANCELLED" && (
        <div className="mb-8 border border-border p-6">
          <h2 className="font-semibold mb-4">Order Tracking</h2>
          <div className="flex justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-border" />
            {statusSteps.map((step, i) => (
              <div key={step} className="relative flex flex-col items-center z-10">
                <div className={`h-6 w-6 rounded-full border-2 ${
                  i <= currentStep ? "bg-gold border-gold" : "bg-white border-border"
                }`} />
                <span className="text-xs mt-2 text-center hidden sm:block">{step}</span>
              </div>
            ))}
          </div>
          {order.trackingNumber && (
            <p className="text-sm mt-4">Tracking Number: <span className="font-medium">{order.trackingNumber}</span></p>
          )}
        </div>
      )}

      <div className="border border-border p-6 mb-6">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              {item.image && (
                <div className="relative h-16 w-14 shrink-0 bg-card overflow-hidden">
                  <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" sizes="56px" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted">
                  Qty: {item.quantity}
                  {item.size && ` | Size: ${item.size}`}
                  {item.color && ` | Color: ${item.color}`}
                </p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="border border-border p-6">
          <h2 className="font-semibold mb-3">Shipping Address</h2>
          <p className="text-sm leading-relaxed">
            {order.shippingName}<br />
            {order.shippingAddress}<br />
            {order.shippingCity}, {order.shippingState} - {order.shippingPincode}<br />
            Phone: {order.shippingPhone}
          </p>
        </div>
        <div className="border border-border p-6">
          <h2 className="font-semibold mb-3">Payment Summary</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-muted">Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            <p className="text-xs text-muted pt-2">Method: {order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
