# Supabase setup (fase actual)

## 1) Variables de entorno
Crear `.env.local` con:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

## 2) Ejecutar migración base
En Supabase SQL Editor ejecutar:
- `supabase/migrations/20260415_initial_schema.sql`

## 3) Crear usuario admin
En Supabase Dashboard > Authentication > Users:
- crear usuario con email/password para `/admin/login`

## 4) (Opcional) seed mínimo recomendado
- Insertar categorías en `categories`
- Insertar productos en `products` enlazando `category_id`
- Insertar slides en `hero_slides`
- Insertar beneficios en `benefits`
- Insertar 1 fila en `site_settings`

## 5) Ejecutar proyecto
```bash
npm run dev
```

Rutas:
- Público: `/`, `/catalogo`, `/producto/:slug`, `/presupuesto`
- Admin: `/admin/login`, `/admin`, `/admin/products`, `/admin/categories`

## Notas
- Si no hay variables Supabase, la app sigue funcionando con fallback mock/config.
- Auth admin utiliza Supabase Auth password grant por API REST.
