# Six1Five Studio - Reality Capture Portfolio

Professional portfolio website for a reality capture company specializing in drone mapping, LiDAR scanning, and photogrammetry services for AEC (Architecture, Engineering, Construction), real estate, and historic preservation industries.

![Project Status](https://img.shields.io/badge/status-production%20ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Quick Deploy to Production (45 Minutes)

**Want to go live fast?** Follow these streamlined guides:

1. **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - 45-minute step-by-step deployment guide
2. **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - Printable checklist to track progress

**What you'll set up:**
- PostgreSQL database (Neon or Railway)
- Resend email notifications
- Google Analytics tracking
- Vercel hosting
- Admin authentication

**Total time:** ~45 minutes from zero to live

## Features

- **3D Model Viewers**: Integrated support for Sketchfab, Luma AI NeRF, Polycam embeds, and local Three.js model viewing
- **Dual Database Support**: SQLite for local development, PostgreSQL for production
- **Admin Dashboard**: Password-protected content management with JWT authentication
- **Email Notifications**: Resend integration for contact form submissions
- **Analytics**: Google Analytics 4 tracking for visitor insights and conversions
- **SEO Optimized**: Meta tags, structured data, canonical URLs, and sitemap
- **Performance**: Lazy loading, code splitting, React Query caching, Intersection Observer for 3D embeds
- **Security**: Rate limiting, bcrypt password hashing, Zod validation, CSRF protection
- **Responsive Design**: Dark tech-industrial theme, mobile-first, WCAG AA accessible

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Shadcn/ui (Radix UI components)
- Wouter (routing)
- TanStack Query (state management)
- React Hook Form + Zod (forms/validation)
- Three.js + three-stdlib (3D rendering)
- Framer Motion (animations)

### Backend
- Express.js + TypeScript (ES modules)
- Drizzle ORM
- PostgreSQL (production) / SQLite (development)
- Multer (file uploads)
- Resend (email notifications)
- JWT + bcrypt (authentication)
- Express Rate Limit (security)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd RealityCapturePortfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `USE_SQLITE=true` (for local development)
- `JWT_SECRET` (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `ADMIN_PASSWORD` (plain text for development)
- Optional: `RESEND_API_KEY`, `VITE_GA_MEASUREMENT_ID`

4. **Initialize database**
```bash
npm run db:push
tsx scripts/init-local-db.ts
tsx scripts/seed-sample-portfolio.ts
```

5. **Start development server**
```bash
npm run dev
```

Visit http://localhost:5000

## Available Scripts

### Development
```bash
npm run dev          # Start dev server with hot reload (localhost:5000)
npm run build        # Build client (Vite) and server (esbuild)
npm run start        # Start production server
npm run check        # Run TypeScript type checking
```

### Database Management
```bash
npm run db:push      # Push schema changes to database

# Initialization & Seeding
tsx scripts/init-local-db.ts           # Initialize SQLite schema
tsx scripts/seed-simple.ts             # Minimal sample data
tsx scripts/seed-sample-portfolio.ts   # Full sample portfolio

# Portfolio Management
tsx scripts/add-portfolio-item.ts      # Add single portfolio item
tsx scripts/add-multiple-models.ts     # Bulk add portfolio items
tsx scripts/list-portfolio-items.ts    # List all portfolio items
tsx scripts/delete-portfolio-item.ts   # Delete portfolio item by ID

# Blog Management
tsx scripts/add-blog-post.ts           # Add blog post
tsx scripts/list-blog-posts.ts         # List all blog posts
tsx scripts/delete-blog-post.ts        # Delete blog post by ID

# Utilities
tsx scripts/hash-password.ts           # Generate bcrypt hash for production
```

## Project Structure

```
client/
  src/
    components/        # React components (hero, portfolio, contact, etc.)
    pages/             # Route pages (home, gallery, pricing, blog, faq)
    lib/               # Client utilities (analytics, queryClient, etc.)
    hooks/             # Custom React hooks
    data/              # Editable JSON content (services, FAQ)
  public/
    images/            # Static images
    credentials/       # Public PDF certifications
server/
  index.ts             # Express server entry point
  routes.ts            # API route definitions + multer config
  storage.ts           # Database abstraction layer
  db.ts                # Database connection (dual SQLite/PostgreSQL)
  email-templates.ts   # HTML email templates
  uploads/             # File upload directory (gitignored)
shared/
  schema.ts            # Drizzle schema + Zod validators
scripts/               # Database management scripts
```

## Configuration

### Environment Variables

See `.env.example` for all available options. Key variables:

**Database** (required):
- `USE_SQLITE`: Set `true` for local dev, `false` for production
- `DATABASE_URL`: PostgreSQL connection string (production only)

**Security** (required):
- `JWT_SECRET`: Random 64-char hex string for JWT signing
- `ADMIN_PASSWORD`: Plain text admin password (development)
- `ADMIN_PASSWORD_HASH`: Bcrypt hash (production, generate with `hash-password.ts`)

**Email** (optional but recommended):
- `RESEND_API_KEY`: Resend API key (3,000 emails/month free)
- `RESEND_FROM_EMAIL`: Sender email address
- `RESEND_TO_EMAIL`: Recipient email for notifications

**Analytics** (optional but recommended):
- `VITE_GA_MEASUREMENT_ID`: Google Analytics 4 measurement ID (G-XXXXXXXXXX)

### Database Modes

**SQLite (Local Development)**:
- Fast setup, no external dependencies
- Database file: `local.db` at project root
- Use `drizzle.config.local.ts` for schema management

**PostgreSQL (Production)**:
- Scalable, serverless-ready
- Recommended providers: Railway, Neon, Supabase
- Use `drizzle.config.ts` for schema management

## Admin Dashboard

Access at `/admin` with configured admin password.

**Features**:
- View and manage contact form submissions
- Publish/unpublish blog posts
- Toggle portfolio items as featured
- Delete content

**Authentication**:
- JWT-based with bcrypt password hashing
- Development: Use `ADMIN_PASSWORD` (plain text)
- Production: Use `ADMIN_PASSWORD_HASH` (bcrypt hash)

Generate production password hash:
```bash
npx tsx scripts/hash-password.ts YOUR_SECURE_PASSWORD
```

## 3D Model Integration

The portfolio supports four types of 3D model display:

1. **Sketchfab Embeds** - Industry-standard 3D hosting with WebGL viewer
2. **Luma AI Embeds** - NeRF and Gaussian Splatting captures
3. **Polycam Embeds** - Photogrammetry models
4. **Local Three.js Viewer** - Self-hosted GLB/GLTF/OBJ models

All viewers use Intersection Observer for lazy loading to optimize performance.

## SEO & Analytics

**SEO Features**:
- Dynamic meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Structured data (JSON-LD)
- Canonical URLs
- Sitemap.xml and robots.txt

**Analytics Tracking**:
- Page views
- Contact form submissions
- Portfolio item views
- CTA clicks
- File uploads
- Gallery filters
- External link clicks

## Production Deployment

### Build Configuration

**Critical**: Vite must output to `dist/`, NOT `dist/public` (Vercel requirement).

```bash
npm run build
```

This creates:
- `dist/` - Client static files (Vite)
- `dist/index.js` - Server bundle (esbuild)

### Hosting Platforms

**Recommended: Vercel**
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Add environment variables in Vercel dashboard
5. Redeploy to apply changes

**Environment Setup**:
- Set `USE_SQLITE=false`
- Configure PostgreSQL `DATABASE_URL`
- Add all required environment variables
- Set `NODE_ENV=production` (automatic on most platforms)

### Production Checklist

- [ ] PostgreSQL database configured and seeded
- [ ] Resend email configured and tested
- [ ] Google Analytics property created
- [ ] Environment variables set in hosting platform
- [ ] Admin password hash generated
- [ ] Build succeeds locally (`npm run build`)
- [ ] Real portfolio content added (replace sample data)
- [ ] Testimonials updated with real client feedback
- [ ] Pricing updated with actual service rates
- [ ] SEO meta tags added to all pages
- [ ] Contact form tested end-to-end
- [ ] Analytics verified in realtime dashboard

## Content Management

### No-Code Editing
Marketing team can edit without touching React:
- `client/src/data/services.json` - Services content
- `client/src/data/faq.json` - FAQ content

### Code-Based Editing
Use scripts for portfolio and blog:
```bash
tsx scripts/add-portfolio-item.ts    # Add new project
tsx scripts/add-blog-post.ts         # Add new article
```

Or use Admin Dashboard at `/admin`.

## Performance Optimizations

- **Code Splitting**: Manual chunks for React, UI components, Three.js, icons
- **Lazy Loading**: Non-critical pages and 3D viewers
- **Image Optimization**: WebP format, responsive images (recommended)
- **Caching**: React Query for API responses
- **Bundle Size**: 600KB chunk limit
- **3D Viewers**: Intersection Observer to defer loading until viewport proximity

## Security Features

- **Rate Limiting**: 5 requests/15min per IP on contact form
- **Password Hashing**: bcrypt with 10 salt rounds
- **Input Validation**: Zod schemas for all API inputs
- **JWT Authentication**: Secure admin sessions
- **File Upload Restrictions**: Type and size validation (max 10MB, 5 files)
- **CORS**: Configured for production domain
- **XSS Protection**: React auto-escaping + sanitized inputs

## Accessibility

- WCAG AA compliant color contrast
- Keyboard navigation support
- Comprehensive ARIA labels
- Focus visible states
- React Error Boundaries
- Screen reader friendly

## Documentation

- `CLAUDE.md` - Comprehensive project guide for AI assistants
- `ADMIN.md` - Admin dashboard user guide
- `PRODUCTION_SETUP_GUIDE.md` - Step-by-step production deployment
- `SEO_TODO.md` - SEO implementation tracking
- `IMPROVEMENTS.md` - Prioritized improvement roadmap
- `REVIEW_SYSTEM.md` - Client review feature documentation

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check documentation in the repository
2. Review IMPROVEMENTS.md for common tasks
3. Consult PRODUCTION_SETUP_GUIDE.md for deployment issues

---

**Built with modern web technologies for professional reality capture showcasing.**
