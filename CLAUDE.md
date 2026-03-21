# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Six1Five Studio Reality Capture Portfolio - A professional portfolio website for a reality capture company specializing in drone mapping, LiDAR scanning, and photogrammetry for AEC industries.

**Tech Stack**: React 18 + Vite + TypeScript + Express.js + Drizzle ORM (PostgreSQL/SQLite) + Wouter routing + TailwindCSS

**Important**: This is a **Vite + React SPA**, NOT Next.js. Navigation uses Wouter's `<Link>` component.

## Commands

```bash
# Development
npm run dev          # Start dev server (localhost:5000)
npm run build        # Build client (Vite) + server (esbuild)
npm run check        # TypeScript type checking

# Database
npm run db:push      # Sync Drizzle schema (PostgreSQL)
drizzle-kit push --config=drizzle.config.local.ts  # Sync schema (SQLite local dev)

# Common scripts (run with tsx)
tsx scripts/setup-database.ts          # Initialize + seed database
tsx scripts/add-portfolio-item.ts      # Add portfolio item
tsx scripts/add-blog-post.ts           # Add blog post
tsx scripts/hash-password.ts           # Generate bcrypt hash for admin
```

**No test framework is configured.** Verify changes with `npm run check` (TypeScript) and manual testing.

## Architecture

### Single Source of Truth: `shared/schema.ts`

Drizzle table definitions, Zod insert schemas, and TypeScript types all live in one file. Both client (via `@shared/schema`) and server (via `../shared/schema.js`) import from here. No separate DTO layer — `PortfolioItem`, `BlogPost`, etc. are used everywhere.

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*` (Vite only)

### Dual Database Mode

The project supports SQLite (local) and PostgreSQL (production):

| Mode | Config | When |
|------|--------|------|
| SQLite | `USE_SQLITE=true` in `.env` | Local development (default) |
| PostgreSQL | `USE_SQLITE=false` + `DATABASE_URL` | Production |

**Critical**: Arrays are stored as JSON strings in SQLite but native arrays in PostgreSQL. The storage layer (`server/storage.ts`) handles conversion via helper functions: `mapPortfolioColumns()` / `mapBlogPostColumns()` / `mapReviewColumns()` (snake_case → camelCase) and `deserializeArrayFields()` (JSON string → array). SQLite paths use raw SQL while PostgreSQL uses Drizzle's query builder.

Three Drizzle configs exist:

| Config | DB | Use |
|--------|----|-----|
| `drizzle.config.ts` | PostgreSQL | `npm run db:push` (production) |
| `drizzle.config.local.ts` | SQLite → `local.db` | `drizzle-kit push --config=drizzle.config.local.ts` |
| `drizzle-push-auto.config.ts` | PostgreSQL | Auto-push with verbose/strict, outputs to `./drizzle` |

`scripts/init-local-db.ts` is outdated (missing columns) — use `drizzle-kit push --config=drizzle.config.local.ts` instead.

### Routing & Lazy Loading

Only `Home` is eagerly loaded. All other routes use `React.lazy()` with per-route `<Suspense>` + `<ErrorBoundary>` in `App.tsx`.

**Adding a route**: Create page in `client/src/pages/`, add lazy import + `<Route>` in `App.tsx`.

### Landing Pages (Config-Driven)

Landing pages use a template pattern — no backend changes needed:

1. Create `client/src/pages/{slug}.tsx` with a `LandingPageConfig` object
2. Return `<LandingPageTemplate config={config} />` (from `@/components/landing-page-template`)
3. Lazy-import in `App.tsx` and add `<Route>`

The template renders 9 sections (Hero, Trust Signals, Benefits, Portfolio Showcase, How It Works, etc.) from the config. Portfolio items are filtered by `config.portfolioFilter` category. Contact submissions go through `QuickQuoteForm` → `POST /api/contact` with `[Quick Quote from {pageName}]` prefix in `projectDetails`. UTM params from `client/src/lib/utm.ts` are appended automatically.

Existing landing pages: `/drone-mapping-nashville`, `/construction-progress-surveys`.

### TanStack Query Convention

The query key IS the API URL path:
```ts
useQuery({ queryKey: ['/api/portfolio'], queryFn: getQueryFn({ on401: "returnNull" }) })
```
Mutations use `apiRequest(method, url, data)` from `@/lib/queryClient`. Default: 5-minute staleTime, 10-minute gcTime.

### Auth Flow

JWT stored in `localStorage` as `adminToken`. Helper `getAuthHeaders()` in `admin.tsx` creates the Bearer header. Stateless — logout just clears localStorage. Token expires after 8 hours. In dev mode without `ADMIN_PASSWORD_HASH`, plain-text comparison is used (default password: `admin615`).

### Server Routes (`server/routes.ts`)

All routes in a single `registerRoutes(app)` function. Key patterns:

- **Unprotected create**: `POST /api/blog` and `POST /api/portfolio` have **no auth** (used by seeding scripts)
- **Admin CRUD**: `PUT`/`DELETE` under `/api/admin/` are protected with `requireAuth`
- **Rate limiting** (skipped in development): contact 3/15min, login 5/15min, leads 5/15min, general admin 100/min
- **File uploads**: Multer — contact submissions to `server/uploads/`, admin images to `client/public/assets/{type}-images/`
- **Email**: Resend client conditionally initialized if `RESEND_API_KEY` is set

### Theming

Dark-first design. `:root` is dark. Light mode requires `.light` class (not system preference). Brand colors are CSS custom properties in `index.css` (`--tech-orange`, `--primary-blue`, `--accent-blue`, `--navy-blue`, `--dark-gray`), referenced as `var(--primary-blue)` or raw HSL values like `hsl(218,11%,15%)`.

### Server Initialization

Dual-mode for local dev vs Vercel serverless:
- Uses `import.meta.url` comparison with `pathToFileURL()` for Windows compatibility
- Exports Express app as default for Vercel: `export default app`
- Only starts HTTP server when `VERCEL` env var is not set
- Vite dev server is set up programmatically in `server/vite.ts` (imported dynamically in dev only)

### 3D Viewer Integration

Portfolio items support four viewer types via database fields:
- `sketchfabModelId` - Sketchfab embeds
- `lumaEmbedUrl` - Luma AI NeRF/Gaussian Splatting
- `polycamEmbedUrl` - Polycam photogrammetry
- `modelFile` + `modelFormat` - Local Three.js viewer (GLB/GLTF/OBJ)

All viewers lazy load via Intersection Observer.

### Custom Portfolio Layouts

Portfolio items with `hasCustomLayout: true` get conditional rendering in `portfolio-detail.tsx`. That file also contains hardcoded `technicalSpecs` data keyed by project title strings.

### Static Content Data

`client/src/data/faq.json` and `services.json` hold FAQ and services content. Edit these for no-code content changes to those sections.

## Critical Build Configuration

**Vite output MUST be `dist/`** (not `dist/public`) - configured in `vite.config.ts:37`. Previous `dist/public` configuration caused Vercel deployment failures.

**esbuild requires `--external:./vite.js`** flag to prevent serverless import errors.

**Vite chunk splitting** (`vite.config.ts`): Manual chunks for `react-vendor`, `app-core`, `ui-components`, `three-vendor`, and `visual-libs`. The `chunkSizeWarningLimit` is raised to 600KB.

## Environment Variables

Required: `JWT_SECRET`

Production: `DATABASE_URL`, `ADMIN_PASSWORD_HASH` (generate with `tsx scripts/hash-password.ts`)

Development: `USE_SQLITE=true`, `ADMIN_PASSWORD` (plain text, dev only)

Optional: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` (email notifications), `VITE_GA_MEASUREMENT_ID` (GA4, `VITE_` prefix = client-accessible)

See `.env.example` for all variables with documentation.

## File Locations

| Asset Type | Location |
|------------|----------|
| Portfolio project assets | `client/public/assets/{project-slug}/` |
| User uploads (contact form) | `server/uploads/contact-submissions/` |
| Large datasets (not in git) | `attached_assets/downloads/` |
| Credentials/certs | `client/public/credentials/` |
| Static content (FAQ, services) | `client/src/data/` |
| Vercel serverless entry | `api/index.js` (re-exports `dist/index.js`) |

## Key Patterns

**Navigation**:
- Same-page scroll: `scrollToSection(sectionId)`
- Cross-page navigation: `window.location.href = "/#section"`

**SEOHead**: Every page uses `<SEOHead title="" description="" />` from `@/components/seo-head`. Admin/404 use `noindex: true`. Home and landing pages inject JSON-LD `LocalBusiness` structured data.

**Analytics**: GA4 initialized in `App.tsx`, page views tracked on route change. UTM params captured via `client/src/lib/utm.ts` (first-touch attribution in sessionStorage).

**Admin Dashboard** (`admin.tsx`): Largest file in the codebase — full CRUD for portfolio, blog, contact submissions, reviews, and leads. Uses Tiptap rich text editor for blog content.

**Scripts**: All data scripts detect `USE_SQLITE=true` and manually JSON-stringify arrays.

## Deployment

**Platform**: Vercel serverless

**Build outputs**:
- Client → `dist/` (Vite)
- Server → `dist/index.js` (esbuild ES module)

**Vercel config** (`vercel.json`):
- API routes → `api/index.js` serverless function (which re-exports the Express app)
- All other routes → `index.html` for SPA routing

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Windows: `netstat -ano \| findstr :5000` then `taskkill /PID <PID> /F` |
| SQLite locked | Close connections or delete `local.db` and reinitialize |
| Array deserialization errors | Check `server/storage.ts` JSON.parse/stringify for SQLite mode |
| Vercel deploy fails | Ensure `dist/` exists, check `--external:./vite.js` in build |
| Admin login fails | Verify `JWT_SECRET` is set and password hash is correct |
