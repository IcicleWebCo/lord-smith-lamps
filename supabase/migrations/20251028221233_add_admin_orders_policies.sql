/*
  # Add Admin Access Policies for Orders
  
  ## Overview
  Adds RLS policies to allow admin users to view and manage all orders and order items.
  
  ## Changes
  1. Add policy for admins to select all orders
  2. Add policy for admins to update all orders
  3. Add policy for admins to select all order items
  
  ## Security
  - Policies check the `is_admin` flag from `user_roles` table
  - Only authenticated users with `is_admin = true` can access all orders
  - Regular users still maintain access to only their own orders
  
  ## Important Notes
  - These policies work alongside existing user-specific policies
  - Admins need both authentication and proper role assignment
*/

-- Add admin SELECT policy for orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.is_admin = true
    )
  );

-- Add admin UPDATE policy for orders
CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
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

-- Add admin SELECT policy for order_items
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.is_admin = true
    )
  );
