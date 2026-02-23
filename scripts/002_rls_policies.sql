-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wildcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- PROFILES: Everyone can read (for rankings), users can insert/update own
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- TEAMS: Public read only
CREATE POLICY "teams_select_all" ON public.teams FOR SELECT USING (true);

-- MATCHES: Public read only
CREATE POLICY "matches_select_all" ON public.matches FOR SELECT USING (true);

-- PREDICTIONS: Users can read all predictions (for social/ranking), insert/update own
CREATE POLICY "predictions_select_all" ON public.predictions FOR SELECT USING (true);
CREATE POLICY "predictions_insert_own" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "predictions_update_own" ON public.predictions FOR UPDATE USING (auth.uid() = user_id);

-- LEAGUES: Anyone authenticated can read leagues, create own, update/delete if owner
CREATE POLICY "leagues_select_all" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "leagues_insert_own" ON public.leagues FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "leagues_update_own" ON public.leagues FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "leagues_delete_own" ON public.leagues FOR DELETE USING (auth.uid() = owner_id);

-- LEAGUE MEMBERS: Read if authenticated, insert/delete own membership
CREATE POLICY "league_members_select_all" ON public.league_members FOR SELECT USING (true);
CREATE POLICY "league_members_insert_own" ON public.league_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "league_members_delete_own" ON public.league_members FOR DELETE USING (auth.uid() = user_id);

-- WILDCARDS: Users can only see and manage their own
CREATE POLICY "wildcards_select_own" ON public.wildcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wildcards_insert_own" ON public.wildcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wildcards_update_own" ON public.wildcards FOR UPDATE USING (auth.uid() = user_id);

-- ACHIEVEMENTS: Everyone can see achievements (public profiles), insert own
CREATE POLICY "achievements_select_all" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "achievements_insert_own" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
