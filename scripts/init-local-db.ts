import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from "../shared/schema.js";
import path from "path";
import { fileURLToPath } from "url";
import { sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initializes the local SQLite database with schema
 *
 * Usage: tsx scripts/init-local-db.ts
 */

async function initLocalDb() {
  try {
    console.log('📦 Initializing local SQLite database...\n');

    // Create/open SQLite database
    const dbPath = path.join(__dirname, '..', 'local.db');
    console.log(`📍 Database path: ${dbPath}`);

    const sqlite = new Database(dbPath);
    sqlite.pragma('foreign_keys = ON');

    const db = drizzle({ client: sqlite, schema });

    // Create tables manually (since migrations might not exist for SQLite)
    console.log('🏗️  Creating tables...');

    // Users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Contact submissions table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        project_type TEXT NOT NULL,
        location TEXT NOT NULL,
        services TEXT NOT NULL,
        timeline TEXT,
        budget_range TEXT,
        project_details TEXT NOT NULL,
        reference_files TEXT,
        submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Blog posts table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        cover_image_url TEXT,
        author TEXT,
        tags TEXT,
        is_published INTEGER DEFAULT 0,
        published_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Portfolio items table
    sqlite.exec(`DROP TABLE IF EXISTS portfolio_items;`);
    sqlite.exec(`
      CREATE TABLE portfolio_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        sketchfab_model_id TEXT,
        model_file TEXT,
        model_format TEXT,
        video_file TEXT,
        video_format TEXT,
        category TEXT NOT NULL,
        tools TEXT,
        services TEXT,
        featured_image TEXT,
        images TEXT,
        published INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database initialized successfully!\n');
    console.log('💡 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Seed sample data: tsx scripts/seed-sample-portfolio.ts');
    console.log('   3. View gallery: http://localhost:5000/gallery\n');

    sqlite.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initLocalDb();
