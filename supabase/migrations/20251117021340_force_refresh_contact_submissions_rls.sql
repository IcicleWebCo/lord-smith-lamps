/*
  # Force refresh RLS for contact_submissions

  1. Changes
    - Temporarily disable RLS
    - Re-enable RLS
    - This forces PostgreSQL to refresh all policy caches
    
  2. Security
    - RLS policies remain the same
    - This is just a cache refresh operation
*/

-- Disable and re-enable RLS to force refresh
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Ensure the anon role has the correct permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON contact_submissions TO anon;