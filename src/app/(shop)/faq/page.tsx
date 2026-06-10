export const metadata = { title: "FAQ" };

const faqs = [
  { q: "How do I place an order?", a: "Browse our collection, add items to your cart, and proceed to checkout. You can pay via Razorpay (UPI, cards, net banking) or Cash on Delivery." },
  { q: "What is the shipping time?", a: "Orders are typically delivered within 3-7 business days across India. You'll receive a tracking number once your order ships." },
  { q: "Is shipping free?", a: "Yes! We offer free shipping on all orders above ₹999. Orders below ₹999 have a flat shipping charge of ₹99." },
  { q: "What is your return policy?", a: "We offer a 7-day easy return policy on unused items with original tags. Visit our Return & Refund Policy page for details." },
  { q: "How can I track my order?", a: "Go to My Orders in your account to view order status and tracking information. You'll also receive email/SMS updates." },
  { q: "What payment methods do you accept?", a: "We accept UPI (Google Pay, PhonePe, Paytm), debit/credit cards, net banking via Razorpay, and Cash on Delivery." },
  { q: "How do I use a coupon code?", a: "Enter your coupon code on the checkout page and click Apply. The discount will be reflected in your order total." },
  { q: "How do I contact customer support?", a: "Reach us via WhatsApp (bottom-right button), email at info@srismskills.com, or our Contact page." },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted mb-10">Find answers to common questions about shopping with Sri SM Skills.</p>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="border border-border group">
            <summary className="px-6 py-4 font-medium cursor-pointer hover:bg-card transition-colors list-none flex justify-between items-center">
              {faq.q}
              <span className="text-gold group-open:rotate-45 transition-transform text-xl">+</span>
            </summary>
            <div className="px-6 pb-4 text-sm text-muted leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
