import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  services: text("services").array().notNull().default([]),
  projectType: text("project_type").notNull(),
  location: text("location").notNull(),
  projectDetails: text("project_details").notNull(),
  timeline: text("timeline"),
  budgetRange: text("budget_range"),
  referenceFiles: text("reference_files").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  substackEmbedCode: text("substack_embed_code"), // Substack embed HTML code
  tags: text("tags").array().default([]),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sketchfabModelId: text("sketchfab_model_id"),
  lumaEmbedUrl: text("luma_embed_url"), // Luma AI embed URL or capture ID
  polycamEmbedUrl: text("polycam_embed_url"), // Polycam embed URL or capture ID
  modelFile: text("model_file"), // Local 3D model file path (GLB, GLTF, OBJ)
  modelFormat: text("model_format"), // File format: 'glb', 'gltf', 'obj'
  videoFile: text("video_file"), // Video demonstration/walkthrough file path
  videoFormat: text("video_format"), // Video format: 'mp4', 'webm', 'mov'
  category: text("category").notNull(),
  tools: text("tools").array().default([]),
  services: text("services").array().default([]),
  featuredImage: text("featured_image"),
  images: text("images").array().default([]),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  isConceptStudy: boolean("is_concept_study").default(false),
  hasCustomLayout: boolean("has_custom_layout").default(false), // Enable custom layout rendering for specific projects
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  company: text("company"),
  role: text("role"),
  rating: integer("rating").notNull(), // 1-5 stars
  reviewText: text("review_text").notNull(),
  projectType: text("project_type").notNull(), // Service they used
  approved: boolean("approved").default(false), // Admin moderation
  featured: boolean("featured").default(false), // Highlight on homepage
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  source: text("source").notNull(), // Where they downloaded from (pricing, portfolio, etc.)
  resourceRequested: text("resource_requested").notNull(), // What they downloaded
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  services: true,
  projectType: true,
  location: true,
  projectDetails: true,
  timeline: true,
  budgetRange: true,
  referenceFiles: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  content: true,
  excerpt: true,
  featuredImage: true,
  substackEmbedCode: true,
  tags: true,
  published: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).pick({
  title: true,
  description: true,
  sketchfabModelId: true,
  lumaEmbedUrl: true,
  polycamEmbedUrl: true,
  modelFile: true,
  modelFormat: true,
  videoFile: true,
  videoFormat: true,
  category: true,
  tools: true,
  services: true,
  featuredImage: true,
  images: true,
  published: true,
  featured: true,
  isConceptStudy: true,
  hasCustomLayout: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  name: true,
  email: true,
  company: true,
  role: true,
  rating: true,
  reviewText: true,
  projectType: true,
}).extend({
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10).max(1000),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  company: true,
  source: true,
  resourceRequested: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
