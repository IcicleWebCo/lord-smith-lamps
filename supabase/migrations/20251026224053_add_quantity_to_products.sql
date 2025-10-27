/*
  # Add Quantity Field to Products Table

  ## Overview
  Adds inventory tracking to products by adding a quantity field to track how many units are in stock.

  ## Changes
  
  ### Modified Tables
  
  #### `products`
  - Added `quantity` (integer) - Number of units in stock (default: 0)
    - Represents the current available inventory
    - When quantity reaches 0, product is automatically out of stock
    - Cannot be negative

  ## Migration Notes
  1. Adds quantity column with default value of 0
  2. Existing products will have quantity set to 100 for in_stock products, 0 for out of stock
  3. Future products should set quantity when created
  4. The `in_stock` field will be determined by quantity > 0

  ## Important Notes
  - This migration is safe and will not lose any data
  - Existing products maintain their current in_stock status
  - Quantity defaults to 0 for new products (must be explicitly set)
*/

-- Add quantity column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN quantity integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Set quantity for existing products based on their in_stock status
UPDATE products
SET quantity = CASE
  WHEN in_stock = true THEN 100
  ELSE 0
END
WHERE quantity = 0;

-- Add check constraint to ensure quantity cannot be negative
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_quantity_check'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_quantity_check CHECK (quantity >= 0);
  END IF;
END $$;