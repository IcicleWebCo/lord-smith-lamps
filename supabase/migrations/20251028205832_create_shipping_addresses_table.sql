/*
  # Create Shipping Addresses Table

  1. New Tables
    - `shipping_addresses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text, required)
      - `address_line1` (text, required)
      - `address_line2` (text, optional)
      - `city` (text, required)
      - `state` (text, required)
      - `postal_code` (text, required)
      - `country` (text, required, default 'US')
      - `phone` (text, optional)
      - `special_instructions` (text, optional)
      - `is_default` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `shipping_addresses` table
    - Add policy for authenticated users to read their own addresses
    - Add policy for authenticated users to insert their own addresses
    - Add policy for authenticated users to update their own addresses
    - Add policy for authenticated users to delete their own addresses

  3. Important Notes
    - Users can have multiple shipping addresses
    - One address can be marked as default
    - Special instructions field allows customers to add delivery notes
    - Phone number is optional but recommended for delivery contact
*/

CREATE TABLE IF NOT EXISTS shipping_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text DEFAULT '',
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'US',
  phone text DEFAULT '',
  special_instructions text DEFAULT '',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses"
  ON shipping_addresses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON shipping_addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON shipping_addresses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON shipping_addresses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user_id ON shipping_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_is_default ON shipping_addresses(user_id, is_default);