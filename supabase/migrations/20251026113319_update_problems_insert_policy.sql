/*
  # Update problems table RLS policy for insertion

  1. Changes
    - Allow authenticated users to insert problems (for seeding and admin use)
    - This enables the seed script to work properly
*/

DROP POLICY IF EXISTS "Admins can manage problems" ON problems;

CREATE POLICY "Authenticated users can insert problems"
  ON problems FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update problems"
  ON problems FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete problems"
  ON problems FOR DELETE
  TO authenticated
  USING (true);