export const metadata = { title: "Return & Refund Policy" };

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Return & Refund Policy</h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7-Day Return Policy</h2>
          <p>We want you to love your purchase. If you&apos;re not completely satisfied, you can return unused items within 7 days of delivery.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Eligibility</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Item must be unused, unwashed, and in original condition</li>
            <li>Original tags and packaging must be intact</li>
            <li>Return request must be initiated within 7 days of delivery</li>
            <li>Sale items and innerwear are non-returnable</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">How to Return</h2>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Contact us via WhatsApp or email with your order number</li>
            <li>Our team will provide a return shipping label or pickup arrangement</li>
            <li>Pack the item securely in its original packaging</li>
            <li>Ship or hand over the package as instructed</li>
          </ol>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Refund Process</h2>
          <p>Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method. For COD orders, refunds are processed via bank transfer or UPI.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Exchanges</h2>
          <p>We offer free size exchanges within 7 days. Contact our support team to arrange an exchange.</p>
        </section>
      </div>
    </div>
  );
}
