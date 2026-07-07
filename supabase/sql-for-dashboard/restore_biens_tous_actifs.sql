-- À exécuter dans le SQL Editor Supabase si les biens ne s’affichent plus.
--
-- 1) S’assure que la colonne corbeille existe (sinon le site filtre sur une colonne inexistante).
-- 2) Remet TOUS les biens en « actif » (sortie de corbeille).

alter table biens add column if not exists deleted_at timestamptz null;

update biens
set
  deleted_at = null,
  updated_at = coalesce(updated_at, now())
where deleted_at is not null;

-- Après exécution : vérifiez avec
-- select id, titre, deleted_at from biens;
