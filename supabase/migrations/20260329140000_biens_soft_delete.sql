-- Suppression logique des biens (corbeille admin)
alter table biens add column if not exists deleted_at timestamptz null;

create index if not exists biens_deleted_at_idx on biens (deleted_at);
