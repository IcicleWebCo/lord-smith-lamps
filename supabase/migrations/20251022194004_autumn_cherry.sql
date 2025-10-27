/*
  # Create newsletter subscriptions table

  1. New Tables
    - `newsletter_subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `subscribed_at` (timestamp)
      - `is_active` (boolean, default true)

  2. Security
    - Enable RLS on `newsletter_subscriptions` table
    - Add policy for public insert access (anyone can subscribe)
    - Add policy for authenticated users to read their own subscription
*/

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow users to read their own subscription status
CREATE POLICY "Users can read their own subscription"
  ON newsletter_subscriptions
  FOR SELECT
  TO public
  USING (true);