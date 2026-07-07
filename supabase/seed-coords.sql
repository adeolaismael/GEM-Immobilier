-- Mise à jour de 5 biens avec des coordonnées GPS réelles d'Abidjan
-- À exécuter dans l'éditeur SQL Supabase

-- Cocody : lat 5.3667, lng -3.9833
-- Plateau : lat 5.3167, lng -4.0167
-- Yopougon : lat 5.3500, lng -4.0833

WITH cibles AS (
  SELECT id, row_number() OVER () AS rn
  FROM (SELECT id FROM biens ORDER BY created_at DESC LIMIT 5) sub
)
UPDATE biens b
SET
  latitude = CASE c.rn
    WHEN 1 THEN 5.3667
    WHEN 2 THEN 5.3167
    WHEN 3 THEN 5.3500
    WHEN 4 THEN 5.3667
    WHEN 5 THEN 5.3167
  END,
  longitude = CASE c.rn
    WHEN 1 THEN -3.9833
    WHEN 2 THEN -4.0167
    WHEN 3 THEN -4.0833
    WHEN 4 THEN -3.9833
    WHEN 5 THEN -4.0167
  END
FROM cibles c
WHERE b.id = c.id;
