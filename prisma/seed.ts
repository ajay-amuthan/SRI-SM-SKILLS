import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const productImages = {
  shirt: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  tshirt: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
  dress: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  jacket: "https://images.unsplash.com/photo-1551028711-eb67b54e0f0d?w=600&q=80",
  kurta: "https://images.unsplash.com/photo-1583292650898-7d22cd27cc6b?w=600&q=80",
  hoodie: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  skirt: "https://images.unsplash.com/photo-1583496663950-ae80babf7c42?w=600&q=80",
};

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  await prisma.user.upsert({
    where: { email: "admin@srismskills.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@srismskills.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "9876543210",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@example.com",
      password: userPassword,
      role: "CUSTOMER",
      phone: "9876543211",
    },
  });

  const categories = await Promise.all(
    [
      { name: "Men", slug: "men" },
      { name: "Women", slug: "women" },
      { name: "Kids", slug: "kids" },
      { name: "Accessories", slug: "accessories" },
    ].map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );

  const [men, women, kids, accessories] = categories;

  const products = [
    {
      name: "Premium Cotton Formal Shirt",
      slug: "premium-cotton-formal-shirt",
      description: "Crafted from 100% premium cotton, this formal shirt offers exceptional comfort and a sharp, professional look. Perfect for office wear and formal occasions.",
      price: 1299,
      comparePrice: 1799,
      categoryId: men.id,
      images: [productImages.shirt, productImages.tshirt],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Light Blue", "Navy"],
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.5,
      reviewCount: 28,
    },
    {
      name: "Classic Fit Denim Jeans",
      slug: "classic-fit-denim-jeans",
      description: "Timeless classic fit denim jeans with premium stretch fabric. Comfortable all-day wear with a modern slim silhouette.",
      price: 1599,
      comparePrice: 2199,
      categoryId: men.id,
      images: [productImages.jeans],
      sizes: ["28", "30", "32", "34", "36"],
      colors: ["Dark Blue", "Black", "Light Wash"],
      stock: 40,
      isFeatured: true,
      isNewArrival: true,
      rating: 4.3,
      reviewCount: 15,
    },
    {
      name: "Elegant Floral Maxi Dress",
      slug: "elegant-floral-maxi-dress",
      description: "Flowing maxi dress with delicate floral print. Lightweight fabric perfect for summer occasions and casual outings.",
      price: 1899,
      comparePrice: 2499,
      categoryId: women.id,
      images: [productImages.dress],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Floral Pink", "Floral Blue", "White"],
      stock: 35,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 42,
    },
    {
      name: "Leather Biker Jacket",
      slug: "leather-biker-jacket",
      description: "Premium faux leather biker jacket with quilted detailing. A statement piece that elevates any outfit.",
      price: 3499,
      comparePrice: 4999,
      categoryId: men.id,
      images: [productImages.jacket],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Brown"],
      stock: 20,
      isBestSeller: true,
      rating: 4.8,
      reviewCount: 19,
    },
    {
      name: "Traditional Embroidered Kurta",
      slug: "traditional-embroidered-kurta",
      description: "Beautifully embroidered kurta with intricate threadwork. Ideal for festivals, weddings, and cultural celebrations.",
      price: 1499,
      comparePrice: 1999,
      categoryId: men.id,
      images: [productImages.kurta],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Cream", "Maroon", "Navy", "Gold"],
      stock: 45,
      isNewArrival: true,
      rating: 4.6,
      reviewCount: 33,
    },
    {
      name: "Oversized Comfort Hoodie",
      slug: "oversized-comfort-hoodie",
      description: "Ultra-soft fleece hoodie with oversized fit. Your go-to for casual comfort and street style.",
      price: 999,
      comparePrice: 1499,
      categoryId: women.id,
      images: [productImages.hoodie],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Grey", "Beige", "Pink"],
      stock: 60,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.4,
      reviewCount: 56,
    },
    {
      name: "Pleated A-Line Skirt",
      slug: "pleated-a-line-skirt",
      description: "Chic pleated A-line skirt with elastic waistband. Versatile piece that pairs with any top.",
      price: 899,
      comparePrice: 1299,
      categoryId: women.id,
      images: [productImages.skirt],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Navy", "Burgundy"],
      stock: 30,
      isNewArrival: true,
      rating: 4.2,
      reviewCount: 12,
    },
    {
      name: "Kids Graphic Print T-Shirt",
      slug: "kids-graphic-print-tshirt",
      description: "Fun and colorful graphic print t-shirt for kids. Made from soft, breathable cotton for all-day comfort.",
      price: 499,
      comparePrice: 699,
      categoryId: kids.id,
      images: [productImages.tshirt],
      sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
      colors: ["Red", "Blue", "Green", "Yellow"],
      stock: 80,
      isFeatured: true,
      rating: 4.5,
      reviewCount: 24,
    },
    {
      name: "Premium Leather Belt",
      slug: "premium-leather-belt",
      description: "Genuine leather belt with classic buckle. A wardrobe essential that complements any outfit.",
      price: 699,
      comparePrice: 999,
      categoryId: accessories.id,
      images: ["https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&q=80"],
      sizes: ["32", "34", "36", "38"],
      colors: ["Brown", "Black"],
      stock: 55,
      isBestSeller: true,
      rating: 4.3,
      reviewCount: 18,
    },
    {
      name: "Designer Sunglasses",
      slug: "designer-sunglasses",
      description: "UV-protected designer sunglasses with polarized lenses. Style meets protection.",
      price: 1199,
      comparePrice: 1699,
      categoryId: accessories.id,
      images: ["https://images.unsplash.com/photo-1572635196233-4f1923f5f897?w=600&q=80"],
      sizes: ["One Size"],
      colors: ["Black", "Tortoise", "Gold"],
      stock: 25,
      isNewArrival: true,
      rating: 4.6,
      reviewCount: 9,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        images: JSON.stringify(product.images),
        sizes: JSON.stringify(product.sizes),
        colors: JSON.stringify(product.colors),
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off on your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrder: 500,
      maxUses: 1000,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FLAT200" },
    update: {},
    create: {
      code: "FLAT200",
      description: "Flat ₹200 off on orders above ₹1500",
      discountType: "FIXED",
      discountValue: 200,
      minOrder: 1500,
      maxUses: 500,
      isActive: true,
    },
  });

  console.log("Seed completed successfully!");
  console.log("Admin: admin@srismskills.com / admin123");
  console.log("Customer: customer@example.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
