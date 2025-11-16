/*
  # Grant explicit permissions for contact submissions

  1. Changes
    - Grant INSERT permission explicitly to anon and authenticated roles
    - Ensure both roles can bypass RLS for inserts via policy
  
  2. Security
    - Explicitly allow anon (unauthenticated) users to insert
    - Explicitly allow authenticated users to insert
*/

-- Ensure anon and authenticated roles have INSERT permission
GRANT INSERT ON contact_submissions TO anon;
GRANT INSERT ON contact_submissions TO authenticated;

-- Drop existing policy and recreate with explicit role targeting
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create separate policies for each role to be explicit
CREATE POLICY "Anon users can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
