-- Seed group stage matches (72 matches, 6 per group)
-- World Cup 2026: June 11 - July 19
-- Group stage: June 11 - June 27

-- Helper: We reference teams by their code. First let's create a temp function.
-- We'll use subqueries to get team IDs by code.

-- GROUP A matches (Mexico, Sudafrica, Corea del Sur, Repechaje Europa D)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='MEX'), (SELECT id FROM public.teams WHERE code='RSA'), 'A', '2026-06-11 18:00:00+00', 'Estadio Azteca, Ciudad de Mexico', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='KOR'), (SELECT id FROM public.teams WHERE code='EUD'), 'A', '2026-06-11 21:00:00+00', 'AT&T Stadium, Dallas', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='MEX'), (SELECT id FROM public.teams WHERE code='KOR'), 'A', '2026-06-16 18:00:00+00', 'Estadio Azteca, Ciudad de Mexico', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='RSA'), (SELECT id FROM public.teams WHERE code='EUD'), 'A', '2026-06-16 21:00:00+00', 'NRG Stadium, Houston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='RSA'), (SELECT id FROM public.teams WHERE code='KOR'), 'A', '2026-06-21 18:00:00+00', 'AT&T Stadium, Dallas', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='MEX'), (SELECT id FROM public.teams WHERE code='EUD'), 'A', '2026-06-21 18:00:00+00', 'Estadio Azteca, Ciudad de Mexico', 'group', 'upcoming');

-- GROUP B matches (Canada, Repechaje Europa A, Qatar, Suiza)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='CAN'), (SELECT id FROM public.teams WHERE code='EUA'), 'B', '2026-06-12 15:00:00+00', 'BC Place, Vancouver', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='QAT'), (SELECT id FROM public.teams WHERE code='SUI'), 'B', '2026-06-12 18:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='CAN'), (SELECT id FROM public.teams WHERE code='QAT'), 'B', '2026-06-17 15:00:00+00', 'BC Place, Vancouver', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='EUA'), (SELECT id FROM public.teams WHERE code='SUI'), 'B', '2026-06-17 18:00:00+00', 'Hard Rock Stadium, Miami', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='EUA'), (SELECT id FROM public.teams WHERE code='QAT'), 'B', '2026-06-22 15:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='CAN'), (SELECT id FROM public.teams WHERE code='SUI'), 'B', '2026-06-22 15:00:00+00', 'BC Place, Vancouver', 'group', 'upcoming');

-- GROUP C matches (Brasil, Marruecos, Haiti, Escocia)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='BRA'), (SELECT id FROM public.teams WHERE code='MAR'), 'C', '2026-06-12 21:00:00+00', 'MetLife Stadium, Nueva Jersey', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='HAI'), (SELECT id FROM public.teams WHERE code='SCO'), 'C', '2026-06-13 00:00:00+00', 'Lumen Field, Seattle', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='BRA'), (SELECT id FROM public.teams WHERE code='HAI'), 'C', '2026-06-17 21:00:00+00', 'MetLife Stadium, Nueva Jersey', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='MAR'), (SELECT id FROM public.teams WHERE code='SCO'), 'C', '2026-06-18 00:00:00+00', 'Lumen Field, Seattle', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='MAR'), (SELECT id FROM public.teams WHERE code='HAI'), 'C', '2026-06-22 21:00:00+00', 'MetLife Stadium, Nueva Jersey', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='BRA'), (SELECT id FROM public.teams WHERE code='SCO'), 'C', '2026-06-22 21:00:00+00', 'Lumen Field, Seattle', 'group', 'upcoming');

-- GROUP D matches (Estados Unidos, Paraguay, Australia, Repechaje Europa C)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='USA'), (SELECT id FROM public.teams WHERE code='PAR'), 'D', '2026-06-13 18:00:00+00', 'SoFi Stadium, Los Angeles', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='AUS'), (SELECT id FROM public.teams WHERE code='EUC'), 'D', '2026-06-13 21:00:00+00', 'Levi''s Stadium, San Francisco', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='USA'), (SELECT id FROM public.teams WHERE code='AUS'), 'D', '2026-06-18 18:00:00+00', 'SoFi Stadium, Los Angeles', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='PAR'), (SELECT id FROM public.teams WHERE code='EUC'), 'D', '2026-06-18 21:00:00+00', 'Levi''s Stadium, San Francisco', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='PAR'), (SELECT id FROM public.teams WHERE code='AUS'), 'D', '2026-06-23 18:00:00+00', 'AT&T Stadium, Dallas', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='USA'), (SELECT id FROM public.teams WHERE code='EUC'), 'D', '2026-06-23 18:00:00+00', 'SoFi Stadium, Los Angeles', 'group', 'upcoming');

-- GROUP E matches (Alemania, Ecuador, Costa de Marfil, Curacao)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='GER'), (SELECT id FROM public.teams WHERE code='ECU'), 'E', '2026-06-13 15:00:00+00', 'Lincoln Financial Field, Philadelphia', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='CIV'), (SELECT id FROM public.teams WHERE code='CUW'), 'E', '2026-06-14 00:00:00+00', 'GEODIS Park, Nashville', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='GER'), (SELECT id FROM public.teams WHERE code='CIV'), 'E', '2026-06-18 15:00:00+00', 'Lincoln Financial Field, Philadelphia', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ECU'), (SELECT id FROM public.teams WHERE code='CUW'), 'E', '2026-06-19 00:00:00+00', 'GEODIS Park, Nashville', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ECU'), (SELECT id FROM public.teams WHERE code='CIV'), 'E', '2026-06-23 15:00:00+00', 'Lincoln Financial Field, Philadelphia', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='GER'), (SELECT id FROM public.teams WHERE code='CUW'), 'E', '2026-06-23 15:00:00+00', 'GEODIS Park, Nashville', 'group', 'upcoming');

-- GROUP F matches (Paises Bajos, Japon, Repechaje Europa B, Tunez)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='NED'), (SELECT id FROM public.teams WHERE code='JPN'), 'F', '2026-06-14 15:00:00+00', 'Hard Rock Stadium, Miami', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='EUB'), (SELECT id FROM public.teams WHERE code='TUN'), 'F', '2026-06-14 18:00:00+00', 'Gillette Stadium, Boston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='NED'), (SELECT id FROM public.teams WHERE code='EUB'), 'F', '2026-06-19 15:00:00+00', 'Hard Rock Stadium, Miami', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='JPN'), (SELECT id FROM public.teams WHERE code='TUN'), 'F', '2026-06-19 18:00:00+00', 'Gillette Stadium, Boston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='JPN'), (SELECT id FROM public.teams WHERE code='EUB'), 'F', '2026-06-24 15:00:00+00', 'Hard Rock Stadium, Miami', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='NED'), (SELECT id FROM public.teams WHERE code='TUN'), 'F', '2026-06-24 15:00:00+00', 'Gillette Stadium, Boston', 'group', 'upcoming');

-- GROUP G matches (Belgica, Egipto, Iran, Nueva Zelanda)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='BEL'), (SELECT id FROM public.teams WHERE code='EGY'), 'G', '2026-06-14 21:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='IRN'), (SELECT id FROM public.teams WHERE code='NZL'), 'G', '2026-06-15 00:00:00+00', 'NRG Stadium, Houston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='BEL'), (SELECT id FROM public.teams WHERE code='IRN'), 'G', '2026-06-19 21:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='EGY'), (SELECT id FROM public.teams WHERE code='NZL'), 'G', '2026-06-20 00:00:00+00', 'NRG Stadium, Houston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='EGY'), (SELECT id FROM public.teams WHERE code='IRN'), 'G', '2026-06-24 21:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='BEL'), (SELECT id FROM public.teams WHERE code='NZL'), 'G', '2026-06-24 21:00:00+00', 'NRG Stadium, Houston', 'group', 'upcoming');

-- GROUP H matches (Espana, Uruguay, Arabia Saudita, Cabo Verde)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='ESP'), (SELECT id FROM public.teams WHERE code='URU'), 'H', '2026-06-15 18:00:00+00', 'MetLife Stadium, Nueva Jersey', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='KSA'), (SELECT id FROM public.teams WHERE code='CPV'), 'H', '2026-06-15 15:00:00+00', 'Levi''s Stadium, San Francisco', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ESP'), (SELECT id FROM public.teams WHERE code='KSA'), 'H', '2026-06-20 18:00:00+00', 'MetLife Stadium, Nueva Jersey', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='URU'), (SELECT id FROM public.teams WHERE code='CPV'), 'H', '2026-06-20 15:00:00+00', 'Levi''s Stadium, San Francisco', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='URU'), (SELECT id FROM public.teams WHERE code='KSA'), 'H', '2026-06-25 18:00:00+00', 'MetLife Stadium, Nueva Jersey', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ESP'), (SELECT id FROM public.teams WHERE code='CPV'), 'H', '2026-06-25 18:00:00+00', 'Levi''s Stadium, San Francisco', 'group', 'upcoming');

-- GROUP I matches (Francia, Senegal, Repechaje Int. 2, Noruega)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='FRA'), (SELECT id FROM public.teams WHERE code='SEN'), 'I', '2026-06-15 21:00:00+00', 'Lincoln Financial Field, Philadelphia', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='IP2'), (SELECT id FROM public.teams WHERE code='NOR'), 'I', '2026-06-16 00:00:00+00', 'GEODIS Park, Nashville', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='FRA'), (SELECT id FROM public.teams WHERE code='IP2'), 'I', '2026-06-20 21:00:00+00', 'Lincoln Financial Field, Philadelphia', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='SEN'), (SELECT id FROM public.teams WHERE code='NOR'), 'I', '2026-06-21 00:00:00+00', 'GEODIS Park, Nashville', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='SEN'), (SELECT id FROM public.teams WHERE code='IP2'), 'I', '2026-06-25 21:00:00+00', 'Lincoln Financial Field, Philadelphia', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='FRA'), (SELECT id FROM public.teams WHERE code='NOR'), 'I', '2026-06-25 21:00:00+00', 'GEODIS Park, Nashville', 'group', 'upcoming');

-- GROUP J matches (Argentina, Argelia, Austria, Jordania)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='ARG'), (SELECT id FROM public.teams WHERE code='ALG'), 'J', '2026-06-16 15:00:00+00', 'Hard Rock Stadium, Miami', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='AUT'), (SELECT id FROM public.teams WHERE code='JOR'), 'J', '2026-06-16 18:00:00+00', 'Gillette Stadium, Boston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ARG'), (SELECT id FROM public.teams WHERE code='AUT'), 'J', '2026-06-21 15:00:00+00', 'Hard Rock Stadium, Miami', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ALG'), (SELECT id FROM public.teams WHERE code='JOR'), 'J', '2026-06-21 18:00:00+00', 'Gillette Stadium, Boston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ALG'), (SELECT id FROM public.teams WHERE code='AUT'), 'J', '2026-06-26 15:00:00+00', 'Hard Rock Stadium, Miami', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ARG'), (SELECT id FROM public.teams WHERE code='JOR'), 'J', '2026-06-26 15:00:00+00', 'Gillette Stadium, Boston', 'group', 'upcoming');

-- GROUP K matches (Portugal, Colombia, Uzbekistan, Repechaje Int. 1)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='POR'), (SELECT id FROM public.teams WHERE code='COL'), 'K', '2026-06-16 21:00:00+00', 'SoFi Stadium, Los Angeles', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='UZB'), (SELECT id FROM public.teams WHERE code='IP1'), 'K', '2026-06-17 00:00:00+00', 'BC Place, Vancouver', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='POR'), (SELECT id FROM public.teams WHERE code='UZB'), 'K', '2026-06-21 21:00:00+00', 'SoFi Stadium, Los Angeles', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='COL'), (SELECT id FROM public.teams WHERE code='IP1'), 'K', '2026-06-22 00:00:00+00', 'BC Place, Vancouver', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='COL'), (SELECT id FROM public.teams WHERE code='UZB'), 'K', '2026-06-26 21:00:00+00', 'SoFi Stadium, Los Angeles', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='POR'), (SELECT id FROM public.teams WHERE code='IP1'), 'K', '2026-06-26 21:00:00+00', 'BC Place, Vancouver', 'group', 'upcoming');

-- GROUP L matches (Inglaterra, Croacia, Ghana, Panama)
INSERT INTO public.matches (team_home_id, team_away_id, group_letter, match_date, venue, stage, status) VALUES
((SELECT id FROM public.teams WHERE code='ENG'), (SELECT id FROM public.teams WHERE code='CRO'), 'L', '2026-06-17 18:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='GHA'), (SELECT id FROM public.teams WHERE code='PAN'), 'L', '2026-06-17 21:00:00+00', 'NRG Stadium, Houston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ENG'), (SELECT id FROM public.teams WHERE code='GHA'), 'L', '2026-06-22 18:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='CRO'), (SELECT id FROM public.teams WHERE code='PAN'), 'L', '2026-06-22 21:00:00+00', 'NRG Stadium, Houston', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='CRO'), (SELECT id FROM public.teams WHERE code='GHA'), 'L', '2026-06-27 18:00:00+00', 'Mercedes-Benz Stadium, Atlanta', 'group', 'upcoming'),
((SELECT id FROM public.teams WHERE code='ENG'), (SELECT id FROM public.teams WHERE code='PAN'), 'L', '2026-06-27 18:00:00+00', 'NRG Stadium, Houston', 'group', 'upcoming');
