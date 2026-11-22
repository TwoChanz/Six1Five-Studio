import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Script to add reviews table to SQLite database
 *
 * Usage: npx tsx scripts/add-reviews-table.ts
 */

const useSqlite = process.env.USE_SQLITE === 'true';

async function addReviewsTable() {
  try {
    if (useSqlite) {
      console.log("Creating reviews table...");

      await db.run(sql`
        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          company TEXT,
          role TEXT,
          rating INTEGER NOT NULL,
          review_text TEXT NOT NULL,
          project_type TEXT NOT NULL,
          approved INTEGER DEFAULT 0,
          featured INTEGER DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log("✅ Reviews table created successfully!");
    } else {
      console.log("⚠️  This script is for SQLite only. For PostgreSQL, use Drizzle migrations.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating reviews table:", error);
    process.exit(1);
  }
}

addReviewsTable();
