/*
  # Remove FORCE RLS from contact_submissions

  1. Changes
    - Disable FORCE ROW LEVEL SECURITY
    - Keep regular RLS enabled
    - This allows the table owner (postgres) to bypass RLS while keeping it enforced for anon/authenticated
    
  2. Security
    - RLS still active for anon and authenticated roles
    - Policies remain unchanged
*/

-- Remove FORCE RLS
ALTER TABLE contact_submissions NO FORCE ROW LEVEL SECURITY;