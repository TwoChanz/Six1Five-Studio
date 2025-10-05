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
npm run db:push      # Push Drizzle schema changes to PostgreSQL
```

### Environment Variables

Required environment variables:

**Database (Required)**
- `DATABASE_URL` - PostgreSQL connection string

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
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter (client-side)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Shadcn/ui (Radix UI primitives)

### Project Structure

```
client/
  src/
    components/     # React components (hero, portfolio, contact, etc.)
    pages/          # Route pages (home, gallery, pricing, blog, faq)
    lib/            # Client utilities (analytics, queryClient, etc.)
server/
  index.ts          # Express server entry point
  routes.ts         # API route definitions
  storage.ts        # Database abstraction layer
  db.ts             # Database connection
shared/
  schema.ts         # Drizzle schema and Zod validators (shared types)
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
  - Sketchfab model IDs for embedded 3D viewers
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
4. **3D Viewers**: Integrated Sketchfab embeds and local Three.js model viewers
5. **Design System**: Dark tech-industrial theme with custom Tailwind config

### File Upload System

**Local File Storage** - Contact form reference files
- Uploaded files saved to `server/uploads/contact-submissions/`
- Configured with multer middleware (max 5 files, 10MB each)
- Allowed types: JPEG, PNG, GIF, WebP, PDF, TXT
- Files served via `/uploads/contact-submissions/` static route
- File paths stored in database (not base64)
- **Important**: `server/uploads/` is gitignored except for `.gitkeep`

### Critical Files

- `server/routes.ts` - All API endpoint definitions + multer file upload configuration
- `shared/schema.ts` - Database schema and validation (source of truth for data structure)
- `server/storage.ts` - Database query abstraction layer
- `client/src/App.tsx` - Client routing and lazy loading setup
- `vite.config.ts` - Build configuration and path aliases
- `server/uploads/` - User-uploaded files (gitignored)

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
- **Performance**: Lazy loading for non-critical pages, React Query caching, Intersection Observer for Sketchfab iframes
- **3D Integration**: Sketchfab embeds + Three.js custom viewers for portfolio models
- **Accessibility**:
  - WCAG AA compliant text colors (`.text-contrast-low`, `.text-contrast-medium`, `.text-contrast-high`)
  - Visible focus states for keyboard navigation
  - Comprehensive ARIA labels on interactive elements
  - React Error Boundaries to prevent full app crashes
