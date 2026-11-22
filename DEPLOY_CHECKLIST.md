# Production Deployment Checklist

**Print this and check off as you go.**

---

## Pre-Deployment (15 minutes)

### Database
- [ ] Created Neon or Railway account
- [ ] Provisioned PostgreSQL database
- [ ] Copied `DATABASE_URL` connection string
- [ ] Updated `.env` with `USE_SQLITE=false`
- [ ] Updated `.env` with `DATABASE_URL`
- [ ] Ran `npm run db:push`
- [ ] Ran `tsx scripts/seed-sample-portfolio.ts`
- [ ] Ran `tsx scripts/seed-reviews.ts`

### Email (Resend)
- [ ] Created Resend account at https://resend.com
- [ ] Verified email address
- [ ] Created API key
- [ ] Updated `.env` with `RESEND_API_KEY`
- [ ] Updated `.env` with `RESEND_FROM_EMAIL`
- [ ] Updated `.env` with `RESEND_TO_EMAIL`
- [ ] Tested contact form locally (received email)

### Analytics
- [ ] Created Google Analytics 4 property
- [ ] Copied Measurement ID (G-XXXXXXXXXX)
- [ ] Updated `.env` with `VITE_GA_MEASUREMENT_ID`
- [ ] Verified tracking in Realtime report

### Security
- [ ] Generated admin password hash with `hash-password.ts`
- [ ] Updated `.env` with `ADMIN_PASSWORD_HASH`
- [ ] Verified `JWT_SECRET` exists in `.env`
- [ ] Tested admin login at `/admin` locally

### Local Testing
- [ ] Ran `npm run build` successfully
- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] Contact form submits and sends email
- [ ] Admin dashboard login works
- [ ] Portfolio items load
- [ ] Gallery page displays projects
- [ ] All pages render without errors

---

## Deployment (15 minutes)

### Vercel Setup
- [ ] Installed Vercel CLI: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Ran initial deploy: `vercel`
- [ ] Got deployment URL (e.g., `six1five-studio.vercel.app`)

### Environment Variables (Add in Vercel Dashboard)
Go to: Project → Settings → Environment Variables

- [ ] `USE_SQLITE` = `false`
- [ ] `DATABASE_URL` = `postgresql://...`
- [ ] `JWT_SECRET` = `your-secret-here`
- [ ] `ADMIN_PASSWORD_HASH` = `$2a$10$...`
- [ ] `RESEND_API_KEY` = `re_...`
- [ ] `RESEND_FROM_EMAIL` = `your-email`
- [ ] `RESEND_TO_EMAIL` = `your-email`
- [ ] `VITE_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`

### Redeploy with Environment Variables
- [ ] Ran `vercel --prod` to redeploy
- [ ] Deployment succeeded
- [ ] No build errors in Vercel logs

---

## Post-Deployment Testing (10 minutes)

Visit your production URL: `https://your-project.vercel.app`

### Functionality Tests
- [ ] Home page loads
- [ ] Gallery page shows portfolio items (6 sample items)
- [ ] Pricing page displays
- [ ] Blog page loads
- [ ] FAQ page loads
- [ ] Contact form renders
- [ ] Navbar navigation works
- [ ] Mobile menu works
- [ ] Footer links work

### Contact Form Test
- [ ] Filled out contact form with test data
- [ ] Form submitted successfully
- [ ] Received email notification within 2 minutes
- [ ] Email content formatted correctly

### Admin Dashboard Test
- [ ] Navigated to `/admin`
- [ ] Logged in with admin password
- [ ] Dashboard displays contact submissions
- [ ] Blog posts list shows
- [ ] Portfolio items list shows
- [ ] Can toggle publish/featured status
- [ ] Logout works

### Analytics Test
- [ ] Opened browser console (F12)
- [ ] Saw GA initialization message
- [ ] Checked Google Analytics → Realtime
- [ ] Saw 1 active user (yourself)
- [ ] Navigated to multiple pages
- [ ] GA tracked page views

### Performance Test
- [ ] Ran Lighthouse audit (Chrome DevTools)
- [ ] Performance score > 80
- [ ] No console errors
- [ ] Images load properly
- [ ] 3D viewers lazy-load

---

## Optional Enhancements

### Custom Domain
- [ ] Purchased domain
- [ ] Added domain in Vercel dashboard
- [ ] Configured DNS records
- [ ] SSL certificate active
- [ ] Updated Google Analytics property URL

### SEO
- [ ] Added meta tags to remaining pages (see `SEO_TODO.md`)
- [ ] Verified `robots.txt` accessible
- [ ] Verified `sitemap.xml` accessible
- [ ] Submitted sitemap to Google Search Console

### Content
- [ ] Replaced sample portfolio items with real projects
- [ ] Updated testimonials with real client feedback
- [ ] Updated pricing with actual rates
- [ ] Added real blog posts
- [ ] Updated services in `services.json`
- [ ] Updated FAQ in `faq.json`

---

## Monitoring Setup

### Email Monitoring
- [ ] Added your email to Resend notifications
- [ ] Verified email deliverability in Resend Activity
- [ ] Set up email forwarding if needed

### Analytics Monitoring
- [ ] Set up Google Analytics alerts for traffic drops
- [ ] Set up conversion tracking for contact form
- [ ] Bookmarked GA4 dashboard

### Error Monitoring
- [ ] Check Vercel deployment logs regularly
- [ ] Monitor Vercel Analytics (if on paid plan)
- [ ] Set up error tracking (Sentry/LogRocket optional)

---

## Maintenance Schedule

### Weekly
- [ ] Check contact form submissions in admin
- [ ] Review Google Analytics traffic
- [ ] Check email deliverability in Resend
- [ ] Monitor Vercel deployment status

### Monthly
- [ ] Update portfolio with new projects
- [ ] Publish new blog post
- [ ] Review and approve new reviews
- [ ] Check for dependency updates: `npm outdated`

### Quarterly
- [ ] Run Lighthouse audit
- [ ] Review and update pricing
- [ ] Backup database (export from Neon/Railway)
- [ ] Review analytics goals and conversions

---

## Emergency Contacts

**Hosting Issues:**
- Vercel Status: https://www.vercel-status.com
- Vercel Support: https://vercel.com/support

**Database Issues:**
- Neon Status: https://neon.tech/docs/introduction/status
- Railway Status: https://status.railway.app

**Email Issues:**
- Resend Status: https://resend.com/status
- Resend Support: https://resend.com/support

---

## Rollback Plan

If deployment fails:

1. **Check Vercel deployment logs:**
   ```
   Vercel Dashboard → Deployments → [Failed Deployment] → View Logs
   ```

2. **Rollback to previous deployment:**
   ```
   Vercel Dashboard → Deployments → [Previous Successful] → Promote to Production
   ```

3. **Test locally with production env:**
   ```bash
   # Copy production env vars to .env
   npm run build
   npm run start
   ```

4. **Common fixes:**
   - Missing environment variable → Add in Vercel dashboard → Redeploy
   - Database connection error → Verify DATABASE_URL → Redeploy
   - Build error → Check `npm run build` locally → Fix → Push → Redeploy

---

## Success Criteria

Your deployment is successful when:

- ✅ Site loads at production URL
- ✅ Contact form sends emails
- ✅ Admin dashboard accessible
- ✅ Google Analytics tracking visitors
- ✅ No console errors
- ✅ Lighthouse Performance > 80
- ✅ Database connection working
- ✅ All pages render correctly

---

## You're Live! 🎉

**Next Actions:**
1. Share your site URL on LinkedIn
2. Add portfolio projects via `/admin`
3. Start driving traffic (SEO, social media, ads)
4. Monitor analytics daily for first week

**Your live site:** `https://_____________________________.vercel.app`

**Admin dashboard:** `https://_____________________________.vercel.app/admin`

**Admin password:** `_____________________________` (store securely!)

---

**Deployed on:** _______________
**Deployed by:** _______________
**Notes:**
```

```
