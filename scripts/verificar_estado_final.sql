-- Verificar estado actual del partido 73
SELECT 
  id,
  status,
  score_home,
  score_away,
  match_date,
  team_home_id,
  team_away_id
FROM matches 
WHERE id = 73;

-- Verificar si el partido aparece en la consulta del admin
SELECT 
  id,
  status,
  score_home,
  score_away
FROM matches 
WHERE id = 73 
AND status IN ('upcoming', 'live', 'finished');
