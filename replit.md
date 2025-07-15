# Six1Five Studio - Reality Capture Portfolio

## Overview

This is a full-stack web application for Six1Five Studio, a reality capture company specializing in drone mapping, LiDAR scanning, and photogrammetry services. The application serves as a professional portfolio showcasing 3D models, project walkthroughs, and client deliverables for the AEC (Architecture, Engineering, Construction), real estate, and historic preservation industries.

## Recent Changes

**Professional Profile Integration (January 15, 2025)**
- Enhanced About section with authentic LinkedIn profile information
- Integrated real profile image of Chandler Hopkins
- Added LinkedIn profile links and Substack "Digital Blueprint" blog
- Updated contact information with real phone and email
- Incorporated MTSU Construction Management education background
- Added Estes Express Lines Operations Shift Leader position
- Enhanced technical skills based on actual certifications and experience
- Updated service area to reflect La Vergne, Tennessee location

**Database Integration (January 15, 2025)**
- Added PostgreSQL database with Drizzle ORM for persistent data storage
- Migrated from in-memory storage to DatabaseStorage class
- Created database schema with users and contact_submissions tables
- Updated storage interface to use actual database queries

**Enhanced About Section with Interactive Tech Tags (January 15, 2025)**
- Added punchy opening line: "From farm foundations to digital replicas—bringing real-world sites into stunning 3D"
- Integrated Matthew Byrd quote about reality capture as contextual authority
- Created interactive tech tags with hover tooltips for tools (RealityCapture, CloudCompare, LiDAR, etc.)
- Refined professional background to focus on Reality Capture-relevant AEC and agricultural experience
- Removed unrelated professional roles, emphasizing field conditions and site planning expertise
- Added visual service area indicator with map icon

**Sketchfab Integration (January 15, 2025)**
- Integrated real Sketchfab 3D model viewer in hero section featuring "Watchtower | Shooting House" model
- Updated portfolio section to showcase actual project from six1fivemedia Sketchfab profile
- Added clickable links to view models on Sketchfab platform
- Fixed TypeScript error in storage.ts for contact submissions

## User Preferences

Preferred communication style: Simple, everyday language.
Profile Focus: Include only Reality Capture-relevant background and AEC/agricultural experience that directly supports aerial imagery and 3D mapping expertise. Avoid unrelated professional roles.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom tech-industrial color palette
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite middleware integration

### Design System
- **Theme**: Dark tech-industrial aesthetic with custom CSS variables
- **Colors**: Concrete gray, drone orange, sky blue, tech green
- **Typography**: Modern sans-serif with monospace accents
- **Animations**: Scanline effects, pulse animations, smooth transitions

## Key Components

### Core Features
1. **Hero Section**: Interactive 3D model viewer (Sketchfab integration ready)
2. **Portfolio Showcase**: Project galleries with before/after comparisons
3. **Service Categories**: Flip cards showing workflows and tools
4. **Contact System**: Form with service selection and project details
5. **Responsive Design**: Mobile-first approach with progressive enhancement

### UI Components
- **Navigation**: Fixed header with smooth scroll navigation
- **3D Viewers**: Placeholder for Sketchfab/NeRF model integration
- **Form Components**: Multi-step contact forms with validation
- **Animation Effects**: Custom CSS for tech-themed visual effects

### Content Structure
- **Services**: Aerial capture, photogrammetry, LiDAR integration
- **Industries**: Construction, real estate, historic preservation
- **Technologies**: DJI drones, FARO scanners, RealityCapture, Metashape

## Data Flow

### Client-Server Communication
1. **API Requests**: RESTful endpoints with JSON payloads
2. **Form Submissions**: Contact forms with service selection arrays
3. **Error Handling**: Centralized error boundaries with user feedback
4. **Loading States**: React Query provides caching and loading states

### Database Schema
- **Users Table**: Basic user authentication (future expansion)
- **Contact Submissions**: Form data with services array and timestamps
- **Validation**: Zod schemas for type-safe data validation

### State Management
- **Server State**: TanStack Query for API data and caching
- **Form State**: React Hook Form for complex form interactions
- **UI State**: React state for modals, navigation, and animations

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation with Zod integration
- **drizzle-orm**: Type-safe SQL query builder
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments

### UI/UX Libraries
- **@radix-ui/***: Headless UI primitives for accessibility
- **lucide-react**: Modern icon library
- **class-variance-authority**: Type-safe CSS class management
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **typescript**: Static type checking
- **vite**: Fast build tool and development server
- **drizzle-kit**: Database migration and schema management

### 3D Integration (Planned)
- **Sketchfab**: 3D model hosting and embedding
- **Three.js**: Custom 3D viewers and interactions
- **WebGL**: Hardware-accelerated 3D graphics

## Deployment Strategy

### Build Process
- **Client Build**: Vite bundles React app to `dist/public`
- **Server Build**: esbuild compiles Express server to `dist/index.js`
- **Database**: Drizzle migrations with PostgreSQL

### Environment Configuration
- **Development**: Local server with Vite middleware and HMR
- **Production**: Static file serving with Express backend
- **Database**: Environment variable configuration for connection strings

### Performance Considerations
- **Code Splitting**: Vite automatic chunking for optimal loading
- **Image Optimization**: Placeholder system for 3D model thumbnails
- **Caching**: TanStack Query for client-side data caching
- **SEO**: Meta tags and semantic HTML structure

### Platform Compatibility
- **Replit**: Configured for Replit development environment
- **Mobile**: Responsive design with touch-friendly interactions
- **Browsers**: Modern browser support with ES6+ features