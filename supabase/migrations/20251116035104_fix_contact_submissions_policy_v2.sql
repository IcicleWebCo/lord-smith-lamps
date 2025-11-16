/*
  # Fix contact submissions insert policy v2

  1. Changes
    - Drop the existing policy
    - Create a simpler policy using public role that encompasses all users
  
  2. Security
    - Allow all users (authenticated and unauthenticated) to insert contact submissions
    - Use public role which applies to all connections
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create a policy for all users using public role
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  WITH CHECK (true);
