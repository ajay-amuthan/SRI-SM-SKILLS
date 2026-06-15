# Sri SM Skills — E-Commerce Platform

Premium clothing e-commerce website for **Sri SM Skills** — *Wear Confidence. Live Your Style.*

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js API Routes, Prisma ORM |
| Database | SQLite (dev) / PostgreSQL (production) |
| Auth | NextAuth.js v5 (Credentials) |
| Payments | Razorpay (UPI, Cards, Net Banking, COD) |
| State | Zustand, React Hook Form + Zod |
| UI | Framer Motion, Lucide Icons, React Hot Toast |

## Features

### Customer
- Home page with hero, featured products, new arrivals, best sellers
- Product catalog with search, filters, and sorting
- Product detail with reviews and ratings
- Shopping cart and secure checkout
- Razorpay payment integration with auto-verification
- User registration, login, profile, order history
- Wishlist, order tracking, coupon codes
- WhatsApp support button
- Static pages: About, Contact, FAQ, Returns, Privacy

### Admin (`/admin/login`)
- Secure admin-only dashboard
- Product CRUD with inventory management
- Category management
- Order management with status updates and tracking
- Customer details and spending analytics
- Coupon/discount management
- Sales analytics with revenue charts

## Quick Start

```bash
# Install dependencies
npm install

# Set up database and seed sample data
npm run db:setup

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@srismskills.com | admin123 |
| Customer | customer@example.com | user123 |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="generate-a-random-secret"
AUTH_URL="http://localhost:3000"
RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="your-secret"
NEXT_PUBLIC_STORE_WHATSAPP="919952522102"
```

## Project Structure

```
src/
├── app/
│   ├── (shop)/          # Customer-facing pages
│   ├── admin/           # Admin panel (login + dashboard)
│   └── api/             # REST API routes
├── components/
│   ├── home/            # Homepage sections
│   ├── shop/            # Product components
│   ├── layout/          # Header, Footer, WhatsApp
│   └── ui/              # Reusable UI primitives
├── lib/                 # Auth, Prisma, Razorpay, utilities
└── types/               # TypeScript definitions
prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Sample data seeder
```

## Database Schema

- **User** — Customers and admins with role-based access
- **Product** — Clothing items with sizes, colors, stock, flags
- **Category** — Product categories (Men, Women, Kids, Accessories)
- **Order / OrderItem** — Orders with payment and shipping tracking
- **CartItem / WishlistItem** — User shopping state
- **Review** — Product ratings and comments
- **Coupon** — Discount codes (percentage or fixed)
- **Notification** — In-app notifications for orders/payments

## Payment Flow

1. Customer completes checkout form
2. Order created in database, stock decremented
3. **COD**: Order confirmed immediately
4. **Razorpay**: Payment modal opens (UPI/Cards/NetBanking)
5. On success, signature verified server-side
6. Order status updated to PAID/CONFIRMED
7. Email/SMS notifications sent (configurable)

## Production Deployment

The project is configured for **PostgreSQL + Vercel**. See **[DEPLOY.md](./DEPLOY.md)** for the full step-by-step guide.

Quick summary:
1. Create a free database on [Neon](https://neon.tech)
2. Push code to GitHub
3. Deploy on [Vercel](https://vercel.com) with env vars
4. Run `npm run db:seed` against production DB
5. Activate Razorpay live keys
6. Connect your custom domain

## Coupon Codes (Demo)

- `WELCOME10` — 10% off (min ₹500)
- `FLAT200` — ₹200 off (min ₹1500)
