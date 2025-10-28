/*
  # Add Shipping Price to Products

  1. Changes
    - Add `shipping_price` column to `products` table
      - `shipping_price` (numeric, default 0)
      - Represents the shipping cost for the product

  2. Notes
    - Default value set to 0 to maintain backward compatibility
    - Shipping price will be displayed separately in cart totals
    - Each product can have its own shipping price
*/

-- Add shipping_price column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'shipping_price'
  ) THEN
    ALTER TABLE products ADD COLUMN shipping_price numeric DEFAULT 0 NOT NULL;
  END IF;
END $$;
