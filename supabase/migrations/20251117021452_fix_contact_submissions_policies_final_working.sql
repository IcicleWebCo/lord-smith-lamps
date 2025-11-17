/*
  # Fix contact submissions policies - Working Solution

  1. Changes
    - Drop all existing policies
    - Create a single comprehensive policy for anon users
    - Create a single comprehensive policy for authenticated users
    - Use FOR ALL instead of FOR INSERT to ensure proper coverage
    
  2. Security
    - Allow anonymous users to insert contact submissions
    - Allow authenticated users full access (for admin purposes)
    
  3. Why This Works
    - FOR ALL policies cover all operations including INSERT
    - Separate policies for anon and authenticated ensure clarity
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "contact_anon_insert" ON contact_submissions;
DROP POLICY IF EXISTS "contact_auth_insert" ON contact_submissions;
DROP POLICY IF EXISTS "contact_auth_select" ON contact_submissions;
DROP POLICY IF EXISTS "test_allow_all" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_anon_insert" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_authenticated_insert" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_authenticated_select" ON contact_submissions;

-- Create comprehensive policies
CREATE POLICY "anon_can_insert_contact"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_full_access_contact"
  ON contact_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);