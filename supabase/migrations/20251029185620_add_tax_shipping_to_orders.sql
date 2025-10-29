/*
  # Add Tax and Shipping Fields to Orders
  
  ## Overview
  Adds separate fields for tax and shipping amounts in the orders table to track these components separately from the total amount.
  
  ## Changes
  
  ### Modified Tables
  1. `orders`
    - Add `tax_amount` (numeric) - Sales tax charged on the order
    - Add `shipping_amount` (numeric) - Shipping cost charged on the order
    - Add `subtotal_amount` (numeric) - Pre-tax, pre-shipping subtotal
  
  ## Important Notes
  - Default values are set to 0 for existing orders
  - These fields enable proper financial reporting with tax and shipping breakdowns
  - The total_amount remains as the final total (subtotal + tax + shipping)
*/

-- Add tax, shipping, and subtotal columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tax_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN tax_amount numeric(10,2) DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipping_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_amount numeric(10,2) DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'subtotal_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN subtotal_amount numeric(10,2) DEFAULT 0 NOT NULL;
  END IF;
END $$;