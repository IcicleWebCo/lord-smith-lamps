/*
  # Create Product Images Table

  ## Overview
  Creates a new table to store multiple images for each product with ordering support.

  ## New Tables
  
  ### `product_images`
  - `id` (uuid, primary key) - Unique identifier for each image record
  - `product_id` (uuid, foreign key) - References the product this image belongs to
  - `image_url` (text) - URL of the product image
  - `seq` (integer) - Sequence/order number for displaying images (lower numbers first)
  - `alt_text` (text, optional) - Alternative text for accessibility
  - `created_at` (timestamptz) - Timestamp when the image was added
  - `updated_at` (timestamptz) - Timestamp when the image was last updated

  ## Relationships
  - One-to-many relationship: Each product can have multiple images
  - Foreign key constraint from `product_id` to `products.id` with CASCADE delete
  - When a product is deleted, all its images are automatically deleted

  ## Indexing
  - Index on `product_id` for efficient querying of images by product
  - Unique constraint on `(product_id, seq)` to ensure no duplicate sequence numbers per product

  ## Security
  - Row Level Security (RLS) enabled on `product_images` table
  - Public read access for all users (images are displayed on the website)
  - Only authenticated admin users can insert, update, or delete images
  
  ## Important Notes
  1. The `seq` field allows flexible ordering (e.g., 1, 2, 3 or 10, 20, 30)
  2. Lower sequence numbers appear first when displaying images
  3. Each product can have unlimited images
  4. Existing `image_url` field in `products` table remains for backward compatibility
*/

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL DEFAULT '',
  seq integer NOT NULL DEFAULT 0,
  alt_text text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on product_id for efficient querying
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Create unique constraint on product_id and seq to prevent duplicate sequence numbers
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_images_product_seq ON product_images(product_id, seq);

-- Enable Row Level Security
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view product images
CREATE POLICY "Anyone can view product images"
  ON product_images
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert product images
CREATE POLICY "Admins can insert product images"
  ON product_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.is_admin = true
    )
  );

-- Policy: Only admins can update product images
CREATE POLICY "Admins can update product images"
  ON product_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.is_admin = true
    )
  );

-- Policy: Only admins can delete product images
CREATE POLICY "Admins can delete product images"
  ON product_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.is_admin = true
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS update_product_images_updated_at_trigger ON product_images;
CREATE TRIGGER update_product_images_updated_at_trigger
  BEFORE UPDATE ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION update_product_images_updated_at();
