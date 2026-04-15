# Supabase setup (fase actual)

## 1) Variables de entorno
Crear `.env.local` con:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## 2) Ejecutar migraciones
En Supabase SQL Editor ejecutar en orden:
- `supabase/migrations/20260415_initial_schema.sql`
- `supabase/migrations/20260415_content_and_leads.sql`

## 3) Crear usuario admin
En Supabase Dashboard > Authentication > Users:
- crear usuario con email/password para `/admin/login`

## 4) Seed mínimo recomendado
- `categories`
- `products` (con `category_id`)
- `hero_slides`
- `benefits`
- una fila en `site_settings`

## 5) Ejecutar proyecto
```bash
npm run dev
```

Rutas:
- Público: `/`, `/catalogo`, `/producto/:slug`, `/presupuesto`
- Admin: 
  - `/admin/login`
  - `/admin`
  - `/admin/products`
  - `/admin/categories`
  - `/admin/hero-slides`
  - `/admin/benefits`
  - `/admin/site-settings`
  - `/admin/budgets`
  - `/admin/leads`

## Notas
- Si no hay variables Supabase, la app sigue funcionando con fallback mock/config.
- Auth admin utiliza Supabase Auth password grant por API REST.
