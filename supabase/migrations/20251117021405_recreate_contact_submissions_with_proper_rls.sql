/*
  # Recreate contact_submissions with proper RLS

  1. Changes
    - Rename existing table to backup
    - Create new table with same structure
    - Copy data from backup
    - Set up RLS properly from scratch
    - Drop backup
    
  2. Security
    - Enable RLS from the start
    - Create policies before any data access
    - Allow anon and authenticated users to insert
*/

-- Rename existing table
ALTER TABLE IF EXISTS contact_submissions RENAME TO contact_submissions_backup;

-- Create new table
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);

-- Copy data from backup if it exists
INSERT INTO contact_submissions (id, name, email, message, submitted_at, is_read)
SELECT id, name, email, message, submitted_at, is_read 
FROM contact_submissions_backup;

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner too
ALTER TABLE contact_submissions FORCE ROW LEVEL SECURITY;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON contact_submissions TO anon, authenticated;
GRANT SELECT ON contact_submissions TO authenticated;

-- Create policies
CREATE POLICY "contact_anon_insert"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "contact_auth_insert"
  ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "contact_auth_select"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Drop backup table
DROP TABLE IF EXISTS contact_submissions_backup;