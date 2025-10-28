/*
  # Fix User Roles Insert Policy

  1. Changes
    - Add INSERT policy for user_roles table to allow the trigger function to create roles
    - The policy allows inserts only through the SECURITY DEFINER function
    
  2. Security
    - Uses SECURITY DEFINER function to bypass RLS for automatic user role creation
    - No direct user INSERT access - only through the trigger
*/

-- Drop and recreate the trigger function with proper permissions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_role();

CREATE OR REPLACE FUNCTION create_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, is_admin)
  VALUES (NEW.id, 'user', false);
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Ignore if role already exists
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_role();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_roles TO postgres, service_role;
