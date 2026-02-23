-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, city)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', 'Usuario'),
    COALESCE(new.raw_user_meta_data ->> 'city', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Initialize wildcards for the new user (1 double + 1 insurance per stage)
  INSERT INTO public.wildcards (user_id, stage, wildcard_type)
  VALUES
    (new.id, 'group', 'double'),
    (new.id, 'group', 'insurance'),
    (new.id, 'round_of_32', 'double'),
    (new.id, 'round_of_32', 'insurance'),
    (new.id, 'round_of_16', 'double'),
    (new.id, 'round_of_16', 'insurance'),
    (new.id, 'quarter', 'double'),
    (new.id, 'quarter', 'insurance'),
    (new.id, 'semi', 'double'),
    (new.id, 'semi', 'insurance'),
    (new.id, 'final', 'double'),
    (new.id, 'final', 'insurance')
  ON CONFLICT (user_id, stage, wildcard_type) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
