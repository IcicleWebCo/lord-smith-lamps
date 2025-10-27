/*
  # Setup Product Images Storage Policies

  ## Overview
  Creates storage policies for the "Product Images" bucket to allow:
  - Public read access for all users
  - Upload/update/delete access for authenticated admin users

  ## Storage Policies
  1. Anyone can view product images (public bucket)
  2. Only admins can upload images
  3. Only admins can update images
  4. Only admins can delete images

  ## Security
  - Uses the is_admin() function to verify admin status
  - Public read access for displaying images on the website
  - Restricted write access to admins only
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

-- Policy: Public can view all images in Product Images bucket
CREATE POLICY "Public read access for product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'Product Images');

-- Policy: Admins can upload images to Product Images bucket
CREATE POLICY "Admins can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'Product Images'
    AND is_admin()
  );

-- Policy: Admins can update images in Product Images bucket
CREATE POLICY "Admins can update product images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'Product Images'
    AND is_admin()
  )
  WITH CHECK (
    bucket_id = 'Product Images'
    AND is_admin()
  );

-- Policy: Admins can delete images from Product Images bucket
CREATE POLICY "Admins can delete product images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'Product Images'
    AND is_admin()
  );
