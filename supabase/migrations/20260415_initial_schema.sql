-- Base schema for public ecommerce + admin

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  image_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text unique not null,
  name text not null,
  description text,
  price numeric(12,2) not null,
  original_price numeric(12,2),
  image_url text,
  rating integer not null default 5,
  reviews integer not null default 0,
  in_stock boolean not null default true,
  badge text,
  features text[] not null default '{}',
  unit text not null check (unit in ('m2','unidad','kg')),
  min_quantity integer not null default 1,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null,
  description text,
  image_url text,
  cta_label text,
  cta_target text not null default '/catalogo',
  gradient text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.benefits (
  id uuid primary key default gen_random_uuid(),
  icon text not null,
  title text not null,
  description text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text,
  phone text,
  email text,
  city text,
  facebook_url text,
  instagram_url text,
  free_shipping_threshold numeric(12,2) default 0,
  locale text default 'es-PY',
  currency text default 'PYG',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.hero_slides enable row level security;
alter table public.benefits enable row level security;
alter table public.site_settings enable row level security;

-- Public read access
create policy if not exists "public read categories" on public.categories
  for select using (active = true);

create policy if not exists "public read products" on public.products
  for select using (active = true);

create policy if not exists "public read hero" on public.hero_slides
  for select using (active = true);

create policy if not exists "public read benefits" on public.benefits
  for select using (active = true);

create policy if not exists "public read site settings" on public.site_settings
  for select using (true);

-- Authenticated admin write (upgrade with role claims in next phase)
create policy if not exists "auth write categories" on public.categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy if not exists "auth write products" on public.products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy if not exists "auth write hero" on public.hero_slides
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy if not exists "auth write benefits" on public.benefits
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy if not exists "auth write settings" on public.site_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
