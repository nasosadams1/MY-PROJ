/*
  # Realtime 1v1 Coding Duel Platform Schema

  1. New Tables
    - `duel_users`
      - `id` (uuid, primary key) - unique user identifier
      - `username` (text, unique) - display name
      - `email` (text, unique) - user email
      - `rating` (integer) - current ELO rating (starts at 1200)
      - `wins` (integer) - total wins count
      - `losses` (integer) - total losses count
      - `draws` (integer) - total draws count
      - `matches_played` (integer) - total matches played
      - `avatar_url` (text) - profile avatar URL
      - `auth_user_id` (uuid) - reference to auth.users
      - `created_at` (timestamptz) - account creation time
      - `updated_at` (timestamptz) - last update time

    - `problems`
      - `id` (uuid, primary key) - unique problem identifier
      - `title` (text) - problem title
      - `statement` (text) - problem description/requirements
      - `difficulty` (text) - easy/medium/hard
      - `time_limit_seconds` (integer) - time limit per match
      - `memory_limit_mb` (integer) - memory constraint
      - `supported_languages` (jsonb) - array of supported language codes
      - `test_cases` (jsonb) - array of test case objects with input/output/weight/hidden
      - `tags` (text[]) - array of topic tags
      - `created_at` (timestamptz) - problem creation time
      - `is_active` (boolean) - whether problem is available for matches

    - `matches`
      - `id` (uuid, primary key) - unique match identifier
      - `player_a_id` (uuid) - first player user ID
      - `player_b_id` (uuid) - second player user ID
      - `problem_id` (uuid) - assigned problem ID
      - `match_type` (text) - ranked/casual/practice
      - `status` (text) - waiting/in_progress/completed/abandoned
      - `winner_id` (uuid, nullable) - winning player ID (null for draw)
      - `player_a_rating_before` (integer) - player A rating before match
      - `player_b_rating_before` (integer) - player B rating before match
      - `player_a_rating_after` (integer, nullable) - player A rating after match
      - `player_b_rating_after` (integer, nullable) - player B rating after match
      - `start_time` (timestamptz) - match start timestamp
      - `end_time` (timestamptz, nullable) - match end timestamp
      - `duration_seconds` (integer, nullable) - actual match duration
      - `created_at` (timestamptz) - match creation time

    - `submissions`
      - `id` (uuid, primary key) - unique submission identifier
      - `match_id` (uuid) - associated match ID
      - `user_id` (uuid) - submitting user ID
      - `language` (text) - programming language used
      - `code` (text) - submitted code
      - `submitted_at` (timestamptz) - submission timestamp
      - `result` (text) - accepted/wrong_answer/runtime_error/time_limit/memory_limit
      - `score` (numeric) - test coverage score (0-100)
      - `passed_tests` (integer) - number of tests passed
      - `total_tests` (integer) - total number of tests
      - `runtime_ms` (integer, nullable) - execution time in milliseconds
      - `memory_kb` (integer, nullable) - memory used in kilobytes
      - `test_results` (jsonb) - detailed test case results
      - `is_winning_submission` (boolean) - whether this submission won the match

    - `code_snapshots`
      - `id` (uuid, primary key) - unique snapshot identifier
      - `match_id` (uuid) - associated match ID
      - `user_id` (uuid) - user ID
      - `code` (text) - code at snapshot time
      - `timestamp` (timestamptz) - when snapshot was taken

    - `leaderboard_entries`
      - `id` (uuid, primary key) - unique entry identifier
      - `user_id` (uuid) - user ID
      - `season` (text) - season identifier (e.g., "2025-W43")
      - `rating` (integer) - rating for this season
      - `rank` (integer, nullable) - rank position
      - `wins` (integer) - wins this season
      - `losses` (integer) - losses this season
      - `draws` (integer) - draws this season
      - `updated_at` (timestamptz) - last update time

    - `match_replays`
      - `id` (uuid, primary key) - unique replay identifier
      - `match_id` (uuid) - associated match ID
      - `player_a_timeline` (jsonb) - array of code snapshots for player A
      - `player_b_timeline` (jsonb) - array of code snapshots for player B
      - `events` (jsonb) - array of match events (submissions, test results, etc.)
      - `created_at` (timestamptz) - replay creation time

  2. Security
    - Enable RLS on all tables
    - Users can read their own data
    - Users can read public match/leaderboard data
    - Only authenticated users can submit code
    - Admins can manage problems

  3. Indexes
    - Index on duel_users.rating for matchmaking
    - Index on matches.status for active match queries
    - Index on leaderboard_entries (season, rating) for rankings
    - Index on submissions.match_id for replay queries

  4. Important Notes
    - Rating system uses ELO with K=32 for early games, decaying after 50 matches
    - Test cases stored as JSONB with structure: {input, expected_output, weight, hidden}
    - Match status flow: waiting → in_progress → completed/abandoned
    - Submission results: accepted, wrong_answer, runtime_error, time_limit_exceeded, memory_limit_exceeded
    - Snapshots taken every 30 seconds during match for replay functionality
*/

-- Create duel_users table
CREATE TABLE IF NOT EXISTS duel_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  rating integer DEFAULT 1200 NOT NULL,
  wins integer DEFAULT 0 NOT NULL,
  losses integer DEFAULT 0 NOT NULL,
  draws integer DEFAULT 0 NOT NULL,
  matches_played integer DEFAULT 0 NOT NULL,
  avatar_url text,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  statement text NOT NULL,
  difficulty text DEFAULT 'medium' NOT NULL,
  time_limit_seconds integer DEFAULT 900 NOT NULL,
  memory_limit_mb integer DEFAULT 256 NOT NULL,
  supported_languages jsonb DEFAULT '["python", "javascript", "java", "cpp"]'::jsonb NOT NULL,
  test_cases jsonb DEFAULT '[]'::jsonb NOT NULL,
  tags text[] DEFAULT ARRAY[]::text[] NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_a_id uuid REFERENCES duel_users(id) ON DELETE CASCADE NOT NULL,
  player_b_id uuid REFERENCES duel_users(id) ON DELETE CASCADE NOT NULL,
  problem_id uuid REFERENCES problems(id) ON DELETE CASCADE NOT NULL,
  match_type text DEFAULT 'ranked' NOT NULL,
  status text DEFAULT 'waiting' NOT NULL,
  winner_id uuid REFERENCES duel_users(id) ON DELETE SET NULL,
  player_a_rating_before integer NOT NULL,
  player_b_rating_before integer NOT NULL,
  player_a_rating_after integer,
  player_b_rating_after integer,
  start_time timestamptz,
  end_time timestamptz,
  duration_seconds integer,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_match_type CHECK (match_type IN ('ranked', 'casual', 'practice')),
  CONSTRAINT valid_status CHECK (status IN ('waiting', 'in_progress', 'completed', 'abandoned'))
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES duel_users(id) ON DELETE CASCADE NOT NULL,
  language text NOT NULL,
  code text NOT NULL,
  submitted_at timestamptz DEFAULT now() NOT NULL,
  result text DEFAULT 'pending' NOT NULL,
  score numeric(5,2) DEFAULT 0 NOT NULL,
  passed_tests integer DEFAULT 0 NOT NULL,
  total_tests integer DEFAULT 0 NOT NULL,
  runtime_ms integer,
  memory_kb integer,
  test_results jsonb DEFAULT '[]'::jsonb NOT NULL,
  is_winning_submission boolean DEFAULT false NOT NULL,
  CONSTRAINT valid_result CHECK (result IN ('pending', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'memory_limit_exceeded', 'compilation_error'))
);

-- Create code_snapshots table
CREATE TABLE IF NOT EXISTS code_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES duel_users(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  timestamp timestamptz DEFAULT now() NOT NULL
);

-- Create leaderboard_entries table
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES duel_users(id) ON DELETE CASCADE NOT NULL,
  season text DEFAULT '2025-W43' NOT NULL,
  rating integer DEFAULT 1200 NOT NULL,
  rank integer,
  wins integer DEFAULT 0 NOT NULL,
  losses integer DEFAULT 0 NOT NULL,
  draws integer DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, season)
);

-- Create match_replays table
CREATE TABLE IF NOT EXISTS match_replays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE UNIQUE NOT NULL,
  player_a_timeline jsonb DEFAULT '[]'::jsonb NOT NULL,
  player_b_timeline jsonb DEFAULT '[]'::jsonb NOT NULL,
  events jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_duel_users_rating ON duel_users(rating DESC);
CREATE INDEX IF NOT EXISTS idx_duel_users_auth_user_id ON duel_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_player_a ON matches(player_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_player_b ON matches(player_b_id);
CREATE INDEX IF NOT EXISTS idx_submissions_match_id ON submissions(match_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_code_snapshots_match_id ON code_snapshots(match_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_season_rating ON leaderboard_entries(season, rating DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_season ON leaderboard_entries(user_id, season);

-- Enable Row Level Security
ALTER TABLE duel_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_replays ENABLE ROW LEVEL SECURITY;

-- RLS Policies for duel_users
CREATE POLICY "Users can view all user profiles"
  ON duel_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON duel_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON duel_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- RLS Policies for problems
CREATE POLICY "Anyone can view active problems"
  ON problems FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage problems"
  ON problems FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM duel_users
      WHERE duel_users.auth_user_id = auth.uid()
      AND duel_users.email LIKE '%@admin.duocode%'
    )
  );

-- RLS Policies for matches
CREATE POLICY "Users can view own matches"
  ON matches FOR SELECT
  TO authenticated
  USING (
    player_a_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
    OR player_b_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can view completed matches"
  ON matches FOR SELECT
  TO authenticated
  USING (status = 'completed');

-- RLS Policies for submissions
CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    user_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can view submissions from completed matches"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = submissions.match_id
      AND matches.status = 'completed'
    )
  );

CREATE POLICY "Users can insert own submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
  );

-- RLS Policies for code_snapshots
CREATE POLICY "Users can insert own snapshots"
  ON code_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can view snapshots from own completed matches"
  ON code_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = code_snapshots.match_id
      AND matches.status = 'completed'
      AND (
        matches.player_a_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
        OR matches.player_b_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
      )
    )
  );

-- RLS Policies for leaderboard_entries
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard_entries FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for match_replays
CREATE POLICY "Users can view replays from own completed matches"
  ON match_replays FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_replays.match_id
      AND matches.status = 'completed'
      AND (
        matches.player_a_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
        OR matches.player_b_id IN (SELECT id FROM duel_users WHERE auth_user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Anyone can view replays from completed matches"
  ON match_replays FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_replays.match_id
      AND matches.status = 'completed'
    )
  );