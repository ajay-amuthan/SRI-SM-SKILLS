export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">About Sri SM Skills</h1>
      <div className="prose prose-sm max-w-none space-y-6 text-muted leading-relaxed">
        <p className="text-lg text-foreground font-medium">
          Wear Confidence. Live Your Style.
        </p>
        <p>
          Founded with a passion for fashion and a commitment to quality, Sri SM Skills has grown
          into a trusted name in premium clothing. We believe that what you wear should reflect
          who you are — confident, stylish, and uniquely you.
        </p>
        <h2 className="text-xl font-bold text-foreground">Our Mission</h2>
        <p>
          To provide stylish, comfortable, and affordable clothing that helps people express their
          personality with confidence. Every garment we create is designed with meticulous attention
          to detail, using quality fabrics that feel as good as they look.
        </p>
        <h2 className="text-xl font-bold text-foreground">What Sets Us Apart</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Premium quality fabrics and craftsmanship</li>
          <li>Trend-forward designs for modern lifestyles</li>
          <li>Affordable pricing without compromising on quality</li>
          <li>Exceptional customer service and easy returns</li>
          <li>Sustainable and ethical manufacturing practices</li>
        </ul>
        <h2 className="text-xl font-bold text-foreground">Our Values</h2>
        <div className="grid sm:grid-cols-3 gap-6 not-prose">
          {[
            { title: "Quality", desc: "Only the finest materials and craftsmanship" },
            { title: "Style", desc: "Fashion that empowers and inspires confidence" },
            { title: "Trust", desc: "Transparent pricing and honest service" },
          ].map((v) => (
            <div key={v.title} className="border border-border p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
