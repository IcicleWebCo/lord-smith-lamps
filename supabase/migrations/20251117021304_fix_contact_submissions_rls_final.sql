/*
  # Fix contact submissions RLS policies - Final Fix

  1. Changes
    - Drop ALL existing policies on contact_submissions
    - Recreate clean policies for anon and authenticated roles
    - Ensure grants are in place
    
  2. Security
    - Allow anonymous (unauthenticated) users to insert contact submissions
    - Allow authenticated users to insert contact submissions
    - Allow authenticated users to read all submissions (for admin purposes)
    
  3. Why This Migration
    - Previous migrations may have left conflicting policies
    - This migration provides a clean slate with explicit policies
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Anon users can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can read submissions" ON contact_submissions;

-- Ensure RLS is enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT INSERT, SELECT ON contact_submissions TO anon;
GRANT ALL ON contact_submissions TO authenticated;

-- Create new policies with clear names
CREATE POLICY "contact_submissions_anon_insert"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "contact_submissions_authenticated_insert"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "contact_submissions_authenticated_select"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);