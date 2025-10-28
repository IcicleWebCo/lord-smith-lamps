/*
  # Add shipped status to orders table

  1. Changes
    - Add `shipped` boolean column to `orders` table with default value false
    - Add `shipped_at` timestamp column to track when order was marked as shipped
  
  2. Notes
    - This allows admins to track and mark orders as shipped
    - The shipped_at timestamp provides audit trail for shipping operations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipped'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipped boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipped_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipped_at timestamptz;
  END IF;
END $$;