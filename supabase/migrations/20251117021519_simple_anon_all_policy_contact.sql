/*
  # Simple anon policy for contact submissions

  1. Changes
    - Add FOR ALL policy for anon role
    - This mirrors what worked in testing
    
  2. Security
    - Allow anon users to insert (which is what we need for contact forms)
    - Still restrictive - anon can only insert, not read/update/delete due to USING clause
*/

CREATE POLICY "anon_can_submit_contact"
  ON contact_submissions
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (true);