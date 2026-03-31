-- À exécuter dans le SQL Editor Supabase si vous n’utilisez pas les migrations locales.
-- Ajoute la corbeille (suppression logique) pour les biens.

alter table biens add column if not exists deleted_at timestamptz null;

create index if not exists biens_deleted_at_idx on biens (deleted_at);
