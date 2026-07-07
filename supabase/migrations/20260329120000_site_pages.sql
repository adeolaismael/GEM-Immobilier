-- Contenu éditable des pages (admin).
-- Dans le dashboard Supabase : ouvrir le FICHIER et copier son CONTENU SQL (pas le nom du fichier).
-- Fichier prêt à coller : supabase/sql-for-dashboard/site_pages.sql

create table if not exists site_pages (
  slug text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_pages_updated_at on site_pages;
create trigger site_pages_updated_at
before update on site_pages
for each row execute function update_updated_at();

alter table site_pages enable row level security;

drop policy if exists "site_pages_select_public" on site_pages;
create policy "site_pages_select_public"
on site_pages for select
to anon, authenticated
using (true);
