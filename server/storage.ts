// @ts-nocheck
import {
  users,
  contactSubmissions,
  blogPosts,
  portfolioItems,
  reviews,
  leads,
  type User,
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type BlogPost,
  type InsertBlogPost,
  type PortfolioItem,
  type InsertPortfolioItem,
  type Review,
  type InsertReview,
  type Lead,
  type InsertLead
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc, sql } from "drizzle-orm";

// Check if using SQLite (arrays stored as JSON strings)
const useSqlite = process.env.USE_SQLITE === 'true';

/**
 * Deserialize JSON string arrays for SQLite
 * SQLite stores arrays as JSON strings, so we need to parse them back to arrays
 */
function deserializeArrayFields<T extends Record<string, any>>(
  item: T,
  arrayFields: (keyof T)[]
): T {
  if (!useSqlite || !item) return item;

  const deserialized = { ...item };
  for (const field of arrayFields) {
    const value = deserialized[field];
    if (value && typeof value === 'string') {
      try {
        deserialized[field] = JSON.parse(value) as any;
      } catch (e) {
        console.warn(`Failed to parse ${String(field)} as JSON:`, value);
        deserialized[field] = [] as any;
      }
    } else if (value === null || value === undefined) {
      deserialized[field] = [] as any;
    }
  }
  return deserialized;
}

/**
 * Map SQLite column names (snake_case) to TypeScript properties (camelCase)
 */
function mapPortfolioColumns(item: any): PortfolioItem {
  if (!useSqlite) return item;

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    sketchfabModelId: item.sketchfab_model_id,
    lumaEmbedUrl: item.luma_embed_url,
    polycamEmbedUrl: item.polycam_embed_url,
    modelFile: item.model_file,
    modelFormat: item.model_format,
    videoFile: item.video_file,
    videoFormat: item.video_format,
    category: item.category,
    tools: item.tools,
    services: item.services,
    featuredImage: item.featured_image,
    images: item.images,
    published: Boolean(item.published),
    featured: Boolean(item.featured),
    isConceptStudy: Boolean(item.is_concept_study),
    hasCustomLayout: Boolean(item.has_custom_layout),
    createdAt: item.created_at,
  } as PortfolioItem;
}

/**
 * Deserialize portfolio item arrays
 */
function deserializePortfolioItem(item: PortfolioItem | undefined): PortfolioItem | undefined {
  if (!item) return undefined;
  const mapped = mapPortfolioColumns(item);
  return deserializeArrayFields(mapped, ['tools', 'services', 'images']);
}

/**
 * Map SQLite column names (snake_case) to TypeScript properties (camelCase) for blog posts
 */
function mapBlogPostColumns(post: any): BlogPost {
  if (!useSqlite) return post;

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    featuredImage: post.featured_image,
    substackEmbedCode: post.substack_embed_code,
    tags: post.tags,
    published: Boolean(post.published),
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  } as BlogPost;
}

/**
 * Deserialize blog post arrays
 */
function deserializeBlogPost(post: BlogPost | undefined): BlogPost | undefined {
  if (!post) return undefined;
  const mapped = mapBlogPostColumns(post);
  return deserializeArrayFields(mapped, ['tags']);
}

/**
 * Deserialize contact submission arrays
 */
function deserializeContactSubmission(submission: ContactSubmission | undefined): ContactSubmission | undefined {
  if (!submission) return undefined;
  return deserializeArrayFields(submission, ['services', 'referenceFiles']);
}

/**
 * Map SQLite column names (snake_case) to TypeScript properties (camelCase) for reviews
 */
function mapReviewColumns(review: any): Review {
  if (!useSqlite) return review;

  return {
    id: review.id,
    name: review.name,
    email: review.email,
    company: review.company,
    role: review.role,
    rating: review.rating,
    reviewText: review.review_text,
    projectType: review.project_type,
    approved: Boolean(review.approved),
    featured: Boolean(review.featured),
    createdAt: review.created_at,
  } as Review;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  deleteContactSubmission(id: number): Promise<void>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Portfolio methods
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPublishedPortfolioItems(): Promise<PortfolioItem[]>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemById(id: number): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, updates: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<void>;

  // Review methods
  getReviews(): Promise<Review[]>;
  getApprovedReviews(): Promise<Review[]>;
  getFeaturedReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<Review | undefined>;
  toggleFeaturedReview(id: number): Promise<Review | undefined>;
  deleteReview(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    try {
      const result = await db
        .insert(contactSubmissions)
        .values(insertSubmission)
        .returning();
      
      if (result && result[0]) {
        return deserializeContactSubmission(result[0])!;
      }
      
      // Fallback for SQLite: query the last inserted record
      const [lastInserted] = await db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.id))
        .limit(1);
      
      return deserializeContactSubmission(lastInserted)!;
    } catch (error) {
      console.error('❌ Database insert error:', error);
      throw error;
    }
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    const results = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
    return results.map(s => deserializeContactSubmission(s)!);
  }

  async deleteContactSubmission(id: number): Promise<void> {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM blog_posts ORDER BY created_at DESC`) as any[];
      return results.map(p => deserializeBlogPost(p as BlogPost)!);
    }
    const results = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
    return results.map(p => deserializeBlogPost(p)!);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC`) as any[];
      return results.map(p => deserializeBlogPost(p as BlogPost)!);
    }
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
    return results.map(p => deserializeBlogPost(p)!);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM blog_posts WHERE slug = ${slug}`) as any[];
      return deserializeBlogPost(results[0] as BlogPost);
    }
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return deserializeBlogPost(post);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    return deserializeBlogPost(updated);
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Portfolio methods
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM portfolio_items ORDER BY created_at DESC`) as any[];
      return results.map(i => deserializePortfolioItem(i as PortfolioItem)!);
    }
    const results = await db
      .select()
      .from(portfolioItems)
      .orderBy(desc(portfolioItems.createdAt));
    return results.map(i => deserializePortfolioItem(i)!);
  }

  async getPublishedPortfolioItems(): Promise<PortfolioItem[]> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM portfolio_items WHERE published = 1 ORDER BY created_at DESC`) as any[];
      return results.map(i => deserializePortfolioItem(i as PortfolioItem)!);
    }
    const results = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.published, true))
      .orderBy(desc(portfolioItems.createdAt));
    return results.map(i => deserializePortfolioItem(i)!);
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    if (useSqlite) {
      const results = await db.all(sql`
        SELECT * FROM portfolio_items
        WHERE featured = 1
        ORDER BY
          CASE WHEN id = 6 THEN 0 ELSE 1 END,
          created_at DESC
      `) as any[];
      return results.map(i => deserializePortfolioItem(i as PortfolioItem)!);
    }
    const results = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.featured, true))
      .orderBy(desc(portfolioItems.createdAt));

    // Prioritize Floyd Stadium (ID: 6) to appear first
    return results
      .map(i => deserializePortfolioItem(i)!)
      .sort((a, b) => {
        if (a.id === 6) return -1;
        if (b.id === 6) return 1;
        return 0;
      });
  }

  async getPortfolioItemById(id: number): Promise<PortfolioItem | undefined> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM portfolio_items WHERE id = ${id}`) as any[];
      return deserializePortfolioItem(results[0] as PortfolioItem);
    }
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return deserializePortfolioItem(item);
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const [item] = await db
      .insert(portfolioItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updatePortfolioItem(id: number, updates: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    const [updated] = await db
      .update(portfolioItems)
      .set(updates)
      .where(eq(portfolioItems.id, id))
      .returning();
    return deserializePortfolioItem(updated);
  }

  async deletePortfolioItem(id: number): Promise<void> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  }

  // Review methods
  async getReviews(): Promise<Review[]> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM reviews ORDER BY created_at DESC`) as any[];
      return results.map(r => mapReviewColumns(r));
    }
    const results = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt));
    return results;
  }

  async getApprovedReviews(): Promise<Review[]> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM reviews WHERE approved = 1 ORDER BY created_at DESC`) as any[];
      return results.map(r => mapReviewColumns(r));
    }
    const results = await db
      .select()
      .from(reviews)
      .where(eq(reviews.approved, true))
      .orderBy(desc(reviews.createdAt));
    return results;
  }

  async getFeaturedReviews(): Promise<Review[]> {
    if (useSqlite) {
      const results = await db.all(sql`SELECT * FROM reviews WHERE approved = 1 AND featured = 1 ORDER BY created_at DESC`) as any[];
      return results.map(r => mapReviewColumns(r));
    }
    const results = await db
      .select()
      .from(reviews)
      .where(eq(reviews.approved, true))
      .where(eq(reviews.featured, true))
      .orderBy(desc(reviews.createdAt));
    return results;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    if (useSqlite) {
      const now = new Date().toISOString();
      const result = await db.run(sql`
        INSERT INTO reviews (
          name, email, company, role, rating, review_text,
          project_type, approved, featured, created_at
        ) VALUES (
          ${insertReview.name},
          ${insertReview.email || null},
          ${insertReview.company || null},
          ${insertReview.role || null},
          ${insertReview.rating},
          ${insertReview.reviewText},
          ${insertReview.projectType},
          0,
          0,
          ${now}
        )
      `);

      const [inserted] = await db.all(sql`SELECT * FROM reviews WHERE id = ${result.lastInsertRowid}`) as any[];
      return mapReviewColumns(inserted);
    }

    const [review] = await db
      .insert(reviews)
      .values(insertReview)
      .returning();
    return review;
  }

  async approveReview(id: number): Promise<Review | undefined> {
    if (useSqlite) {
      await db.run(sql`UPDATE reviews SET approved = 1 WHERE id = ${id}`);
      const [updated] = await db.all(sql`SELECT * FROM reviews WHERE id = ${id}`) as any[];
      return mapReviewColumns(updated);
    }

    const [updated] = await db
      .update(reviews)
      .set({ approved: true })
      .where(eq(reviews.id, id))
      .returning();
    return updated;
  }

  async toggleFeaturedReview(id: number): Promise<Review | undefined> {
    if (useSqlite) {
      await db.run(sql`UPDATE reviews SET featured = NOT featured WHERE id = ${id}`);
      const [updated] = await db.all(sql`SELECT * FROM reviews WHERE id = ${id}`) as any[];
      return mapReviewColumns(updated);
    }

    // For PostgreSQL, we need to get the current value first
    const [current] = await db.select().from(reviews).where(eq(reviews.id, id));
    if (!current) return undefined;

    const [updated] = await db
      .update(reviews)
      .set({ featured: !current.featured })
      .where(eq(reviews.id, id))
      .returning();
    return updated;
  }

  async deleteReview(id: number): Promise<void> {
    if (useSqlite) {
      await db.run(sql`DELETE FROM reviews WHERE id = ${id}`);
    } else {
      await db.delete(reviews).where(eq(reviews.id, id));
    }
  }

  // Lead magnet methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return allLeads;
  }

  async deleteLead(id: number): Promise<void> {
    if (useSqlite) {
      await db.run(sql`DELETE FROM leads WHERE id = ${id}`);
    } else {
      await db.delete(leads).where(eq(leads.id, id));
    }
  }
}

export const storage = new DatabaseStorage();
