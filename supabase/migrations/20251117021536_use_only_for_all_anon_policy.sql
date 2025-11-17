/*
  # Use only FOR ALL policy for anon

  1. Changes
    - Drop the FOR INSERT policy for anon
    - Keep only the FOR ALL policy with proper USING/WITH CHECK
    - Update the FOR ALL policy to allow inserts
    
  2. Security
    - Anon users can insert (WITH CHECK = true)
    - Anon users cannot select/update/delete (USING = false prevents reads)
*/

-- Drop the INSERT-specific policy
DROP POLICY IF EXISTS "anon_can_insert_contact" ON contact_submissions;

-- Drop the restrictive ALL policy
DROP POLICY IF EXISTS "anon_can_submit_contact" ON contact_submissions;

-- Create a proper FOR ALL policy that allows INSERT but nothing else
CREATE POLICY "anon_contact_policy"
  ON contact_submissions
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (true);