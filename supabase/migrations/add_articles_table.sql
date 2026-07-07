-- Migration : table articles (blog / conseils)
create type article_type as enum ('article', 'expertise');

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titre text not null,
  type article_type not null default 'article',
  resume text,
  contenu text not null,
  image_url text,
  publie boolean not null default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger articles_updated_at
before update on articles
for each row execute function update_updated_at();

alter table articles enable row level security;

create policy "articles_select_published"
on articles for select
to anon, authenticated
using (publie = true);
