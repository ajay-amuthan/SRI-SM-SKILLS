import HeroSection from "@/components/home/HeroSection";
import ProductSection from "@/components/home/ProductSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import MissionSection from "@/components/home/MissionSection";
import { getProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import Button from "@/components/ui/Button";

export default async function HomePage() {
  const [featured, newArrivals, bestSellers, categories] = await Promise.all([
    getProducts({ featured: true, limit: 4, excludeCategory: "accessories" }),
    getProducts({ newArrival: true, limit: 4, excludeCategory: "accessories" }),
    getProducts({ bestSeller: true, limit: 4, excludeCategory: "accessories" }),
    prisma.category.findMany({
      where: { slug: { not: "accessories" } },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked styles for you"
        products={featured.products}
        linkHref="/shop?featured=true"
      />
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh styles just dropped"
        products={newArrivals.products}
        linkHref="/shop?newArrival=true"
      />
      <MissionSection />
      <ProductSection
        title="Best Sellers"
        subtitle="Most loved by our customers"
        products={bestSellers.products}
        linkHref="/shop?bestSeller=true"
      />
      <section className="py-16 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the Sri SM Skills Family</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Get exclusive offers, early access to new collections, and style tips delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-sm text-foreground focus:outline-none"
            />
            <Button variant="secondary">Subscribe</Button>
          </form>
        </div>
      </section>
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { title: "Free Shipping", desc: "On orders above ₹999" },
              { title: "Easy Returns", desc: "7-day return policy" },
              { title: "Secure Payment", desc: "100% secure checkout" },
              { title: "24/7 Support", desc: "WhatsApp assistance" },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
