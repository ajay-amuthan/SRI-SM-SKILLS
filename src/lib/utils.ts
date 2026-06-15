import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SSS-${timestamp}-${random}`;
}

export function parseJsonArray<T = string>(value: string, fallback: T[] = []): T[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function calculateDiscount(
  subtotal: number,
  type: string,
  value: number
): number {
  if (type === "PERCENTAGE") {
    return Math.min(subtotal, (subtotal * value) / 100);
  }
  return Math.min(subtotal, value);
}

export function getProductImage(
  images: string[] | string | null | undefined,
  categorySlug?: string
): string {
  const imgArray = Array.isArray(images)
    ? images
    : typeof images === "string"
    ? [images]
    : [];
  const firstImage = imgArray[0];

  if (!firstImage || firstImage.includes("unsplash.com")) {
    const slug = categorySlug || "";
    if (slug === "men") return "/images/men.png";
    if (slug === "women") return "/images/women.png";
    if (slug === "kids") return "/images/kids.png";
    if (slug === "accessories") return "/images/accessories.png";
    return "/images/hero.png";
  }
  return firstImage;
}
