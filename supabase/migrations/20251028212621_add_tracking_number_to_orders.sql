/*
  # Add tracking number to orders table

  1. Changes
    - Add `tracking_number` text column to `orders` table
    - This allows admins to store shipping tracking numbers for orders
  
  2. Notes
    - Tracking number is optional and can be null
    - Used to provide customers with shipment tracking information
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number text;
  END IF;
END $$;