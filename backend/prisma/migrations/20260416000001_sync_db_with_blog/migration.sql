-- Sync: Add COMPLETED to OrderStatus enum (already in DB)
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'COMPLETED';

-- Sync: Add isPaid column to Order (already in DB)
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "isPaid" BOOLEAN NOT NULL DEFAULT false;

-- New: Add excerpt, category, published to Post table
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "excerpt" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "published" BOOLEAN NOT NULL DEFAULT false;
