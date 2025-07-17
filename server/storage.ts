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
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Portfolio methods
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPublishedPortfolioItems(): Promise<PortfolioItem[]>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItemById(id: number): Promise<PortfolioItem | undefined>;
  getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
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
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  // Portfolio methods
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return await db
      .select()
      .from(portfolioItems)
      .orderBy(desc(portfolioItems.createdAt));
  }

  async getPublishedPortfolioItems(): Promise<PortfolioItem[]> {
    return await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.published, true))
      .orderBy(desc(portfolioItems.createdAt));
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    return await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.featured, true))
      .orderBy(desc(portfolioItems.createdAt));
  }

  async getPortfolioItemById(id: number): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return item || undefined;
  }

  async getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.slug, slug));
    return item || undefined;
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    const [item] = await db
      .insert(portfolioItems)
      .values(insertItem)
      .returning();
    return item;
  }
}

export const storage = new DatabaseStorage();
