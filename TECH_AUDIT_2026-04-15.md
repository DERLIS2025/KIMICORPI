# Auditoría técnica — React + Vite + TypeScript (Corpi & Cia)

Fecha: 2026-04-15

## A. Resumen ejecutivo
- La app actual es un frontend monolítico SPA sin enrutador, con navegación por `useState` en `App.tsx`.
- El modelo de negocio de “catálogo + presupuesto + cierre por WhatsApp” está bien representado en UX, pero está 100% hardcodeado en frontend.
- Riesgo principal: baja escalabilidad operativa (productos, precios, banners, textos, teléfono WhatsApp, categorías y contenido de marketing no son administrables).
- Recomendación estratégica: mantener el frontend público, introducir React Router, extraer dominio a servicios/hooks, e incorporar Supabase (Auth + Postgres + Storage) con un panel admin separado por rutas y permisos.

## B. Diagnóstico técnico actual
- **Stack**: React 19 + Vite 7 + TypeScript estricto + Tailwind + Radix/shadcn + Zustand instalado pero no utilizado.
- **Arquitectura actual**: feature única en `src/` con separación parcial por carpetas (`sections`, `views`, `store`, `data`, `types`).
- **Estado global**: Context API (`BudgetContext`) para carrito/presupuesto en memoria (sin persistencia).
- **Navegación**: condicional por estado (`currentView`), sin URLs compartibles ni rutas profundas.
- **Datos**: categorías y productos in-memory (`src/data/products.ts`).
- **Integración externa**: WhatsApp mediante `wa.me` con número fijo.
- **Calidad**: `npm run build` compila, pero `npm run lint` falla por reglas en componentes UI generados y una advertencia de hook.

## C. Hallazgos por archivo o módulo
### Configuración
- `package.json`: dependencia muy amplia para un proyecto pequeño; varias librerías no se usan en el flujo actual (gran set shadcn/Radix).
- `vite.config.ts`: alias `@` correcto; `base: './'` sugiere despliegue estático relativo; plugin `kimi-plugin-inspect-react` activo.
- `tsconfig.*`: modo estricto correcto; buena base para escalar.
- `eslint.config.js`: configuración estándar; actualmente rompe lint en archivos UI autogenerados.

### Entrada y shell
- `src/main.tsx`: bootstrap limpio y mínimo.
- `src/App.tsx`: concentra toda la orquestación de vistas + scroll + estado de navegación.

### Dominio catálogo/presupuesto
- `src/data/products.ts`: catálogo, categorías, formato de precio, utilidades y reglas mínimas (unidad/cantidad mínima) embebidas.
- `src/store/BudgetContext.tsx`: lógica de presupuesto y composición del mensaje WhatsApp acopladas al contexto de UI.
- `src/views/CatalogView.tsx`: filtros, búsqueda y orden en cliente sobre dataset local.
- `src/views/ProductView.tsx`: detalle, relacionados por categoría, agregar al presupuesto y WhatsApp directo.
- `src/views/BudgetView.tsx`: edición de cantidades/notas + envío final por WhatsApp.

### Secciones marketing
- `Hero`, `Categories`, `FeaturedProducts`, `Benefits`, `Newsletter`, `Footer` contienen copy y contenido de negocio hardcodeado.
- `Newsletter` no persiste suscripciones (solo estado local “submitted”).

### UI y reutilización
- Existe una librería extensa en `src/components/ui/*`, pero en la app pública solo se consumen de forma directa `Button`, `Input`, `Badge`.
- Hay oportunidad de reducir superficie de mantenimiento si no se usará todo el set.

## D. Contenido hardcodeado detectado
- Número de WhatsApp fijo (`595992588770`) en Header/Product/Budget.
- Social links, email, ciudad y claims comerciales en Footer.
- Banners/promociones (“envío gratis > Gs. 500.000”).
- Productos, categorías, precios, badges, stock, reseñas y features.
- Textos de home (hero slides, beneficios, newsletter, CTAs).
- Reglas de incremento por unidad (m² suma/resta de 5) embebidas en componentes.

## E. Arquitectura recomendada
1. **Separación por dominios (feature-first)**
   - `catalog`, `budget`, `marketing`, `admin`, `shared`.
2. **Capa de datos y servicios**
   - Repositorios tipados (`catalog.service.ts`, `budget.service.ts`, `settings.service.ts`).
   - Validación con Zod antes de persistir/consumir.
3. **Routing explícito**
   - Migrar de `useState` a React Router para URLs públicas/admin y guards.
4. **Configuración centralizada**
   - `src/config/app.ts` + `src/config/integrations.ts` (WhatsApp, moneda, país, thresholds).
5. **Estado**
   - Mantener Context o migrar a Zustand para presupuesto + persistencia local + sync eventual.
6. **Backend BaaS (Supabase)**
   - Auth para admin, Postgres para catálogo/config, Storage para imágenes.
7. **Panel admin profesional**
   - CRUD de productos/categorías/promos/contenido y settings de negocio.
   - Historial de solicitudes de presupuesto enviadas por WhatsApp (lead tracking).

## F. Estructura de carpetas propuesta
```txt
src/
  app/
    router.tsx
    providers.tsx
  public-site/
    pages/
    sections/
    components/
  admin/
    pages/
    components/
    guards/
  domains/
    catalog/
      components/
      hooks/
      services/
      schemas/
      types/
    budget/
      components/
      hooks/
      services/
      schemas/
      types/
    marketing/
      services/
      schemas/
      types/
    settings/
      services/
      schemas/
      types/
  integrations/
    supabase/
      client.ts
      mappers.ts
    whatsapp/
      buildMessage.ts
  shared/
    ui/
    lib/
    hooks/
    config/
    types/
```

## G. Base de datos propuesta (Supabase)
### Tablas núcleo
- `categories` (id, slug, name, description, icon, image_url, active, sort_order)
- `products` (id, slug, name, description, price, original_price, unit, min_quantity, stock_status, active, category_id, sort_order)
- `product_media` (id, product_id, url, alt, is_cover, sort_order)
- `product_features` (id, product_id, label, sort_order)
- `promotions` (id, title, badge, discount_type, discount_value, starts_at, ends_at, active)
- `site_settings` (id, whatsapp_number, contact_email, city, free_shipping_threshold, currency, locale)
- `homepage_sections` (id, section_key, title, subtitle, body, cta_label, cta_target, active)
- `budget_requests` (id, customer_name?, phone?, notes?, total_estimated, source, created_at)
- `budget_request_items` (id, request_id, product_id, product_snapshot_json, quantity, unit_price, subtotal, notes)
- `newsletter_subscribers` (id, email, status, created_at)

### Seguridad
- RLS: lectura pública solo para entidades activas; escritura solo role `admin`.
- `auth.users` + tabla `profiles` con rol.

## H. Plan de migración por fases
1. **Fase 0 (estabilización)**: limpiar lint/build warnings críticos y extraer constantes de negocio.
2. **Fase 1 (routing)**: React Router sin romper UI pública (`/`, `/catalogo`, `/producto/:slug`, `/presupuesto`).
3. **Fase 2 (modelo de datos)**: definir schemas Zod + tipos dominio + servicios mock.
4. **Fase 3 (Supabase read-only)**: consumir categorías/productos/settings desde DB; fallback local.
5. **Fase 4 (admin MVP)**: login + CRUD categorías/productos + settings de WhatsApp/contacto.
6. **Fase 5 (lead ops)**: registrar solicitudes y métricas de conversión a WhatsApp.
7. **Fase 6 (optimización)**: caching, imágenes optimizadas, permisos finos y auditoría.

## I. Lista de archivos actuales a modificar
- `src/App.tsx` (routing shell).
- `src/types/index.ts` (tipos por dominio).
- `src/data/products.ts` (migrar a servicio/fallback seed).
- `src/store/BudgetContext.tsx` (separar lógica WhatsApp y persistencia).
- `src/views/*` (consumir servicios/hooks y params de ruta).
- `src/sections/*` (contenido dinámico por CMS/DB).
- `src/components/ProductCard.tsx` (reglas de cantidad y estado desde dominio).
- `vite.config.ts` y configs según estrategia deploy/admin.

## J. Lista de archivos nuevos a crear
- `src/app/router.tsx`
- `src/app/providers.tsx`
- `src/config/app.ts`
- `src/config/integrations.ts`
- `src/integrations/supabase/client.ts`
- `src/integrations/whatsapp/buildMessage.ts`
- `src/domains/catalog/services/catalog.service.ts`
- `src/domains/budget/services/budget.service.ts`
- `src/domains/settings/services/settings.service.ts`
- `src/admin/pages/*` (Dashboard, Productos, Categorías, Contenido, Ajustes)
- `supabase/migrations/*.sql`
- `supabase/seed.sql`

## K. Riesgos y recomendaciones finales
- **Riesgo de inconsistencia comercial**: precios/promos fijos en frontend.
- **Riesgo operativo**: sin panel/admin, cada cambio requiere deploy.
- **Riesgo técnico**: navegación sin router limita SEO, tracking y escalabilidad de features.
- **Riesgo de mantenibilidad**: lógica de negocio mezclada con componentes de presentación.
- **Riesgo de calidad**: lint en rojo por componentes UI no utilizados afecta disciplina CI.

Recomendación final: avanzar con una migración incremental que preserve la UX actual, priorice configuración dinámica (WhatsApp, catálogo y contenido), y habilite un admin real con Supabase + RLS desde el primer MVP.
