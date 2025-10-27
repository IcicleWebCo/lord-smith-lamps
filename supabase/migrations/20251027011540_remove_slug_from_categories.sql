/*
  # Remove slug column from categories table

  ## Overview
  This migration removes the unused slug field from the categories table.
  The slug field was originally intended for URL-friendly routing, but the 
  application does not implement URL-based routing. Categories are filtered 
  and displayed using their name field instead.

  ## Changes Made
  
  1. **Drop slug column**
     - Remove the slug column from the categories table
     - The unique constraint on slug will be automatically dropped with the column

  ## Important Notes
  - This is a non-destructive change for category functionality
  - Existing categories will continue to work normally
  - Category filtering uses the name field, which is unaffected
  - No data loss for category names or descriptions
*/

-- Remove the slug column from categories table
ALTER TABLE categories DROP COLUMN IF EXISTS slug;
