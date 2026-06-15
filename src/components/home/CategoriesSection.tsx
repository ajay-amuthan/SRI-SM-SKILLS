import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

const categoryImages: Record<string, string> = {
  men: "/images/men.png",
  women: "/images/women.png",
  kids: "/images/kids.png",
  accessories: "/images/accessories.png",
};

export default function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 md:py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted text-sm">Find your perfect style</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={cat.image || categoryImages[cat.slug] || categoryImages.men}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-lg font-semibold tracking-wide">{cat.name}</h3>
                <p className="text-xs mt-1 opacity-80">{cat._count.products} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
