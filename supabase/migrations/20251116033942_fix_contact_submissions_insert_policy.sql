/*
  # Fix contact submissions insert policy

  1. Changes
    - Drop the existing restrictive insert policy
    - Create a new policy that allows both authenticated and unauthenticated users to insert
  
  2. Security
    - Anyone (authenticated or not) can submit a contact form
    - The policy uses anon role to allow unauthenticated access
    - Authenticated users can also submit without restriction
*/

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create a new policy that works for both authenticated and unauthenticated users
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
