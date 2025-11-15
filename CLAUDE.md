# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Six1Five Studio Reality Capture Portfolio - A professional portfolio website for a reality capture company specializing in drone mapping, LiDAR scanning, and photogrammetry for AEC (Architecture, Engineering, Construction), real estate, and historic preservation industries.

## 🚀 PRIORITY: Production Deployment

**Current Status:** Ready to deploy, needs production services setup

**Quick Deploy Guides:**
- `QUICK_DEPLOY.md` - 45-minute deployment walkthrough
- `DEPLOY_CHECKLIST.md` - Printable checklist

**Required for Production:**
1. PostgreSQL database (Neon/Railway) - 10 min
2. Resend email service - 10 min
3. Google Analytics 4 - 5 min
4. Admin password hash - 2 min
5. Vercel deployment - 15 min

**Total setup time:** ~45 minutes

## Commands

### Development
```bash
npm run dev          # Start development server with hot reload (localhost:5000)
npm run build        # Build both client (Vite) and server (esbuild)
npm run start        # Start production server
npm run check        # Run TypeScript type checking
```

### Database
```bash
npm run db:push      # Push Drizzle schema changes to database (PostgreSQL or SQLite)

# Database Initialization & Seeding
tsx scripts/init-local-db.ts           # Initialize SQLite database with schema
tsx scripts/seed-simple.ts             # Seed SQLite with minimal sample data
tsx scripts/seed-sample-portfolio.ts   # Seed SQLite with full sample portfolio
tsx scripts/setup-database.ts          # Complete database setup (init + seed)
tsx scripts/migrate-database.ts        # Run database migrations

# Portfolio Management
tsx scripts/add-portfolio-item.ts      # Add a single portfolio item to database
tsx scripts/add-multiple-models.ts     # Bulk add multiple portfolio items
tsx scripts/list-portfolio-items.ts    # List all portfolio items in database
tsx scripts/delete-portfolio-item.ts   # Delete a portfolio item by ID

# Blog Management
tsx scripts/add-blog-post.ts           # Add a new blog post
tsx scripts/list-blog-posts.ts         # List all blog posts
tsx scripts/delete-blog-post.ts        # Delete a blog post by ID

# Review System
tsx scripts/add-reviews-table.ts       # Add reviews table to database
tsx scripts/seed-reviews.ts            # Seed sample review data
tsx scripts/list-reviews.ts            # List all reviews

# Utilities
tsx scripts/hash-password.ts           # Generate bcrypt hash for admin password
tsx scripts/verify-db.ts               # Verify database connection and schema
```

### PowerShell Utilities (Windows)
```powershell
.\run-live.ps1                # Start development server (PowerShell wrapper)
.\run-portfolio-transfer.ps1  # Transfer portfolio data between environments
.\optimize-projects.ps1       # Optimize project images and assets
```

### Admin Dashboard
- **URL**: `/admin`
- **Authentication**: JWT-based with bcrypt password hashing
  - Development: Set `ADMIN_PASSWORD` in `.env` (plain text)
  - Production: Set `ADMIN_PASSWORD_HASH` with bcrypt hash (generate via `npx tsx scripts/hash-password.ts`)
  - JWT Secret: Required in `JWT_SECRET` env var (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- **Features**: Contact submissions, blog management (publish/unpublish/delete), portfolio management (featured/publish/delete)
- **Documentation**: See `ADMIN.md` for full guide

### Environment Variables

**Database Configuration:**
The project supports **dual database modes** for flexibility:

1. **SQLite (Local Development - Default)**
   - Set `USE_SQLITE=true` in `.env`
   - Database file: `local.db` at project root
   - No DATABASE_URL needed
   - Use `drizzle.config.local.ts` for schema management
   - Faster setup, no external dependencies

2. **PostgreSQL (Production)**
   - Set `USE_SQLITE=false` (or omit it) in `.env`
   - Required: `DATABASE_URL` - PostgreSQL connection string
   - Uses Neon serverless PostgreSQL driver
   - Use `drizzle.config.ts` for schema management

**Email Notifications (Optional but recommended)**
- `RESEND_API_KEY` - Resend API key for sending contact form emails (3,000 emails/month free at https://resend.com)
- `RESEND_FROM_EMAIL` - Sender email address (e.g., contact@six1fivestudio.com, use onboarding@resend.dev for testing)
- `RESEND_TO_EMAIL` - Recipient email for notifications (defaults to RESEND_FROM_EMAIL if not set)

Without Resend configured, contact submissions will still be saved to the database but no email notifications will be sent.

**Analytics (Optional but recommended)**
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID (e.g., G-XXXXXXXXXX)

Without GA configured, analytics tracking will be skipped. Analytics tracks:
- Page views, contact form submissions, portfolio views, CTA clicks, file uploads, gallery filters, external link clicks

## Architecture

### Stack Overview
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript (ES modules)
- **Database**: PostgreSQL OR SQLite with Drizzle ORM (dual mode support)
- **Routing**: Wouter (client-side)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **3D Rendering**: Sketchfab embeds, Luma AI NeRF embeds, Polycam embeds, + Three.js + three-stdlib for local model viewing

### Project Structure

```
client/
  src/
    components/     # React components (hero, portfolio, contact, etc.)
    pages/          # Route pages (home, gallery, pricing, blog, faq)
    lib/            # Client utilities (analytics, queryClient, etc.)
    hooks/          # Custom React hooks
server/
  index.ts          # Express server entry point
  routes.ts         # API route definitions + multer file upload config
  storage.ts        # Database abstraction layer
  db.ts             # Database connection (dual SQLite/PostgreSQL support)
  uploads/          # File upload directory (gitignored except .gitkeep)
shared/
  schema.ts         # Drizzle schema and Zod validators (shared types)
scripts/
  init-local-db.ts           # Initialize SQLite database schema
  seed-simple.ts             # Quick seed with minimal data
  seed-sample-portfolio.ts   # Full portfolio seed with sample projects
  add-portfolio-item.ts      # Add single portfolio item helper
```

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*` (in Vite config only)

### Drizzle ORM Configuration

The project uses **two separate Drizzle config files** for dual database support:

1. **`drizzle.config.ts`** - PostgreSQL configuration (production)
   - Used when `USE_SQLITE=false` or in production
   - Connects to PostgreSQL via `DATABASE_URL`
   - Run commands: `npm run db:push` (auto-detects config)

2. **`drizzle.config.local.ts`** - SQLite configuration (development)
   - Used when `USE_SQLITE=true`
   - Connects to `local.db` file in project root
   - Run commands: `npm run db:push` (auto-detects config)

3. **`drizzle-push-auto.config.ts`** - Auto-detection wrapper
   - Automatically selects correct config based on `USE_SQLITE` env var
   - Used by `npm run db:push` command

**Schema Management:**
- Schema defined in `shared/schema.ts` (single source of truth)
- Arrays stored as JSON strings in SQLite, native arrays in PostgreSQL
- Database connection logic in `server/db.ts` handles both modes

### Database Schema

**Tables:**
- `users` - Admin user authentication with JWT tokens
- `contact_submissions` - Contact form data with services array, project details, timeline, budget, reference files
- `blog_posts` - Blog content with slug, tags, publish status, cover images
- `portfolio_items` - Portfolio projects with:
  - **Sketchfab** model IDs for embedded 3D viewers
  - **Luma AI** embed URLs (NeRF/Gaussian Splatting captures)
  - **Polycam** embed URLs (photogrammetry models)
  - Local model files (GLB/GLTF/OBJ)
  - Video walkthroughs (MP4/WebM/MOV)
  - Category, tools, services arrays
  - Featured flag for homepage
  - Published flag for visibility control
- `reviews` - Client testimonials and reviews with approval workflow

**Validation**: All insert operations use Zod schemas exported from `shared/schema.ts`

**Array Handling**:
- PostgreSQL: Native array support (`text[]`)
- SQLite: JSON string serialization (requires deserialization on read)
- Storage layer (`server/storage.ts`) handles conversion automatically

### API Routes

**Contact:**
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (admin)
- `DELETE /api/contact/:id` - Delete submission (admin)

**Blog:**
- `GET /api/blog` - Get published posts
- `GET /api/blog/:slug` - Get post by slug
- `POST /api/blog` - Create new post (admin)
- `PATCH /api/blog/:id` - Update post (admin)
- `PATCH /api/blog/:id/publish` - Toggle publish status (admin)
- `DELETE /api/blog/:id` - Delete post (admin)

**Portfolio:**
- `GET /api/portfolio` - Get published items
- `GET /api/portfolio/featured` - Get featured items
- `GET /api/portfolio/:id` - Get item by ID
- `POST /api/portfolio` - Create new item (admin)
- `PATCH /api/portfolio/:id` - Update item (admin)
- `PATCH /api/portfolio/:id/featured` - Toggle featured status (admin)
- `PATCH /api/portfolio/:id/publish` - Toggle publish status (admin)
- `DELETE /api/portfolio/:id` - Delete item (admin)

**Reviews:**
- `GET /api/reviews` - Get all approved reviews
- `POST /api/reviews` - Submit new review
- `PATCH /api/reviews/:id/approve` - Approve review (admin)
- `DELETE /api/reviews/:id` - Delete review (admin)

**Admin Authentication:**
- `POST /api/admin/login` - Admin login (returns JWT)
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify JWT token

**File Uploads:**
- `POST /api/upload` - Upload files (contact form, max 5 files, 10MB each)
- Served via `/uploads/contact-submissions/:filename` static route

### Key Technical Details

1. **Development Server**: Port 5000 serves both API and client via Vite middleware
2. **Production Build**:
   - Client → `dist/` (Vite) - **CRITICAL**: Must output to `dist/`, NOT `dist/public` (Vercel requirement)
   - Server → `dist/index.js` (esbuild with ES module format)
3. **Environment**: Uses `NODE_ENV` for dev/production modes
4. **3D Viewers**: Integrated Sketchfab, Luma AI, and Polycam embeds + local Three.js model viewers with lazy loading
5. **Design System**: Dark tech-industrial theme with custom Tailwind config

### File Upload System

**Local File Storage** - Contact form reference files
- Uploaded files saved to `server/uploads/contact-submissions/`
- Configured with multer middleware (max 5 files, 10MB each)
- Allowed types: JPEG, PNG, GIF, WebP, PDF, TXT
- Files served via `/uploads/contact-submissions/` static route
- File paths stored in database (not base64)
- **Important**: `server/uploads/` is gitignored except for `.gitkeep`

### 3D Viewer Components

The portfolio supports **four types of 3D model display**:

1. **Sketchfab Embeds** (`sketchfabModelId`)
   - Industry-standard 3D model hosting
   - Interactive WebGL viewer with annotations
   - Lazy loading via Intersection Observer

2. **Luma AI Embeds** (`lumaEmbedUrl`)
   - NeRF and Gaussian Splatting captures
   - Component: `client/src/components/luma-embed.tsx`
   - Supports capture IDs or full embed URLs
   - Lazy loading with IntersectionObserver (100px rootMargin)

3. **Polycam Embeds** (`polycamEmbedUrl`)
   - Photogrammetry models
   - Component: `client/src/components/polycam-embed.tsx`
   - Link-out to poly.cam viewer (no iframe embedding)
   - Lazy loading placeholder with CTA button

4. **Local Three.js Viewer** (`modelFile` + `modelFormat`)
   - Self-hosted GLB/GLTF/OBJ models
   - Custom Three.js viewer with OrbitControls
   - No external dependencies

**Performance**: All embeds use Intersection Observer for lazy loading to prevent loading heavy 3D viewers until they're near the viewport.

### Critical Files

- `server/routes.ts` - All API endpoint definitions + multer file upload configuration + admin endpoints
- `server/email-templates.ts` - Professional HTML email templates for contact form
- `shared/schema.ts` - Database schema and validation (source of truth for data structure)
- `server/storage.ts` - Database query abstraction layer with CRUD operations
- `client/src/App.tsx` - Client routing and lazy loading setup
- `client/src/pages/admin.tsx` - Admin dashboard UI (password-protected)
- `client/src/data/services.json` - Editable services content (no-code)
- `client/src/data/faq.json` - Editable FAQ content (no-code)
- `vite.config.ts` - Build configuration, path aliases, and code splitting
- `server/uploads/` - User-uploaded files (gitignored)

### Content Management

**Services & FAQ (No-Code Editing)**
- Services data: `client/src/data/services.json`
- FAQ data: `client/src/data/faq.json`
- Marketing team can edit content without touching React components
- Icon names mapped in components (Plane, Camera, etc.)

**Admin Dashboard (Code-Based)**
- Blog posts: Toggle publish/unpublish, delete
- Portfolio: Toggle published/featured, delete
- Contacts: View submissions, delete after processing
- Future: Rich text editor, image uploads, inline editing

### User Preferences

- **Communication Style**: Simple, everyday language
- **Profile Focus**: Reality Capture-relevant background, AEC/agricultural experience supporting aerial imagery and 3D mapping expertise
- **Avoid**: Unrelated professional roles or generic portfolio content

### Pricing Page

**Location**: `/pricing` - Comprehensive pricing guide page
**Structure**:
- Three pricing tiers: Essential ($500+), Professional ($1,500+), Enterprise (Custom)
- Add-on services section (Thermal Imaging, Interior Scanning, Rush Delivery, Monthly Monitoring)
- FAQ section addressing common pricing questions
- Multiple CTAs linking to contact form
- Analytics tracking on all CTAs and tier interactions

**Customization Notes**:
- Pricing tiers are defined in `pricing.tsx` as a `pricingTiers` array
- Industry-standard starting prices provided as placeholders
- Update pricing based on actual service rates and market positioning
- Features and descriptions can be modified to match actual offerings

### Testimonials Section

**Location**: `client/src/components/testimonials-section.tsx`
**Structure**:
- Trust signals section (FAA certification, insurance, credentials)
- Client testimonials grid (3 columns on large screens)
- Project type badges for context
- Placeholder avatar initials or optional client headshots
- CTA button with scroll-to-contact and analytics tracking

**Customization Instructions**:
- Replace placeholder testimonials in `testimonials` array with real client feedback
- Steps to add real testimonials:
  1. Reach out to past clients for permission
  2. Update name, role, company, content, projectType fields
  3. Optional: Add client headshot images to imageUrl field
- Trust signals can be updated to reflect current certifications
- Remove placeholder note once real testimonials are added

### Design & UX Notes

- **Theme**: Dark tech-industrial aesthetic (concrete gray, drone orange, sky blue, tech green)
- **Mobile-First**: Responsive design with progressive enhancement
- **Performance**: Lazy loading for non-critical pages, React Query caching, Intersection Observer for all 3D embeds (Sketchfab, Luma AI, Polycam)
- **3D Integration**: Sketchfab, Luma AI NeRF, Polycam embeds + Three.js custom viewers for portfolio models
- **Accessibility**:
  - WCAG AA compliant text colors (`.text-contrast-low`, `.text-contrast-medium`, `.text-contrast-high`)
  - Visible focus states for keyboard navigation
  - Comprehensive ARIA labels on interactive elements
  - React Error Boundaries to prevent full app crashes

### UI/UX Status & Recommendations

**Navigation Audit: ✅ ALL WORKING CORRECTLY** (see `NAVIGATION_AUDIT.md`)
- All internal links, CTAs, and scroll targets verified
- Cross-page scrolling functions properly
- Mobile menu and desktop nav fully functional
- External links open with proper security (`rel="noopener noreferrer"`)
- Zero broken links or dead-end pages

**Performance Optimizations Complete:**
- 67% reduction in initial bundle size (309KB → 107KB core)
- Manual code splitting: `react-vendor`, `ui-components`, `three-vendor`, `app-core`, `visual-libs`
- Route-based lazy loading: Admin (2.72KB), Gallery (4.33KB), Blog (2.10KB)
- Image optimization: Native lazy loading + `decoding="async"` on all images
- 3D viewer lazy loading: Intersection Observer with 100px rootMargin

**Content Management:**
- **No-Code Editing**: Marketing team can update without developer
  - Services: `client/src/data/services.json`
  - FAQ: `client/src/data/faq.json`
- **Admin Dashboard**: `/admin` for portfolio, blog, and contact management

**Minor UI/UX Improvements to Consider** (non-critical):
1. **Analytics Enhancement**: Add `analytics.externalLink()` to all external buttons (some already tracked)
2. **Loading States**: Add skeleton loaders for route transitions (currently instant)
3. **Scroll Position Memory**: Preserve scroll position when navigating back
4. **Admin Dashboard Enhancements** (future):
   - Rich text editor (TipTap/Quill) for blog posts
   - Image upload with drag-and-drop
   - Inline editing for quick updates
   - Bulk actions (multi-select, delete all)
   - Search and filtering for large datasets

**Navigation Patterns:**
- **Same-page scrolling**: `scrollToSection(sectionId)` - Smooth scroll with navbar offset
- **Cross-page navigation**: `window.location.href = "/#section"` - Works from any page
- **External links**: Always `target="_blank"` with security attributes

### SEO Implementation

**Status**: In Progress (see `SEO_TODO.md` for detailed tracking)

**Completed:**
- Gallery page (`client/src/pages/gallery.tsx`) - Full SEO meta tags, structured data, canonical URLs

**Pending:**
- Home, Pricing, Blog, Blog Post, Resources, FAQ pages
- Admin and 404 pages need `noindex` meta tags

**SEO Component**: `client/src/components/seo-head.tsx`
- Provides reusable SEO meta tags (title, description, keywords, OG tags)
- Includes `getCanonicalUrl()` helper for canonical URL generation
- Usage pattern documented in `SEO_TODO.md`

**SEO Infrastructure:**
- `client/public/robots.txt` - Search engine crawling rules
- `client/public/sitemap.xml` - URL structure for search engines

### Production Deployment

**Hosting Platform**: Vercel (optimized configuration)

**Critical Build Configuration**:
- Vite output directory MUST be `dist` (not `dist/public`)
- Configured in `vite.config.ts:37` to align with Vercel's expectations
- Previous `dist/public` configuration caused deployment failures

**Build Process**:
1. Client build: `vite build` → outputs to `dist/`
2. Server build: `esbuild server/index.ts` → outputs to `dist/index.js`
3. Production server serves static files from `dist/` via Express

**Performance Optimizations** (vite.config.ts):
- Manual code splitting for optimal bundle sizes:
  - `react-vendor` chunk: React core libraries
  - `app-core` chunk: Routing and state management
  - `ui-components` chunk: Radix UI primitives
  - `three-vendor` chunk: 3D rendering libraries
  - `visual-libs` chunk: Icons and animations
- Chunk size limit: 600KB (increased from default 500KB)

**Environment Configuration**:
- Set `NODE_ENV=production` for production builds
- Configure all required env vars per `.env.example`
- Use PostgreSQL in production (SQLite for local dev only)

### Credentials & Certifications

**Storage Location**: `client/public/credentials/`

**Current Files**:
- `TRUST_Certification.pdf` - FAA-recognized aeronautical knowledge and safety test
- Publicly accessible at `/credentials/TRUST_Certification.pdf`

**Recommended Display Locations**:
1. **Testimonials Section** (`client/src/components/testimonials-section.tsx:6-17`)
   - Update trust signals with link to TRUST certification
   - Replace "FAA Certified" placeholder with actual credentials

2. **About/Credentials Page** (future enhancement)
   - Dedicated page showcasing all certifications, insurance, professional affiliations
   - Include FAA Part 107 Remote Pilot Certificate (if applicable)

3. **Portfolio Items** (future enhancement)
   - Add certification badges to relevant projects
   - Shows compliance and professionalism

4. **Contact Form Auto-Response** (future enhancement)
   - Include certification details in email templates (`server/email-templates.ts`)
   - Builds immediate trust with prospective clients
