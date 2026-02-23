-- Create all tables for Prode Mundial 2026

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  points_total INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Teams
CREATE TABLE IF NOT EXISTS public.teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  group_letter CHAR(1) NOT NULL,
  flag_emoji TEXT NOT NULL DEFAULT ''
);

-- Matches
CREATE TABLE IF NOT EXISTS public.matches (
  id SERIAL PRIMARY KEY,
  team_home_id INT NOT NULL REFERENCES public.teams(id),
  team_away_id INT NOT NULL REFERENCES public.teams(id),
  group_letter CHAR(1),
  match_date TIMESTAMPTZ NOT NULL,
  venue TEXT,
  stage TEXT NOT NULL DEFAULT 'group',
  status TEXT NOT NULL DEFAULT 'upcoming',
  score_home INT,
  score_away INT
);

-- Predictions
CREATE TABLE IF NOT EXISTS public.predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id INT NOT NULL REFERENCES public.matches(id),
  predicted_home INT NOT NULL,
  predicted_away INT NOT NULL,
  wildcard TEXT,
  points_earned INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, match_id)
);

-- Leagues
CREATE TABLE IF NOT EXISTS public.leagues (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- League members
CREATE TABLE IF NOT EXISTS public.league_members (
  id SERIAL PRIMARY KEY,
  league_id INT NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(league_id, user_id)
);

-- Wildcards
CREATE TABLE IF NOT EXISTS public.wildcards (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  wildcard_type TEXT NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  used_on_prediction_id INT REFERENCES public.predictions(id),
  UNIQUE(user_id, stage, wildcard_type)
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_key)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON public.predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON public.matches(match_date);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(points_total DESC);
CREATE INDEX IF NOT EXISTS idx_league_members_league ON public.league_members(league_id);
CREATE INDEX IF NOT EXISTS idx_league_members_user ON public.league_members(user_id);
CREATE INDEX IF NOT EXISTS idx_wildcards_user ON public.wildcards(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON public.achievements(user_id);
