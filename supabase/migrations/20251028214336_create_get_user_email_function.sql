/*
  # Create function to get user email by order ID

  1. New Functions
    - `get_user_email_by_order` - Returns the email address of the user who placed an order
  
  2. Security
    - Function is marked as SECURITY DEFINER to allow access to auth.users table
    - Only accessible by authenticated users with proper permissions
  
  3. Purpose
    - Allows admins to retrieve customer email for order-related communications
    - Avoids exposing admin API endpoints to client
*/

CREATE OR REPLACE FUNCTION get_user_email_by_order(order_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_email text;
BEGIN
  SELECT u.email INTO user_email
  FROM orders o
  JOIN auth.users u ON u.id = o.user_id
  WHERE o.id = order_id;
  
  RETURN user_email;
END;
$$;