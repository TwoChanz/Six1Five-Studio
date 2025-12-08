import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertContactSubmissionSchema, insertBlogPostSchema, insertPortfolioItemSchema, insertReviewSchema, insertLeadSchema } from "../shared/schema.js";
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

// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'uploads', 'contact-submissions');

const storage_multer = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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
  storage: storage_multer,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 5 // Max 5 files per submission
  },
  fileFilter
});

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
  app.post("/api/contact", contactLimiter, upload.array('referenceFiles', 5), async (req, res) => {
    try {
      // Parse services as JSON array if it's a string
      const services = typeof req.body.services === 'string'
        ? JSON.parse(req.body.services)
        : req.body.services;

      // Get uploaded file paths
      const files = req.files as Express.Multer.File[];
      const filePaths = files ? files.map(file => `/uploads/contact-submissions/${file.filename}`) : [];

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

  // Get all contact submissions (for admin use)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lead magnet capture endpoint
  app.post("/api/leads", leadLimiter, async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);

      // Send email notification if Resend is configured
      if (resend) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const toEmail = process.env.RESEND_TO_EMAIL || fromEmail;

        try {
          await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: `New Lead: ${validatedData.resourceRequested}`,
            html: `
              <h2>New Lead Magnet Download</h2>
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              <p><strong>Company:</strong> ${validatedData.company || 'Not provided'}</p>
              <p><strong>Resource:</strong> ${validatedData.resourceRequested}</p>
              <p><strong>Source:</strong> ${validatedData.source}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send lead notification email:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.json({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid lead data",
          errors: error.errors
        });
      }
      console.error("Lead capture error:", error);
      res.status(500).json({ message: "Failed to capture lead" });
    }
  });

  // Get all leads (for admin use)
  app.get("/api/leads", adminLimiter, requireAuth, async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Leads fetch error:", error);
      res.status(500).json({ message: "Internal server error" });
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
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Blog post fetch error:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
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
      
      if (!item) {
        return res.status(404).json({ error: "Portfolio item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Portfolio item fetch error:", error);
      res.status(500).json({ error: "Failed to fetch portfolio item" });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      const validatedData = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Portfolio item creation error:", error);
      res.status(400).json({ error: "Invalid portfolio item data" });
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

  const httpServer = createServer(app);
  return httpServer;
}
