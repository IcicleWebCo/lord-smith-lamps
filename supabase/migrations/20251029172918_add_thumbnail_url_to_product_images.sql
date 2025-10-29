/*
  # Add Thumbnail URL to Product Images

  ## Overview
  Adds a thumbnail_url column to the product_images table to store optimized thumbnail versions
  of product images for use in product cards and listings.

  ## Changes
  1. Add thumbnail_url column to product_images table
     - Type: text
     - Nullable: true (existing images won't have thumbnails initially)
     - Default: empty string

  ## Purpose
  Thumbnails improve page load performance by serving smaller, optimized images in product
  cards while maintaining full-resolution images for detail views.
*/

-- Add thumbnail_url column to product_images table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE product_images ADD COLUMN thumbnail_url text DEFAULT '';
  END IF;
END $$;
