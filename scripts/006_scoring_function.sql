-- Scoring function: calculates points for all predictions on a finished match
-- Exact score = 3 pts, correct winner/draw = 1 pt, wrong = 0 pts
-- Wildcards: double = x2 points, insurance = minimum 1 pt if any part correct

CREATE OR REPLACE FUNCTION public.calculate_scores(p_match_id INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score_home INT;
  v_score_away INT;
  v_match_status TEXT;
  rec RECORD;
  v_base_points INT;
  v_final_points INT;
BEGIN
  -- Get the match result
  SELECT score_home, score_away, status
  INTO v_score_home, v_score_away, v_match_status
  FROM public.matches
  WHERE id = p_match_id;

  -- Only score finished matches
  IF v_match_status != 'finished' THEN
    RAISE EXCEPTION 'Match % is not finished (status: %)', p_match_id, v_match_status;
  END IF;

  -- Loop through all predictions for this match
  FOR rec IN
    SELECT p.id, p.user_id, p.predicted_home, p.predicted_away, p.wildcard
    FROM public.predictions p
    WHERE p.match_id = p_match_id
  LOOP
    v_base_points := 0;

    -- Check exact score
    IF rec.predicted_home = v_score_home AND rec.predicted_away = v_score_away THEN
      v_base_points := 3;
    -- Check correct winner/draw
    ELSIF (
      (rec.predicted_home > rec.predicted_away AND v_score_home > v_score_away) OR
      (rec.predicted_home < rec.predicted_away AND v_score_home < v_score_away) OR
      (rec.predicted_home = rec.predicted_away AND v_score_home = v_score_away)
    ) THEN
      v_base_points := 1;
    END IF;

    -- Apply wildcard
    v_final_points := v_base_points;
    IF rec.wildcard = 'double' THEN
      v_final_points := v_base_points * 2;
    ELSIF rec.wildcard = 'insurance' AND v_base_points = 0 THEN
      -- Insurance gives 1 point even on wrong prediction
      v_final_points := 1;
    END IF;

    -- Update prediction points
    UPDATE public.predictions
    SET points_earned = v_final_points
    WHERE id = rec.id;

  END LOOP;

  -- Recalculate total points for all users who had predictions on this match
  UPDATE public.profiles
  SET points_total = (
    SELECT COALESCE(SUM(points_earned), 0)
    FROM public.predictions
    WHERE predictions.user_id = profiles.id
  )
  WHERE id IN (
    SELECT DISTINCT user_id
    FROM public.predictions
    WHERE match_id = p_match_id
  );

END;
$$;
