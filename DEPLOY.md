# Deploy Sri SM Skills to Production

Step-by-step guide to go live with **Vercel + Neon** (recommended, free to start).

---

## Step 1 — Push code to GitHub

```bash
cd sri-sm-skills
git init
git add .
git commit -m "Initial commit — Sri SM Skills e-commerce"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sri-sm-skills.git
git push -u origin main
```

---

## Step 2 — Create PostgreSQL database (Neon)

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Create a new project → name it `sri-sm-skills`
3. Copy the **connection string** (starts with `postgresql://`)
4. Keep this safe — you'll add it to Vercel

---

## Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New Project** → import your `sri-sm-skills` repo
3. Add these **Environment Variables**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon connection string |
| `AUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `AUTH_URL` | `https://your-project.vercel.app` (update after deploy) |
| `RAZORPAY_KEY_ID` | Live key from Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | Live secret from Razorpay dashboard |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919876543210` (your number) |

4. Click **Deploy**
5. Wait ~2 minutes for build to complete

---

## Step 4 — Seed production database

After first deploy, run seed once from your local machine:

```bash
# Set DATABASE_URL to your Neon connection string in .env
npm run db:seed
```

This creates the admin account and sample products.

**Change the admin password immediately after first login!**

| Account | Email | Default Password |
|---------|-------|------------------|
| Admin | admin@srismskills.com | admin123 |

---

## Step 5 — Razorpay live mode

1. Complete KYC at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Switch from **Test Mode** to **Live Mode**
3. Copy live `Key ID` and `Key Secret`
4. Update env vars in Vercel → Settings → Environment Variables
5. Redeploy (Deployments → ⋯ → Redeploy)

---

## Step 6 — Custom domain

1. Buy a domain (GoDaddy, Namecheap, etc.) e.g. `srismskills.com`
2. In Vercel → Project → **Settings → Domains**
3. Add your domain and follow DNS instructions
4. Update `AUTH_URL` env var to `https://srismskills.com`
5. Redeploy

---

## Step 7 — Go-live checklist

- [ ] Admin password changed from default
- [ ] Razorpay live keys configured
- [ ] `AUTH_URL` set to production domain
- [ ] Test a real ₹1 payment end-to-end
- [ ] Replace sample product images with real photos
- [ ] Update contact info (phone, email, address) in Footer/Contact page
- [ ] WhatsApp number updated

---

## Alternative: Railway (all-in-one)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add **PostgreSQL** plugin (auto-sets `DATABASE_URL`)
4. Add remaining env vars manually
5. Deploy — Railway gives you a public URL instantly

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Prisma | Ensure `DATABASE_URL` is set in Vercel env vars |
| Login doesn't work | Check `AUTH_SECRET` and `AUTH_URL` are set correctly |
| Payments fail | Verify Razorpay live keys and KYC is complete |
| Database empty | Run `npm run db:seed` with production `DATABASE_URL` |
| Images not loading | Unsplash URLs work; add your CDN domain to `next.config.ts` |

---

## Monthly cost estimate

| Service | Cost |
|---------|------|
| Vercel (Hobby) | Free |
| Neon PostgreSQL | Free (up to 0.5 GB) |
| Domain (.com) | ~₹800/year |
| Razorpay | 2% per transaction |
| **Total to start** | **~₹70/month** (domain only) |
