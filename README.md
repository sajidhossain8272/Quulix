# Quulix

Quulix is a production-focused Cash on Delivery e-commerce app built with Next.js App Router, Prisma, PostgreSQL, NextAuth, React Query, Zustand, and Tailwind CSS. It includes a mobile-first storefront, product/category pages, cart and checkout flows, an admin dashboard, order management, delivery settings, media uploads, and optional Google Analytics/Facebook Pixel tracking.

## Features

- Storefront homepage with featured products, category sections, deals, and hero content.
- Product detail pages with galleries, media support, variants, inventory, ratings, and SEO metadata.
- Category pages with dynamic data and category-level SEO fields.
- Cart state powered by Zustand.
- Cash on Delivery checkout with inside/outside Dhaka delivery charges.
- Admin dashboard protected by credentials login.
- Admin product, category, order, and shop settings management.
- Product media uploads for JPG, PNG, WebP, GIF, MP4, and WebM files up to 8 MB.
- PostgreSQL data model managed through Prisma.
- Seed script that loads starter catalog data from `lib/mock-data.ts`.
- Optional Google Analytics and Facebook Pixel integration.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma 5
- PostgreSQL
- NextAuth v5 beta
- Tailwind CSS 4
- React Query
- Zustand
- Framer Motion
- Lucide React

## Project Structure

```text
app/                 Next.js App Router pages, layouts, and API routes
components/          Shared UI, storefront, cart, admin, and layout components
features/            Page-level storefront feature modules
hooks/               Client data and behavior hooks
lib/                 Prisma client, utilities, API helpers, settings, and mock data
prisma/              Prisma schema, migration, and seed script
public/              Static assets, logos, OG images, and uploaded product media
services/            API client and catalog service helpers
store/               Zustand cart store
types/               Local TypeScript declarations
```

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL database

## Environment Variables

Create a `.env` file in the project root. Do not commit real secrets.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="replace-with-a-strong-password"

NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_FB_PIXEL_ID=""
```

`NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_FB_PIXEL_ID` are optional. Leave them empty when analytics/tracking is not needed.

## Getting Started

Install dependencies:

```bash
npm install
```

Generate the Prisma client and apply the schema to your database:

```bash
npm run db:push
```

Seed starter categories and products:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Routes

- `/` - storefront homepage
- `/category/[slug]` - category listing page
- `/product/[slug]` - product details page
- `/cart` - shopping cart
- `/checkout` - Cash on Delivery checkout
- `/login` - admin login
- `/admin` - admin dashboard
- `/admin/products` - product management
- `/admin/categories` - category management
- `/admin/orders` - order management
- `/admin/settings` - delivery charge settings

## Scripts

```bash
npm run dev          # Start the local development server
npm run build        # Generate Prisma client and build the app
npm run start        # Start the production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run test         # Run Node test suite
npm run db:push      # Push Prisma schema to the database
npm run db:migrate   # Deploy Prisma migrations
npm run db:seed      # Seed starter catalog data
```

## Database

The Prisma schema includes:

- `User` for admin/user accounts.
- `Category` with SEO fields.
- `Product` with price, inventory, tags, featured collections, and SEO fields.
- `ProductVariant` for size/color inventory and optional variant pricing.
- `ProductMedia` for images and videos.
- `ShopSettings` for delivery charges.
- `Order` and `OrderItem` for COD order capture and fulfillment status.

For local development, `npm run db:push` is the quickest way to sync the schema. For production, use migrations with `npm run db:migrate`.

## Admin Access

Admin authentication uses credentials through NextAuth. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, then sign in at `/login`. The `/admin` area is protected and redirects unauthenticated users.

## Media Uploads

Admin product media uploads are stored under:

```text
public/uploads/products/
```

Allowed upload types are JPG, PNG, WebP, GIF, MP4, and WebM. The current maximum upload size is 8 MB.

## Production Notes

- Use a managed PostgreSQL database and set `DATABASE_URL` accordingly.
- Set a strong `NEXTAUTH_SECRET`.
- Replace default admin credentials before deploying.
- Run `npm run build` before release.
- Ensure `public/uploads/products` persistence is handled by your hosting setup, or replace local uploads with object storage.
- Configure `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_FB_PIXEL_ID` only when tracking is approved for the deployment.

