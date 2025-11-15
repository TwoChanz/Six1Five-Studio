# Quick Production Deploy - 45 Minutes to Live

**Goal:** Get your site live on Vercel with database, email, and analytics.

**Time:** 45 minutes total

---

## Prerequisites (2 minutes)

```bash
# Verify you have Node.js 18+
node --version

# Install Vercel CLI
npm install -g vercel
```

---

## Step 1: Database Setup (10 minutes)

### Option A: Neon (Recommended - Fastest)

1. Go to https://neon.tech
2. Click "Sign up" → Use GitHub
3. Click "New Project"
   - Name: `six1five-production`
   - Region: Choose closest to you
   - Click "Create Project"
4. **Copy the connection string** (starts with `postgresql://`)

### Option B: Railway (Easier for beginners)

1. Go to https://railway.app
2. Login with GitHub
3. Click "New Project" → "Provision PostgreSQL"
4. Click database → "Variables" tab → Copy `DATABASE_URL`

**Update your .env:**
```env
USE_SQLITE=false
DATABASE_URL=postgresql://[paste-your-connection-string-here]
```

**Initialize database:**
```bash
npm run db:push
tsx scripts/seed-sample-portfolio.ts
tsx scripts/seed-reviews.ts
```

---

## Step 2: Email Setup (10 minutes)

1. Go to https://resend.com/signup
2. Verify your email
3. Click "API Keys" → "Create API Key"
   - Name: `Production`
   - Permission: Full Access
   - Copy the key (starts with `re_`)

4. Click "Domains" → "Add Domain" OR use test email:
   - **Quick option:** Use `onboarding@resend.dev` (testing only, works immediately)
   - **Production option:** Add your domain (requires DNS setup)

**Update your .env:**
```env
RESEND_API_KEY=re_[paste-your-key-here]
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=your-actual-email@gmail.com
```

**Test locally:**
```bash
npm run dev
# Go to localhost:5000
# Submit contact form
# Check your email inbox (should arrive in 1-2 min)
```

---

## Step 3: Google Analytics (5 minutes)

1. Go to https://analytics.google.com
2. Click "Start measuring"
3. Account name: `Six1Five Studio` → Next
4. Property name: `Six1Five Website` → Next
5. Business info: Select relevant options → Create
6. Accept terms
7. Choose platform: **Web**
8. Website URL: `https://your-domain.com` (or use placeholder)
9. **Copy the Measurement ID** (format: `G-XXXXXXXXXX`)

**Update your .env:**
```env
VITE_GA_MEASUREMENT_ID=G-[paste-your-id-here]
```

---

## Step 4: Security (2 minutes)

**Generate admin password hash:**
```bash
npx tsx scripts/hash-password.ts MySecurePassword123!
```

**Copy the output hash and update .env:**
```env
ADMIN_PASSWORD_HASH=$2a$10$[paste-hash-here]
```

**Verify JWT secret exists:**
```bash
# Check if JWT_SECRET is already in .env
# If not, generate one:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Add to .env if missing:**
```env
JWT_SECRET=[paste-generated-secret-here]
```

---

## Step 5: Local Build Test (3 minutes)

```bash
# Test production build locally
npm run build

# Should complete without errors
# Check for dist/ folder
```

---

## Step 6: Deploy to Vercel (10 minutes)

### First Deployment

```bash
# Login to Vercel
vercel login

# Deploy
vercel
```

**Answer prompts:**
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **six1five-studio** (or your choice)
- Directory? **./** (press Enter)
- Override settings? **N**

**Vercel will deploy and give you a URL like:**
`https://six1five-studio.vercel.app`

### Add Environment Variables

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (one by one):

```env
USE_SQLITE = false
DATABASE_URL = postgresql://your-connection-string
JWT_SECRET = your-jwt-secret
ADMIN_PASSWORD_HASH = your-bcrypt-hash
RESEND_API_KEY = re_your-key
RESEND_FROM_EMAIL = onboarding@resend.dev
RESEND_TO_EMAIL = your-email@gmail.com
VITE_GA_MEASUREMENT_ID = G-XXXXXXXXXX
```

**Important:**
- Make sure to apply to "Production" environment
- No quotes around values
- Click "Save" after each one

### Redeploy with Environment Variables

```bash
# Trigger new deployment with env vars
vercel --prod
```

---

## Step 7: Verify Production (5 minutes)

Visit your production URL: `https://your-project.vercel.app`

**Test checklist:**
- [ ] Home page loads
- [ ] Gallery page shows portfolio items
- [ ] Contact form submits (check your email inbox)
- [ ] Admin login works at `/admin` (use your password)
- [ ] Google Analytics Realtime shows you as active user

---

## Done! 🎉

Your site is live at: `https://your-project.vercel.app`

---

## Quick Reference: Your .env File

```env
# Database
USE_SQLITE=false
DATABASE_URL=postgresql://user:pass@host:5432/db

# Security
JWT_SECRET=your-64-char-hex-string
ADMIN_PASSWORD_HASH=$2a$10$your-bcrypt-hash

# Email
RESEND_API_KEY=re_your-api-key
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=your-email@gmail.com

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Troubleshooting

### Build fails with database error
```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL  # Linux/Mac
echo %DATABASE_URL%  # Windows CMD

# Test connection locally
npm run dev
```

### Contact form doesn't send email
1. Check Vercel environment variables are set
2. Verify `RESEND_API_KEY` starts with `re_`
3. Check Resend dashboard → Activity for error messages

### Admin login doesn't work
1. Verify `ADMIN_PASSWORD_HASH` is set in Vercel
2. Make sure `JWT_SECRET` is set
3. Try generating a new password hash locally and updating Vercel

### Google Analytics not tracking
1. Check browser console for errors (F12 → Console)
2. Verify `VITE_GA_MEASUREMENT_ID` starts with `G-`
3. Update GA4 property URL to match your Vercel domain

---

## Custom Domain (Optional - 5 minutes)

Once you have a domain:

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `six1fivestudio.com`)
3. Follow Vercel's DNS instructions
4. Update Google Analytics URL to match

---

## Next Steps After Deployment

1. **Replace sample data:**
   ```bash
   tsx scripts/add-portfolio-item.ts
   ```

2. **Update content:**
   - Edit `client/src/data/services.json`
   - Edit `client/src/data/faq.json`
   - Replace testimonials in `client/src/components/testimonials-section.tsx`

3. **Add real content via Admin Dashboard:**
   - Go to `your-site.com/admin`
   - Manage portfolio, blog, reviews

4. **Complete SEO** (see `SEO_TODO.md`)

5. **Monitor:**
   - Check Google Analytics daily
   - Check Resend dashboard for email deliverability
   - Monitor Vercel deployment logs

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Resend Docs:** https://resend.com/docs
- **Google Analytics:** https://support.google.com/analytics

---

**You're live! Now focus on adding your real portfolio content and driving traffic.** 🚀
