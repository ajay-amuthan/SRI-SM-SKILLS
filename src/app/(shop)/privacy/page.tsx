export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-sm text-muted leading-relaxed">
        <p>Last updated: June 2026</p>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h2>
          <p>We collect information you provide directly: name, email, phone number, shipping address, and payment details (processed securely via Razorpay). We also collect usage data to improve our services.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates via email/SMS</li>
            <li>Provide customer support</li>
            <li>Improve our website and product offerings</li>
            <li>Send promotional communications (with your consent)</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Data Security</h2>
          <p>We use industry-standard encryption and secure payment processing. Your payment information is handled by Razorpay and never stored on our servers.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Your Rights</h2>
          <p>You can request access, correction, or deletion of your personal data by contacting us at info@srismskills.com.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
          <p>For privacy-related inquiries, email us at info@srismskills.com or call +91 98765 43210.</p>
        </section>
      </div>
    </div>
  );
}
