import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertContactSubmissionSchema, insertBlogPostSchema, insertPortfolioItemSchema, insertReviewSchema, insertLeadSchema, type InsertLead } from "../shared/schema.js";
import { LEAD_MAGNETS, HONEYPOT_FIELD, leadRequestSchema, type LeadResponse } from "../shared/lead-magnets.js";
import { z } from "zod";
import { Resend } from "resend";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { generateContactFormEmail, generateContactFormPlainText } from "./email-templates.js";
import { verifyAdminPassword, generateToken, requireAuth } from "./auth.js";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Configure multer for file uploads.
// Files are held in memory: Vercel's filesystem is read-only, so writing to
// server/uploads fails there. In production they are delivered as attachments
// on the notification email; in local dev they are also written to disk.
const uploadDir = path.join(__dirname, 'uploads', 'contact-submissions');

// Vercel rejects request bodies over 4.5 MB before they reach this function,
// so the whole submission (all files together) must stay under that.
const MAX_TOTAL_UPLOAD_BYTES = 4 * 1024 * 1024;

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images, PDFs, and text files are allowed.`) as any, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_TOTAL_UPLOAD_BYTES,
    files: 5 // Max 5 files per submission
  },
  fileFilter
});

// Run multer and turn its errors (too large, wrong type) into a 400 response
// instead of letting them fall through to the generic error handler.
const uploadReferenceFiles: RequestHandler = (req, res, next) => {
  upload.array('referenceFiles', 5)(req, res, (err: unknown) => {
    if (!err) return next();
    const message = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
      ? 'Files are too large. Please keep attachments under 4MB in total.'
      : err instanceof Error ? err.message : 'File upload failed';
    res.status(400).json({ message });
  });
};

// Keep only the base name and drop characters that are unsafe in a filename.
function safeFileName(originalName: string): string {
  return path.basename(originalName).replace(/[^\w.\- ]+/g, '_') || 'file';
}

// Returns what to store in contact_submissions.reference_files.
// Local dev: write to disk and store the /uploads path (served statically).
// Vercel: nothing can be written, so store the file names; the files
// themselves travel with the notification email.
async function storeReferenceFiles(files: Express.Multer.File[]): Promise<string[]> {
  if (process.env.VERCEL) {
    return files.map(file => safeFileName(file.originalname));
  }

  await fs.mkdir(uploadDir, { recursive: true });
  return Promise.all(files.map(async file => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    await fs.writeFile(path.join(uploadDir, filename), file.buffer);
    return `/uploads/contact-submissions/${filename}`;
  }));
}

// Escape user-supplied text before putting it in an HTML email.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter for admin endpoints
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for contact form (prevent spam)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 submissions per 15 minutes per IP
  message: {
    error: 'Too Many Requests',
    message: 'You can only submit the contact form 3 times per 15 minutes. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in development for easier testing
  skip: (req) => process.env.NODE_ENV === 'development',
});

// Rate limiter for lead magnet downloads
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 downloads per 15 minutes per IP
  message: {
    error: 'Too Many Requests',
    message: 'You can only download resources 5 times per 15 minutes. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development',
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint (no database)
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? "vercel" : "local"
    });
  });

  // Legacy route redirects (301 permanent redirect for SEO)
  app.get("/insights", (req, res) => {
    res.redirect(301, "/blog");
  });

  // Every /api/admin/* request needs a valid admin token, except logging in
  // and out. This runs before the routes below, so a new admin route is
  // protected even if someone forgets to add requireAuth to it.
  // Admin responses must never be cached or indexed.
  app.use("/api/admin", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    res.set("X-Robots-Tag", "noindex, nofollow");
    if (req.path === "/login" || req.path === "/logout") return next();
    requireAuth(req, res, next);
  });

  // Admin authentication endpoints
  app.post("/api/admin/login", loginLimiter, async (req, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Password is required' 
        });
      }

      const isValid = await verifyAdminPassword(password);
      
      if (!isValid) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Invalid password' 
        });
      }

      // Generate JWT token
      const token = generateToken();
      if (!token) {
        return res.status(503).json({
          error: 'Service Unavailable',
          message: 'Admin login is not configured on this server'
        });
      }

      res.json({ 
        success: true,
        token,
        expiresIn: '8h',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'An error occurred during login' 
      });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    // Could implement token blacklist if needed
    res.json({ success: true });
  });

  app.get("/api/admin/verify", requireAuth, (req, res) => {
    // If middleware passes, token is valid
    res.json({ valid: true, user: (req as any).user });
  });

  // Substack RSS feed proxy
  app.get("/api/substack/feed", async (req, res) => {
    try {
      const response = await fetch('https://digitalblueprint.substack.com/feed');
      const xml = await response.text();
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Failed to fetch Substack feed:', error);
      res.status(500).json({ error: 'Failed to fetch Substack feed' });
    }
  });

  // Serve uploaded files statically (protected route - consider adding auth later)
  app.use('/uploads', (req, res, next) => {
    // Simple security: only allow access to contact-submissions
    if (req.path.startsWith('/contact-submissions/')) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  }, (await import('express')).static(path.join(__dirname, 'uploads')));

  // Contact form submission with file uploads
  app.post("/api/contact", contactLimiter, uploadReferenceFiles, async (req, res) => {
    try {
      // Parse services as JSON array if it's a string
      const services = typeof req.body.services === 'string'
        ? JSON.parse(req.body.services)
        : req.body.services;

      const files = (req.files as Express.Multer.File[] | undefined) ?? [];
      const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
      if (totalBytes > MAX_TOTAL_UPLOAD_BYTES) {
        return res.status(400).json({
          message: 'Files are too large. Please keep attachments under 4MB in total.'
        });
      }

      const filePaths = await storeReferenceFiles(files);

      const formData = {
        ...req.body,
        services,
        referenceFiles: filePaths
      };

      const validatedData = insertContactSubmissionSchema.parse(formData);
      const submission = await storage.createContactSubmission(validatedData);

      // Send email notification if Resend is configured
      if (resend && process.env.RESEND_FROM_EMAIL) {
        try {
          const htmlEmail = generateContactFormEmail(validatedData);
          const plainTextEmail = generateContactFormPlainText(validatedData);

          const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: process.env.RESEND_TO_EMAIL || process.env.RESEND_FROM_EMAIL,
            subject: `🚁 New Project Inquiry: ${validatedData.projectType} - ${validatedData.name}`,
            html: htmlEmail,
            text: plainTextEmail,
            attachments: files.map(file => ({
              filename: safeFileName(file.originalname),
              content: file.buffer,
            })),
          });

          if (error) {
            console.error('Failed to send email:', error);
          } else {
            console.log('✅ Email sent successfully via Resend. ID:', data?.id);
          }
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Don't fail the request if email fails
        }
      } else {
        console.warn('Resend not configured. Email notification skipped. Set RESEND_API_KEY and RESEND_FROM_EMAIL environment variables.');
        if (files.length > 0 && process.env.VERCEL) {
          console.error(`${files.length} uploaded file(s) were dropped: email is the only delivery path for attachments on Vercel.`);
        }
      }

      res.json({ success: true, submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Validation error:', error.errors);
        res.status(400).json({ message: "Invalid form data", errors: error.errors });
      } else {
        console.error('❌ Contact form error:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
        res.status(500).json({ 
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  });

  // Admin: Get all contact submissions
  app.get("/api/admin/contact", adminLimiter, requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lead magnet capture endpoint.
  // Validates and saves the visitor's details, then returns the link to the
  // requested file. It never echoes stored lead data back, and nothing is
  // emailed to the visitor (the download is handed over on the page).
  app.post("/api/leads", leadLimiter, async (req, res) => {
    try {
      const parsed = leadRequestSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        return res.status(400).json({
          message: "Please check your name and email and try again.",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const { name, email, company, source, resource, [HONEYPOT_FIELD]: honeypot } = parsed.data;
      const magnet = LEAD_MAGNETS[resource];
      const response: LeadResponse = {
        success: true,
        downloadUrl: magnet.downloadUrl,
        fileName: magnet.fileName,
      };

      // A filled honeypot means a bot. Answer as if it worked, save nothing.
      if (honeypot && honeypot.trim() !== "") {
        console.warn("Lead form honeypot triggered; submission discarded");
        return res.json(response);
      }

      const leadData: InsertLead = {
        name,
        email,
        company: company ?? null,
        source,
        resourceRequested: magnet.title,
      };
      await storage.createLead(leadData);

      // Notify the site owner if Resend is configured.
      if (resend) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const toEmail = process.env.RESEND_TO_EMAIL || fromEmail;

        try {
          await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            replyTo: email,
            subject: `New lead: ${magnet.title}`,
            html: `
              <h2>New guide download</h2>
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Company:</strong> ${escapeHtml(company ?? 'Not provided')}</p>
              <p><strong>Resource:</strong> ${escapeHtml(magnet.title)}</p>
              <p><strong>Source:</strong> ${escapeHtml(source)}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
            `,
            text: [
              'New guide download',
              `Name: ${name}`,
              `Email: ${email}`,
              `Company: ${company ?? 'Not provided'}`,
              `Resource: ${magnet.title}`,
              `Source: ${source}`,
            ].join('\n'),
          });
        } catch (emailError) {
          console.error('Failed to send lead notification email:', emailError);
          // Don't fail the request if the notification fails
        }
      }

      res.json(response);
    } catch (error) {
      console.error("Lead capture error:", error);
      res.status(500).json({ message: "Something went wrong saving your details. Please try again." });
    }
  });

  // Admin: Get all leads (guide downloads)
  app.get("/api/admin/leads", adminLimiter, requireAuth, async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Leads fetch error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin: Delete a lead
  app.delete("/api/admin/leads/:id", adminLimiter, requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid lead id" });
      }
      await storage.deleteLead(id);
      res.json({ success: true, message: "Lead deleted" });
    } catch (error) {
      console.error("Lead deletion error:", error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  // Dataset download with email capture
  app.post("/api/dataset-download", leadLimiter, async (req, res) => {
    try {
      const { name, email, company } = req.body;

      // Create lead record
      const leadData = {
        name,
        email,
        company: company || null,
        source: "sample-dataset-banner",
        resourceRequested: "Stockpile Photogrammetry Sample Dataset"
      };

      const validatedData = insertLeadSchema.parse(leadData);
      const lead = await storage.createLead(validatedData);

      // Send email with download link if Resend is configured
      if (resend && process.env.RESEND_FROM_EMAIL) {
        const fromEmail = process.env.RESEND_FROM_EMAIL;
        const downloadUrl = `${req.protocol}://${req.get('host')}/downloads/stockpile-photogrammetry-sample-dataset.zip`;

        try {
          await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: "Your Free Reality Capture Sample Dataset",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Thanks for downloading!</h2>
                <p>Hi ${name},</p>
                <p>Thanks for your interest in Six1Five Studio. Your sample dataset is ready to download:</p>
                <p style="margin: 20px 0;">
                  <a href="${downloadUrl}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Download Dataset (109 MB)
                  </a>
                </p>
                <p><strong>What's included:</strong></p>
                <ul>
                  <li>28 high-resolution aerial photos (DNG format)</li>
                  <li>Ground Control Points (GCP) file</li>
                  <li>Camera calibration data</li>
                  <li>Processing instructions PDF</li>
                </ul>
                <p>Perfect for testing with RealityCapture, Pix4D, or Agisoft Metashape.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 14px; color: #666;">
                  Need professional reality capture services? <a href="https://six1fivestudio.com/pricing">View our pricing</a> or <a href="https://six1fivestudio.com/#contact">get in touch</a>.
                </p>
                <p style="font-size: 12px; color: #999;">
                  Six1Five Studio | Reality Capture & Drone Mapping<br>
                  <a href="https://six1fivestudio.com">six1fivestudio.com</a>
                </p>
              </div>
            `,
            text: `Hi ${name},

Thanks for your interest in Six1Five Studio. Your sample dataset is ready to download:

${downloadUrl}

What's included:
- 28 high-resolution aerial photos (DNG format)
- Ground Control Points (GCP) file
- Camera calibration data
- Processing instructions PDF

Perfect for testing with RealityCapture, Pix4D, or Agisoft Metashape.

---
Need professional reality capture services? Visit https://six1fivestudio.com/pricing or contact us at https://six1fivestudio.com/#contact

Six1Five Studio | Reality Capture & Drone Mapping
https://six1fivestudio.com`
          });

          console.log('✅ Dataset download email sent to:', email);
        } catch (emailError) {
          console.error('Failed to send dataset email:', emailError);
          // Don't fail the request if email fails
        }

        // Also notify admin
        try {
          const toEmail = process.env.RESEND_TO_EMAIL || fromEmail;
          await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: `New Dataset Download: ${name}`,
            html: `
              <h2>New Sample Dataset Download</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Company:</strong> ${company || 'Not provided'}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send admin notification:', emailError);
        }
      }

      res.json({
        success: true,
        lead,
        downloadUrl: "/downloads/stockpile-photogrammetry-sample-dataset.zip"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid data",
          errors: error.errors
        });
      }
      console.error("Dataset download error:", error);
      res.status(500).json({ message: "Failed to process download request" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Blog fetch error:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);

      // Drafts are only visible in the admin dashboard.
      if (!post || !post.published) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Blog post fetch error:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Admin: Create blog post
  app.post("/api/admin/blog", adminLimiter, requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.json(post);
    } catch (error) {
      console.error("Blog post creation error:", error);
      res.status(400).json({ error: "Invalid blog post data" });
    }
  });

  // Admin: Get all blog posts (including unpublished)
  app.get("/api/admin/blog", adminLimiter, requireAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Blog posts fetch error:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Admin: Update blog post
  app.put("/api/admin/blog/:id", adminLimiter, requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const result = await storage.updateBlogPost(parseInt(id), updates);
      if (!result) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(result);
    } catch (error) {
      console.error("Blog post update error:", error);
      res.status(400).json({ error: "Failed to update blog post" });
    }
  });

  // Admin: Delete blog post
  app.delete("/api/admin/blog/:id", adminLimiter, requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBlogPost(parseInt(id));
      res.json({ success: true, message: "Blog post deleted" });
    } catch (error) {
      console.error("Blog post deletion error:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getPublishedPortfolioItems();
      res.json(items);
    } catch (error) {
      console.error("Portfolio fetch error:", error);
      res.status(500).json({ error: "Failed to fetch portfolio items" });
    }
  });

  app.get("/api/portfolio/featured", async (req, res) => {
    try {
      const items = await storage.getFeaturedPortfolioItems();
      res.json(items);
    } catch (error) {
      console.error("Featured portfolio fetch error:", error);
      res.status(500).json({ error: "Failed to fetch featured portfolio items" });
    }
  });

  app.get("/api/portfolio/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await storage.getPortfolioItemById(parseInt(id));

      // Unpublished items are only visible in the admin dashboard.
      if (!item || !item.published) {
        return res.status(404).json({ error: "Portfolio item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Portfolio item fetch error:", error);
      res.status(500).json({ error: "Failed to fetch portfolio item" });
    }
  });

  // Admin: Create portfolio item
  app.post("/api/admin/portfolio", adminLimiter, requireAuth, async (req, res) => {
    try {
      const validatedData = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Portfolio item creation error:", error);
      res.status(400).json({ error: "Invalid portfolio item data" });
    }
  });

  // Admin: Get all portfolio items (including unpublished)
  app.get("/api/admin/portfolio", adminLimiter, requireAuth, async (req, res) => {
    try {
      const items = await storage.getPortfolioItems();
      res.json(items);
    } catch (error) {
      console.error("Admin portfolio fetch error:", error);
      res.status(500).json({ error: "Failed to fetch portfolio items" });
    }
  });

  // Admin: Update portfolio item
  app.put("/api/admin/portfolio/:id", adminLimiter, requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const result = await storage.updatePortfolioItem(parseInt(id), updates);
      if (!result) {
        return res.status(404).json({ error: "Portfolio item not found" });
      }
      res.json(result);
    } catch (error) {
      console.error("Portfolio item update error:", error);
      res.status(400).json({ error: "Failed to update portfolio item" });
    }
  });

  // Admin: Delete portfolio item
  app.delete("/api/admin/portfolio/:id", adminLimiter, requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePortfolioItem(parseInt(id));
      res.json({ success: true, message: "Portfolio item deleted" });
    } catch (error) {
      console.error("Portfolio item deletion error:", error);
      res.status(500).json({ error: "Failed to delete portfolio item" });
    }
  });

  // Admin: Delete contact submission
  app.delete("/api/admin/contact/:id", adminLimiter, requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteContactSubmission(parseInt(id));
      res.json({ success: true, message: "Contact submission deleted" });
    } catch (error) {
      console.error("Contact submission deletion error:", error);
      res.status(500).json({ error: "Failed to delete contact submission" });
    }
  });

  // Reviews routes
  // Public: Get approved reviews (for display on site)
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getApprovedReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Reviews fetch error:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Public: Get featured reviews (for homepage)
  app.get("/api/reviews/featured", async (req, res) => {
    try {
      const reviews = await storage.getFeaturedReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Featured reviews fetch error:", error);
      res.status(500).json({ error: "Failed to fetch featured reviews" });
    }
  });

  // Public: Submit a new review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.json({
        success: true,
        message: "Review submitted successfully! It will be published after approval.",
        review
      });
    } catch (error) {
      console.error("Review submission error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid review data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  // Admin: Get all reviews (including pending)
  app.get("/api/admin/reviews", adminLimiter, requireAuth, async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Admin reviews fetch error:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Admin: Approve a review
  app.put("/api/admin/reviews/:id/approve", adminLimiter, requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const review = await storage.approveReview(parseInt(id));
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      console.error("Review approval error:", error);
      res.status(500).json({ error: "Failed to approve review" });
    }
  });

  // Admin: Toggle featured status
  app.put("/api/admin/reviews/:id/featured", adminLimiter, requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const review = await storage.toggleFeaturedReview(parseInt(id));
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      console.error("Review featured toggle error:", error);
      res.status(500).json({ error: "Failed to toggle featured status" });
    }
  });

  // Admin: Delete a review
  app.delete("/api/admin/reviews/:id", adminLimiter, requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteReview(parseInt(id));
      res.json({ success: true, message: "Review deleted" });
    } catch (error) {
      console.error("Review deletion error:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // Any other /api path is a 404 in JSON, instead of falling through to the
  // site's HTML page. This covers the old public paths that used to expose
  // admin data (GET /api/contact, POST /api/blog, POST /api/portfolio).
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
