-- Content + leads phase

alter table public.hero_slides
  add column if not exists badge text;

alter table public.site_settings
  add column if not exists site_name text,
  add column if not exists logo_url text,
  add column if not exists whatsapp_default_message text,
  add column if not exists address text,
  add column if not exists promo_general text,
  add column if not exists reusable_texts jsonb not null default '{}'::jsonb;

create table if not exists public.budget_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text unique not null,
  source text not null default 'web',
  customer_name text,
  customer_phone text,
  customer_email text,
  notes text,
  total_estimated numeric(12,2) not null default 0,
  status text not null default 'nuevo' check (status in ('nuevo','pendiente','atendido','cerrado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budget_request_items (
  id uuid primary key default gen_random_uuid(),
  budget_request_id uuid not null references public.budget_requests(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity numeric(12,2) not null,
  unit text,
  unit_price numeric(12,2) not null,
  subtotal numeric(12,2) not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'active',
  source text not null default 'web',
  created_at timestamptz not null default now()
);

alter table public.budget_requests enable row level security;
alter table public.budget_request_items enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy if not exists "auth read/write budget_requests" on public.budget_requests
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy if not exists "auth read/write budget_request_items" on public.budget_request_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy if not exists "auth read/write newsletter" on public.newsletter_subscribers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy if not exists "public insert budget_requests" on public.budget_requests
  for insert with check (true);

create policy if not exists "public insert budget_request_items" on public.budget_request_items
  for insert with check (true);

create policy if not exists "public insert newsletter" on public.newsletter_subscribers
  for insert with check (true);
