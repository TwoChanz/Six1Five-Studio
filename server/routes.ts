import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertBlogPostSchema, insertPortfolioItemSchema } from "@shared/schema";
import { z } from "zod";
import sgMail from "@sendgrid/mail";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads', 'contact-submissions');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// File filter for security
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images, PDFs, and text files are allowed.`), false);
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

export async function registerRoutes(app: Express): Promise<Server> {
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
  app.post("/api/contact", upload.array('referenceFiles', 5), async (req, res) => {
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

      // Send email notification if SendGrid is configured
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
        try {
          const emailContent = `
            <h2>New Contact Form Submission - Six1Five Studio</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Project Type:</strong> ${validatedData.projectType}</p>
            <p><strong>Location:</strong> ${validatedData.location}</p>
            <p><strong>Services Requested:</strong> ${validatedData.services.join(', ')}</p>
            ${validatedData.timeline ? `<p><strong>Timeline:</strong> ${validatedData.timeline}</p>` : ''}
            ${validatedData.budgetRange ? `<p><strong>Budget Range:</strong> ${validatedData.budgetRange}</p>` : ''}
            <p><strong>Project Details:</strong></p>
            <p>${validatedData.projectDetails}</p>
            ${validatedData.referenceFiles && validatedData.referenceFiles.length > 0 ? `<p><strong>Reference Files:</strong> ${validatedData.referenceFiles.length} file(s) attached</p><ul>${validatedData.referenceFiles.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
          `;

          const msg = {
            to: process.env.SENDGRID_TO_EMAIL || process.env.SENDGRID_FROM_EMAIL,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: `New Project Inquiry: ${validatedData.projectType} - ${validatedData.name}`,
            html: emailContent,
          };

          await sgMail.send(msg);
          console.log('Email sent successfully to', msg.to);
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Don't fail the request if email fails
        }
      } else {
        console.warn('SendGrid not configured. Email notification skipped. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL environment variables.');
      }

      res.json({ success: true, submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid form data", errors: error.errors });
      } else {
        console.error('Contact form error:', error);
        res.status(500).json({ message: "Internal server error" });
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
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Blog post fetch error:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const post = insertBlogPostSchema.parse(req.body);
      const result = await storage.createBlogPost(post);
      res.json(result);
    } catch (error) {
      console.error("Blog post creation error:", error);
      res.status(400).json({ error: "Invalid blog post data" });
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
      const item = insertPortfolioItemSchema.parse(req.body);
      const result = await storage.createPortfolioItem(item);
      res.json(result);
    } catch (error) {
      console.error("Portfolio item creation error:", error);
      res.status(400).json({ error: "Invalid portfolio item data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
