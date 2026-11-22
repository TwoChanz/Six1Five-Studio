# Customer Review System

## Overview

The review system allows customers to submit reviews that require admin approval before being published on the site. Approved reviews appear in the testimonials section, and admins can feature specific reviews for homepage highlighting.

## Features Implemented

### Database Schema
- **Reviews table** with fields:
  - Basic info: name, email (optional), company (optional), role (optional)
  - Review data: rating (1-5 stars), review text, project type
  - Moderation: approved (boolean), featured (boolean)
  - Timestamps: createdAt

### API Endpoints

**Public Routes:**
- `GET /api/reviews` - Fetch all approved reviews
- `GET /api/reviews/featured` - Fetch featured reviews only
- `POST /api/reviews` - Submit a new review (requires validation)

**Admin Routes (require authentication):**
- `GET /api/admin/reviews` - Fetch all reviews (pending + approved)
- `PUT /api/admin/reviews/:id/approve` - Approve a pending review
- `PUT /api/admin/reviews/:id/featured` - Toggle featured status
- `DELETE /api/admin/reviews/:id` - Delete a review

### Frontend Components

#### ReviewForm (`client/src/components/review-form.tsx`)
- Interactive 5-star rating system
- Form fields: name, email, company, role, service type, review text
- Client-side validation using React Hook Form + Zod
- Success/error toast notifications

#### ReviewDialog (`client/src/components/review-dialog.tsx`)
- Modal wrapper for ReviewForm
- Customizable trigger button
- Closes automatically on successful submission

#### Testimonials Section (`client/src/components/testimonials-section.tsx`)
- Displays approved reviews from API
- Grid layout with star ratings and project type badges
- "Leave a Review" button for customers
- Empty state message when no reviews exist

#### Admin Dashboard (`client/src/pages/admin.tsx`)
- **ReviewsManager component** with two sections:
  - **Pending Reviews**: Shows unmoderated reviews with Approve/Delete buttons
  - **Approved Reviews**: Shows published reviews with Toggle Featured/Delete buttons
- Real-time updates using React Query
- Star ratings, project types, and full review details

## Sample Data

The database has been seeded with 6 sample reviews:

### Featured & Approved (2)
1. **Michael Rodriguez** - Rodriguez Construction - Aerial Mapping - ⭐⭐⭐⭐⭐
2. **Sarah Chen** - Chen Architects - Photogrammetry - ⭐⭐⭐⭐⭐

### Approved (3)
3. **David Thompson** - Thompson Real Estate Group - Real Estate - ⭐⭐⭐⭐⭐
4. **Emily Parker** - Parker Engineering - LiDAR Scanning - ⭐⭐⭐⭐
5. **James Wilson** - Historic Preservation Associates - Interior Scanning - ⭐⭐⭐⭐⭐

### Pending Approval (1)
6. **Robert Martinez** - Martinez Farms - Thermal Imaging - ⭐⭐⭐⭐⭐

## Testing the System

### 1. View Existing Reviews
Visit http://localhost:5000 and scroll to the testimonials section to see the 5 approved reviews.

### 2. Submit a New Review
1. On the homepage, scroll to testimonials section
2. Click "Leave a Review" button
3. Fill out the form:
   - Name (required)
   - Email (optional)
   - Company (optional)
   - Role (optional)
   - Rating (required, 1-5 stars)
   - Service Type (required, dropdown)
   - Review Text (required, 10-1000 characters)
4. Click "Submit Review"
5. You'll see a success message

### 3. Moderate Reviews (Admin)
1. Visit http://localhost:5000/admin
2. Enter password: `admin615`
3. Click the "Reviews" tab
4. You'll see two sections:
   - **Pending Reviews (1)**: Shows Robert Martinez's pending review
   - **Approved Reviews (5)**: Shows the 5 approved reviews

### 4. Approve a Review
1. In the "Pending Reviews" section
2. Click the "Approve" button with eye icon
3. The review moves to "Approved Reviews" section
4. Visit http://localhost:5000 to see it live on the testimonials section

### 5. Feature a Review
1. In the "Approved Reviews" section
2. Click the star icon button on any review
3. A featured badge appears
4. Featured reviews can be queried via `/api/reviews/featured` endpoint

### 6. Delete a Review
1. Click the trash icon on any review (pending or approved)
2. The review is permanently deleted
3. It disappears from both admin and public views

## Utility Scripts

### List All Reviews
```bash
npx tsx scripts/list-reviews.ts
```
Shows all reviews in the database with status, ratings, and metadata.

### Seed Sample Reviews
```bash
npx tsx scripts/seed-reviews.ts
```
Adds 6 sample reviews (5 approved, 1 pending) to the database.

## File Structure

```
client/src/
  components/
    review-form.tsx       # Review submission form
    review-dialog.tsx     # Modal wrapper for form
    testimonials-section.tsx  # Displays approved reviews
  pages/
    admin.tsx             # Admin dashboard with ReviewsManager

server/
  routes.ts              # API endpoints for reviews
  storage.ts             # Database CRUD operations

shared/
  schema.ts              # Reviews table schema + validation

scripts/
  add-reviews-table.ts   # Creates reviews table in SQLite
  seed-reviews.ts        # Seeds sample review data
  list-reviews.ts        # Lists all reviews with details
```

## SQLite Compatibility Notes

The review system handles SQLite-specific requirements:
- Boolean fields (`approved`, `featured`) stored as integers (0/1)
- Column mapping converts snake_case DB columns to camelCase TypeScript properties
- Timestamps handled appropriately for SQLite storage

## Next Steps (Optional)

### Add ReviewDialog to Other Pages
You can add the "Leave a Review" button to other strategic locations:

1. **Pricing Page Footer**
   ```tsx
   import { ReviewDialog } from "@/components/review-dialog";

   <ReviewDialog>
     <Button>Share Your Experience</Button>
   </ReviewDialog>
   ```

2. **Portfolio Gallery Page**
   Add after viewing project details

3. **Contact Page**
   Add after successful form submission

### Email Notifications
Add email alerts when new reviews are submitted by updating the `POST /api/reviews` endpoint in `server/routes.ts` to call the SendGrid email function.

### Review Analytics
Track review submission conversions using the existing Google Analytics integration:
```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('Review', 'submit', reviewData.projectType);
```

## Support

For questions or issues with the review system, refer to the main project documentation in `CLAUDE.md`.
