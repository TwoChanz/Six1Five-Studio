# Production Setup Guide for Six1Five Studio

This guide walks you through setting up your production environment with all required services.

---

## 📋 Overview

You need to set up **4 critical services** before deploying to production:

1. ✅ **JWT Secret** - COMPLETED (automatically generated)
2. ✅ **Rate Limiting** - COMPLETED (contact form protected)
3. ⏳ **PostgreSQL Database** - Follow steps below
4. ⏳ **SendGrid Email** - Follow steps below
5. ⏳ **Google Analytics** - Follow steps below

**Estimated Total Time:** 30-45 minutes

---

## 🗄️ 1. PostgreSQL Database Setup

### Why PostgreSQL?

SQLite works great for local development but **cannot be used in production** because:
- No shared database across multiple server instances
- File-based storage doesn't work on serverless platforms (Vercel, Netlify)
- Limited concurrent connections
- No built-in backups or replication

PostgreSQL solves all these problems with a proper database server.

---

### Option A: Railway (Recommended - Easiest)

**Free Tier:** 500MB storage, shared CPU
**Best for:** Beginners, quick setup

**Step 1: Create Account**
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

**Step 2: Create Database**
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Wait 30 seconds for database to provision

**Step 3: Get Connection String**
1. Click your PostgreSQL database
2. Go to "Variables" tab
3. Find `DATABASE_URL`
4. Click the copy icon (looks like two squares)

**Step 4: Add to Your .env File**
1. Open `.env` in your project
2. Update these lines:
```env
USE_SQLITE=false
DATABASE_URL=postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway
```

**Step 5: Initialize Database**
```bash
# Push schema to database
npm run db:push

# Seed with sample data
npx tsx scripts/seed-sample-portfolio.ts
npx tsx scripts/seed-reviews.ts
```

---

### Option B: Neon (Serverless PostgreSQL)

**Free Tier:** 500MB storage, 3 projects
**Best for:** Auto-scaling, serverless deployments

**Step 1: Create Account**
1. Go to https://neon.tech
2. Click "Sign up" → Use GitHub
3. Verify your email

**Step 2: Create Project**
1. Click "New Project"
2. Name: `Six1Five Production`
3. Region: Choose closest to your users (e.g., US East, US West, Europe)
4. PostgreSQL version: 16 (latest)
5. Click "Create Project"

**Step 3: Get Connection String**
1. After project creates, you'll see connection details
2. Copy the connection string that looks like:
```
postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/neondb
```

**Step 4: Add to .env**
```env
USE_SQLITE=false
DATABASE_URL=postgresql://username:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/neondb
```

**Step 5: Initialize Database**
```bash
npm run db:push
npx tsx scripts/seed-sample-portfolio.ts
npx tsx scripts/seed-reviews.ts
```

---

### Option C: Supabase (PostgreSQL + Auth + Storage)

**Free Tier:** 500MB database, 1GB file storage
**Best for:** If you want built-in authentication and file storage

**Step 1: Create Account**
1. Go to https://supabase.com
2. Sign in with GitHub
3. Create organization

**Step 2: Create Project**
1. Click "New Project"
2. Name: `Six1Five Studio`
3. Database Password: Generate strong password (save this!)
4. Region: Choose closest to your users
5. Click "Create new project" (takes 2-3 minutes)

**Step 3: Get Connection String**
1. Go to Project Settings (⚙️ icon)
2. Click "Database" in left sidebar
3. Scroll to "Connection string"
4. Select "URI" tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password

**Step 4: Add to .env**
```env
USE_SQLITE=false
DATABASE_URL=postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres
```

**Step 5: Initialize Database**
```bash
npm run db:push
npx tsx scripts/seed-sample-portfolio.ts
npx tsx scripts/seed-reviews.ts
```

---

### Testing Your Database Connection

After setting up your database, test the connection:

```bash
# Test connection and list tables
npx tsx -e "
import { db } from './server/db';
import { portfolioItems } from '@shared/schema';

const items = await db.select().from(portfolioItems);
console.log('✅ Database connected! Found', items.length, 'portfolio items');
"
```

**Expected output:**
```
✅ Database connected! Found 6 portfolio items
```

---

## 📧 2. SendGrid Email Setup

### Why SendGrid?

Without email notifications, you **will miss client inquiries**. SendGrid ensures you're notified immediately when someone contacts you.

**Free Tier:** 100 emails/day (more than enough for a portfolio site)

---

### Step-by-Step Setup

**Step 1: Create Account (5 minutes)**
1. Go to https://sendgrid.com
2. Click "Start for Free"
3. Fill out registration form:
   - Email: Your business email
   - Password: Strong password
   - I'm not a robot: Complete CAPTCHA
4. Click "Create Account"
5. Check your email and verify your account

**Step 2: Complete Account Setup**
1. Login to SendGrid dashboard
2. You'll see a welcome wizard - follow it:
   - Tell us about your sending (select "Other")
   - Describe your sending (e.g., "Contact form notifications for business website")
   - Click "Get Started"

**Step 3: Verify Sender Identity (10 minutes)**

This is **critical** - emails won't send without verification!

1. Go to **Settings** → **Sender Authentication** (left sidebar)
2. Click "Verify a Single Sender"
3. Fill out the form:
   ```
   From Name: Six1Five Studio
   From Email: admin@six1fivestudio.com  (your business email)
   Reply To: admin@six1fivestudio.com

   Company Address:
   Street: [Your business address]
   City: [Your city]
   State: [Your state]
   Zip: [Your zip code]
   Country: United States

   Nickname: Six1Five Contact Form
   ```
4. Click "Create"
5. **Check your email** - SendGrid sent a verification link
6. Click the verification link in the email
7. You'll see "Sender Verified!" ✅

**Step 4: Create API Key (5 minutes)**
1. Go to **Settings** → **API Keys** (left sidebar)
2. Click "Create API Key"
3. Give it a name: `Six1Five-Production`
4. Permission Level: **Restricted Access**
5. Expand "Mail Send" section
6. Toggle **ON** only "Mail Send" permission
7. Click "Create & View"
8. **COPY THE API KEY IMMEDIATELY** (you'll never see it again!)

The key looks like:
```
SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Step 5: Add to Your .env File**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=admin@six1fivestudio.com
SENDGRID_TO_EMAIL=admin@six1fivestudio.com
```

**Step 6: Test Email Sending**

Start your dev server:
```bash
npm run dev
```

1. Open http://localhost:5000
2. Scroll to contact form
3. Fill it out with test data
4. Click "Submit"
5. **Check your email inbox** (should arrive within 1-2 minutes)

**Expected email format:**
```
Subject: 🚁 New Project Inquiry: [Project Type] - [Client Name]

From: Six1Five Studio <admin@six1fivestudio.com>

[Formatted email with all contact form details]
```

---

### Troubleshooting SendGrid

**Problem: Emails not arriving**

1. **Check SendGrid Activity Feed:**
   - Dashboard → Activity Feed
   - Look for your test submission
   - Status should be "Delivered"

2. **Check Spam Folder:**
   - Sometimes first email goes to spam
   - Mark as "Not Spam" to train your email client

3. **Verify Sender Email:**
   - Settings → Sender Authentication
   - Status should show "Verified" with green checkmark

4. **Check API Key Permissions:**
   - Settings → API Keys
   - Your key should have "Mail Send" enabled

5. **Check Console Logs:**
   - Look at terminal where `npm run dev` is running
   - Should see: `✅ Email sent successfully to admin@six1fivestudio.com`
   - If error, it will show SendGrid error message

**Problem: "403 Forbidden" error**

Your sender email is not verified. Go back to Step 3 and verify your sender.

**Problem: "401 Unauthorized" error**

Your API key is invalid or missing. Double-check:
1. You copied the entire key (starts with `SG.`)
2. No extra spaces or line breaks
3. Variable name is correct: `SENDGRID_API_KEY`

---

## 📊 3. Google Analytics Setup

### Why Google Analytics?

Without analytics, you're **flying blind**. You won't know:
- How many people visit your site
- Which services interest them most
- Where visitors come from (Google, social media, direct)
- Which blog posts are popular
- If your marketing efforts work

**Free Tier:** Unlimited traffic (completely free forever)

---

### Step-by-Step Setup

**Step 1: Create Google Analytics Account (5 minutes)**
1. Go to https://analytics.google.com
2. Sign in with your Google account (create one if needed)
3. Click "Start measuring"

**Step 2: Set Up Account (3 minutes)**
1. **Account setup:**
   - Account name: `Six1Five Studio`
   - Account data sharing: ✅ Check all boxes (helps improve Analytics)
   - Click "Next"

2. **Property setup:**
   - Property name: `Six1Five Portfolio Website`
   - Reporting time zone: Select your timezone
   - Currency: USD (or your currency)
   - Click "Next"

3. **Business information:**
   - Industry category: `Construction` or `Professional Services`
   - Business size: `Small` (1-10 employees)
   - Click "Next"

4. **Business objectives:**
   - Check boxes that apply:
     - ✅ Get baseline reports
     - ✅ Examine user behavior
     - ✅ Measure customer engagement
   - Click "Create"

5. Accept Terms of Service
   - Country: Your country
   - ✅ Check both boxes
   - Click "I Accept"

**Step 3: Set Up Data Stream (2 minutes)**
1. You'll see "Choose a platform"
2. Click **"Web"**
3. Enter website details:
   ```
   Website URL: https://six1fivestudio.com
   Stream name: Six1Five Production Website
   ```

   **Note:** Use your actual domain. If you don't have one yet, use:
   - Vercel: `https://your-project-name.vercel.app`
   - Netlify: `https://your-project-name.netlify.app`

4. Click "Create stream"

**Step 4: Get Your Measurement ID (1 minute)**

After creating the stream, you'll see:

```
📊 Web stream details

Stream name: Six1Five Production Website
Stream URL: https://six1fivestudio.com
Stream ID: 1234567890

Measurement ID: G-XXXXXXXXXX  ← COPY THIS
```

**The Measurement ID starts with "G-" followed by 10 characters.**

**Step 5: Add to Your .env File**
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** The prefix `VITE_` is required! This tells Vite to make the variable available to your frontend code.

**Step 6: Restart Dev Server**

Environment variables only load on server start:
```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

**Step 7: Verify Analytics is Working**

1. Open http://localhost:5000 in your browser
2. Open browser console (F12 → Console tab)
3. Look for this message:
   ```
   Google Analytics initialized: G-XXXXXXXXXX
   ```

4. Navigate between pages on your site (Gallery, Pricing, Blog, etc.)

5. Go back to Google Analytics dashboard
6. Click **"Reports"** (left sidebar)
7. Click **"Realtime"**
8. You should see **"1"** under "Users right now" (that's you!)

**If you see yourself in Realtime, it's working! 🎉**

---

### Understanding Your Analytics Reports

**Realtime Report** (immediate)
- Who's on your site RIGHT NOW
- What pages they're viewing
- Where they're located

**Acquisition Report** (daily/weekly)
- How people found your site:
  - Organic Search (Google, Bing)
  - Direct (typed URL)
  - Social (Facebook, LinkedIn, Twitter)
  - Referral (links from other websites)

**Engagement Report** (daily/weekly)
- Most popular pages
- How long visitors stay
- Bounce rate (% who leave immediately)
- Which blog posts get most views

**Events Report** (daily/weekly)
Your site tracks these custom events:
- `contact_form_submit` - Contact form submissions
- `portfolio_view` - Portfolio project views
- `cta_click` - Call-to-action button clicks
- `file_upload` - File uploads in contact form
- `gallery_filter` - Gallery category filtering

---

### Setting Up Alerts (Optional but Recommended)

Get notified when something important happens:

1. Go to **Admin** (bottom left) → **Custom Alerts**
2. Click "Create Custom Alert"
3. Set up these alerts:

**Traffic Drop Alert:**
```
Alert name: Daily Traffic Drop
Alert type: Custom
Conditions:
  - Sessions
  - % decrease is greater than 50%
  - compared to previous day
Send notifications: Daily
```

**New Conversion Alert:**
```
Alert name: Contact Form Submission
Alert type: Custom
Conditions:
  - contact_form_submit (event)
  - per day is greater than 0
Send notifications: Daily
```

---

### Updating Analytics for Production Domain

When you deploy and get a custom domain:

1. Go to **Admin** (bottom left)
2. Under **Property**, click **Data Streams**
3. Click your web stream
4. Update "Stream URL" from localhost to your production domain
5. Click "Save"

---

## ✅ 4. Final Configuration Checklist

Before deploying, verify all environment variables are set:

```bash
# View your current .env file (sensitive values hidden)
cat .env
```

**Your .env should have:**
```env
# Database
USE_SQLITE=false  ← Should be false for production
DATABASE_URL=postgresql://...  ← Your database connection string

# Security
JWT_SECRET=d7112490...  ← Already set ✅

# Email
SENDGRID_API_KEY=SG.xxxxx...  ← Set this
SENDGRID_FROM_EMAIL=admin@six1fivestudio.com  ← Set this
SENDGRID_TO_EMAIL=admin@six1fivestudio.com  ← Set this

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX  ← Set this
```

---

## 🧪 5. Testing Everything

Run through this checklist before deploying:

### Database Test
```bash
# Connect to database and list data
npx tsx -e "
import { db } from './server/db';
import { portfolioItems } from '@shared/schema';
const items = await db.select().from(portfolioItems);
console.log('Portfolio items:', items.length);
process.exit(0);
"
```

**Expected:** `Portfolio items: 6` (or however many you seeded)

### Email Test
```bash
npm run dev
```
1. Open http://localhost:5000
2. Fill out contact form
3. Submit
4. Check email inbox (should arrive in 1-2 minutes)

### Analytics Test
```bash
npm run dev
```
1. Open http://localhost:5000
2. Open browser console (F12)
3. Should see: `Google Analytics initialized: G-XXXXXXXXXX`
4. Go to Google Analytics → Realtime
5. Should see 1 active user (you)

### Rate Limiting Test
```bash
npm run dev
```
1. Open http://localhost:5000
2. Submit contact form 4 times quickly
3. 4th submission should fail with rate limit error

---

## 🚀 6. Deploy to Production

Now that everything is configured, you're ready to deploy!

### Option A: Vercel (Recommended)

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Login:**
```bash
vercel login
```

**Deploy:**
```bash
vercel
```

Follow the prompts:
1. Set up and deploy? **Y**
2. Which scope? **Your account**
3. Link to existing project? **N**
4. Project name? **six1five-studio**
5. Directory? **./** (default)
6. Override settings? **N**

**Add Environment Variables in Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`
   - `SENDGRID_TO_EMAIL`
   - `VITE_GA_MEASUREMENT_ID`
5. Click **"Redeploy"** to apply changes

**Test Production Site:**
1. Visit your Vercel URL (e.g., `https://six1five-studio.vercel.app`)
2. Test contact form → Check email
3. Visit analytics dashboard → Verify traffic shows up
4. Test admin login
5. Verify portfolio loads

---

## 🔧 Troubleshooting

### Problem: Database connection fails in production

**Symptoms:**
- Error: "Error: connect ETIMEDOUT"
- Error: "Error: Connection terminated unexpectedly"

**Solutions:**
1. **Check DATABASE_URL is correct:**
   - Go to your database provider dashboard
   - Copy connection string again
   - Make sure no spaces or line breaks

2. **Verify database is running:**
   - Railway: Check project status (should be green)
   - Neon: Check project is active
   - Supabase: Verify project didn't pause

3. **Check IP allowlist (if applicable):**
   - Supabase: Allow connections from any IP (0.0.0.0/0)
   - Most services allow by default

### Problem: Emails not sending in production

**Solutions:**
1. **Check SendGrid API key in production:**
   - Vercel: Settings → Environment Variables
   - Make sure key starts with `SG.`

2. **Verify sender email:**
   - SendGrid dashboard → Sender Authentication
   - Should show "Verified" status

3. **Check SendGrid Activity:**
   - Dashboard → Activity Feed
   - Look for failed deliveries
   - Check error messages

### Problem: Analytics not tracking in production

**Solutions:**
1. **Check VITE_GA_MEASUREMENT_ID:**
   - Must start with "G-"
   - Must have "VITE_" prefix
   - Verify in Vercel environment variables

2. **Update Google Analytics property:**
   - Admin → Data Streams
   - Update URL from localhost to production domain

3. **Check browser console:**
   - Should see GA initialization message
   - No errors about missing gtag

---

## 📚 Additional Resources

**Database:**
- Railway Docs: https://docs.railway.app/databases/postgresql
- Neon Docs: https://neon.tech/docs/introduction
- Supabase Docs: https://supabase.com/docs/guides/database

**Email:**
- SendGrid Docs: https://docs.sendgrid.com/for-developers/sending-email
- Sender Verification: https://docs.sendgrid.com/ui/sending-email/sender-verification

**Analytics:**
- GA4 Setup Guide: https://support.google.com/analytics/answer/9304153
- GA4 Events: https://support.google.com/analytics/answer/9267735

---

## ✅ You're All Set!

Once you've completed all sections:
- ✅ PostgreSQL database configured
- ✅ SendGrid email working
- ✅ Google Analytics tracking
- ✅ Rate limiting protecting contact form
- ✅ JWT secret securing admin auth

**Next Steps:**
1. Test everything one more time
2. Commit changes to git
3. Deploy to production
4. Share your portfolio with the world!

**Questions?** Refer to the BEGINNER_IMPROVEMENT_GUIDE.md for detailed explanations of each concept.
