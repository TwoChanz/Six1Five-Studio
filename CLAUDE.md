# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Six1Five Studio Reality Capture Portfolio - A professional portfolio website for a reality capture company specializing in drone mapping, LiDAR scanning, and photogrammetry for AEC (Architecture, Engineering, Construction), real estate, and historic preservation industries.

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
tsx scripts/init-local-db.ts           # Initialize SQLite database with schema
tsx scripts/seed-simple.ts             # Seed SQLite with minimal sample data
tsx scripts/seed-sample-portfolio.ts   # Seed SQLite with full sample portfolio
tsx scripts/add-portfolio-item.ts      # Add a single portfolio item to database
tsx scripts/list-portfolio-items.ts    # List all portfolio items in database
tsx scripts/delete-portfolio-item.ts   # Delete a portfolio item by ID
tsx scripts/add-multiple-models.ts     # Bulk add multiple portfolio items
```

### Admin Dashboard
- **URL**: `/admin`
- **Default Password**: `admin615` (change via `VITE_ADMIN_PASSWORD` env var)
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
- `SENDGRID_API_KEY` - SendGrid API key for sending contact form emails
- `SENDGRID_FROM_EMAIL` - Verified sender email address (e.g., admin@six1fivestudio.com)
- `SENDGRID_TO_EMAIL` - Recipient email (defaults to SENDGRID_FROM_EMAIL if not set)

Without SendGrid configured, contact submissions will still be saved to the database but no email notifications will be sent.

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

### Database Schema

**Tables:**
- `users` - Basic user authentication (future expansion)
- `contact_submissions` - Contact form data with services array, project details, timeline, budget
- `blog_posts` - Blog content with slug, tags, publish status
- `portfolio_items` - Portfolio projects with:
  - **Sketchfab** model IDs for embedded 3D viewers
  - **Luma AI** embed URLs (NeRF/Gaussian Splatting captures)
  - **Polycam** embed URLs (photogrammetry models)
  - Local model files (GLB/GLTF/OBJ)
  - Video walkthroughs (MP4/WebM/MOV)
  - Category, tools, services arrays
  - Featured flag for homepage

**Validation**: All insert operations use Zod schemas exported from `shared/schema.ts`

### API Routes

**Contact:**
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all submissions (admin)

**Blog:**
- `GET /api/blog` - Get published posts
- `GET /api/blog/:slug` - Get post by slug
- `POST /api/blog` - Create new post

**Portfolio:**
- `GET /api/portfolio` - Get published items
- `GET /api/portfolio/featured` - Get featured items
- `GET /api/portfolio/:id` - Get item by ID
- `POST /api/portfolio` - Create new item

### Key Technical Details

1. **Development Server**: Port 5000 serves both API and client via Vite middleware
2. **Production Build**:
   - Client → `dist/public` (Vite)
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
