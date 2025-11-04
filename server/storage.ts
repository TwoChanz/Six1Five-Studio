// @ts-nocheck
import {
  users,
  contactSubmissions,
  blogPosts,
  portfolioItems,
  type User,
  type InsertUser,
  type ContactSubmission,
  type InsertContactSubmission,
  type BlogPost,
  type InsertBlogPost,
  type PortfolioItem,
  type InsertPortfolioItem
} from "@shared/schema";
import { db } from "./db";
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
 * Deserialize blog post arrays
 */
function deserializeBlogPost(post: BlogPost | undefined): BlogPost | undefined {
  if (!post) return undefined;
  return deserializeArrayFields(post, ['tags']);
}

/**
 * Deserialize contact submission arrays
 */
function deserializeContactSubmission(submission: ContactSubmission | undefined): ContactSubmission | undefined {
  if (!submission) return undefined;
  return deserializeArrayFields(submission, ['services', 'referenceFiles']);
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
    const results = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
    return results.map(p => deserializeBlogPost(p)!);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
    return results.map(p => deserializeBlogPost(p)!);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
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
      const results = await db.all(sql`SELECT * FROM portfolio_items WHERE featured = 1 ORDER BY created_at DESC`) as any[];
      return results.map(i => deserializePortfolioItem(i as PortfolioItem)!);
    }
    const results = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.featured, true))
      .orderBy(desc(portfolioItems.createdAt));
    return results.map(i => deserializePortfolioItem(i)!);
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
}

export const storage = new DatabaseStorage();
