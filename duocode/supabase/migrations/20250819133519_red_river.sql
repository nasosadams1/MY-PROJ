/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `coins` (integer, default 100)
      - `total_coins_earned` (integer, default 100)
      - `xp` (integer, default 0)
      - `completed_lessons` (text array, default empty)
      - `level` (integer, default 1)
      - `hearts` (integer, default 5)
      - `max_hearts` (integer, default 5)
      - `last_heart_reset` (text)
      - `current_avatar` (text, default 'default')
      - `owned_avatars` (text array, default ['default'])
      - `unlocked_achievements` (text array, default empty)
      - `current_streak` (integer, default 1)
      - `last_login_date` (text)
      - `total_lessons_completed` (integer, default 0)
      - `email_verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  coins integer DEFAULT 100,
  total_coins_earned integer DEFAULT 100,
  xp integer DEFAULT 0,
  completed_lessons text[] DEFAULT '{}',
  level integer DEFAULT 1,
  hearts integer DEFAULT 5,
  max_hearts integer DEFAULT 5,
  last_heart_reset text DEFAULT CURRENT_DATE::text,
  current_avatar text DEFAULT 'default',
  owned_avatars text[] DEFAULT ARRAY['default'],
  unlocked_achievements text[] DEFAULT '{}',
  current_streak integer DEFAULT 1,
  last_login_date text DEFAULT CURRENT_DATE::text,
  total_lessons_completed integer DEFAULT 0,
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER handle_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
/*
  # Add boost tracking to user profiles

  1. Schema Changes
    - Add `xp_boost_multiplier` (integer, default 1) - The XP multiplier (2x, 3x, etc.)
    - Add `xp_boost_expires_at` (bigint, default 0) - Timestamp when XP boost expires
    - Add `unlimited_hearts_expires_at` (bigint, default 0) - Timestamp when unlimited hearts expires

  2. Security
    - No additional RLS policies needed as these are part of existing user_profiles table
*/

-- Add boost tracking columns to user_profiles
DO $$
BEGIN
  -- Add XP boost multiplier column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'xp_boost_multiplier'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN xp_boost_multiplier integer DEFAULT 1;
  END IF;

  -- Add XP boost expiration timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'xp_boost_expires_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN xp_boost_expires_at bigint DEFAULT 0;
  END IF;

  -- Add unlimited hearts expiration timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'unlimited_hearts_expires_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN unlimited_hearts_expires_at bigint DEFAULT 0;
  END IF;
END $$;