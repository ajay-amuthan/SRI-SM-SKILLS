"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-foreground">
      <div className="absolute inset-0 opacity-40">
        <Image
          src="/images/hero.png"
          alt="Premium fashion collection"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/95 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Sri SM Skills
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Wear Confidence.
            <br />
            <span className="text-gradient">Live Your Style.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            Welcome to Sri SM Skills – where fashion meets comfort and confidence.
            Discover premium-quality clothing designed for modern lifestyles.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop">
              <Button variant="secondary" size="lg">Shop Collection</Button>
            </Link>
            <Link href="/shop?newArrival=true">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-foreground">
                New Arrivals
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient" />
    </section>
  );
}
