export default function MissionSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold text-sm font-medium tracking-[0.2em] uppercase mb-3">Our Mission</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Stylish, Comfortable & Affordable Clothing
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              To provide stylish, comfortable, and affordable clothing that helps people
              express their personality with confidence. Every piece we create is designed
              with quality craftsmanship and modern aesthetics in mind.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "500+", label: "Products" },
                { value: "10K+", label: "Happy Customers" },
                { value: "4.8★", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-gold">{stat.value}</p>
                  <p className="text-xs text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] bg-foreground overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{
                backgroundImage:
                  "url('/images/hero.png')",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">Since 2020</p>
                <p className="text-3xl font-bold">Crafting Confidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
