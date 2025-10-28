/*
  # Add Admin Access Policy for Shipping Addresses
  
  ## Overview
  Adds RLS policy to allow admin users to view all shipping addresses.
  
  ## Changes
  1. Add policy for admins to select all shipping addresses
  
  ## Security
  - Policy checks the `is_admin` flag from `user_roles` table
  - Only authenticated users with `is_admin = true` can access all addresses
  - Regular users still maintain access to only their own addresses
  
  ## Important Notes
  - This policy works alongside existing user-specific policies
  - Admins need both authentication and proper role assignment
  - Admins can view addresses to see shipping information for orders
*/

-- Add admin SELECT policy for shipping_addresses
CREATE POLICY "Admins can view all shipping addresses"
  ON shipping_addresses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.is_admin = true
    )
  );
