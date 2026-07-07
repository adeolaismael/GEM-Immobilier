-- Migration : événements analytics marketing
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  bien_id uuid references biens(id) on delete set null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_type_created_at_idx
  on analytics_events (type, created_at desc);

create index if not exists analytics_events_bien_id_idx
  on analytics_events (bien_id);

create index if not exists analytics_events_created_at_idx
  on analytics_events (created_at desc);
