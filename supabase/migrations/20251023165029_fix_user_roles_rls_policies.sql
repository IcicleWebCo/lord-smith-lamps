/*
  # Fix User Roles RLS Policies

  1. Changes
    - Drop existing circular policies on user_roles table
    - Create simpler policies that avoid recursion
    - Users can read their own role without checking admin status
    - Only service role can update roles (via admin functions)

  2. Security
    - Users can only view their own role
    - Admin checks don't require querying user_roles within policies
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;

-- Simple policy: users can read their own role only
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only service role can insert/update/delete user roles
-- This prevents the circular dependency issue
CREATE POLICY "Service role can manage roles"
  ON user_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
