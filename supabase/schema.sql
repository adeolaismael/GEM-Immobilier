-- Types ENUM
create type bien_type as enum ('vente', 'location');
create type bien_statut as enum ('disponible', 'sous_compromis', 'vendu', 'loue');

-- Biens
create table biens (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titre text not null,
  description text,
  type bien_type not null,
  statut bien_statut not null default 'disponible',
  prix numeric not null,
  surface numeric,
  nb_pieces integer,
  nb_chambres integer,
  nb_salles_de_bain integer,
  adresse text,
  ville text,
  quartier text,
  latitude numeric,
  longitude numeric,
  featured boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Photos
create table bien_photos (
  id uuid primary key default gen_random_uuid(),
  bien_id uuid references biens(id) on delete cascade,
  url text not null,
  ordre integer default 0,
  est_principale boolean default false
);

-- Agents
create table agents (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  email text unique,
  telephone text,
  photo_url text,
  bio text,
  created_at timestamptz default now()
);

-- Messages contact
create table messages_contact (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  telephone text,
  sujet text,
  message text not null,
  bien_id uuid references biens(id) on delete set null,
  lu boolean default false,
  created_at timestamptz default now()
);

-- Trigger updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger biens_updated_at
before update on biens
for each row execute function update_updated_at();

-- Contenu éditable des pages (fusion côté app avec les valeurs par défaut)
create table site_pages (
  slug text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger site_pages_updated_at
before update on site_pages
for each row execute function update_updated_at();

alter table site_pages enable row level security;

create policy "site_pages_select_public"
on site_pages for select
to anon, authenticated
using (true);

