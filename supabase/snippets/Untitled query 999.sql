create table if not exists linkedin_import_summaries (
  id uuid primary key default gen_random_uuid(),
  date_range_text text, -- Ex: "Jan 1, 2025 - Jan 7, 2025"
  total_impressions integer,
  total_engagements integer,
  total_members_reached integer, -- Essa é a métrica PRECIOSA que só tem aqui
  imported_at timestamp with time zone default now()
);