import Link from "next/link";
import { Share2, Globe, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-1">
              Sri SM <span className="text-gold">Skills</span>
            </h3>
            <p className="text-sm text-gray-400 mb-4">Wear Confidence. Live Your Style.</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium-quality clothing designed for modern lifestyles. Express your personality with confidence.
            </p>
            <div className="flex gap-3 mt-4">
              {[Share2, Globe, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center border border-gray-600 hover:border-gold hover:text-gold transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/shop?newArrival=true", label: "New Arrivals" },
                { href: "/shop?bestSeller=true", label: "Best Sellers" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gold">Policies</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: "/returns", label: "Return & Refund Policy" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/faq", label: "Shipping Info" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gold">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                <span>123 Fashion Street, Hyderabad, Telangana 500001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href="tel:+919876543210" className="hover:text-gold transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a href="mailto:info@srismskills.com" className="hover:text-gold transition-colors">
                  info@srismskills.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Sri SM Skills. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>UPI</span>
            <span>Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
