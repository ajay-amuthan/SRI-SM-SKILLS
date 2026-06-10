import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import type { ProductWithCategory } from "@/types";
import { ArrowRight } from "lucide-react";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: ProductWithCategory[];
  linkHref: string;
}

export default function ProductSection({ title, subtitle, products, linkHref }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted text-sm">{subtitle}</p>
          </div>
          <Link
            href={linkHref}
            className="hidden sm:flex items-center gap-1 text-sm font-medium hover:text-gold transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link
          href={linkHref}
          className="sm:hidden flex items-center justify-center gap-1 mt-8 text-sm font-medium hover:text-gold transition-colors"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
