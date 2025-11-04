import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Migration: Add Luma AI and Polycam embed URL columns to portfolio_items table
 */

async function addEmbedColumns() {
  try {
    console.log("🔧 Adding embed URL columns to portfolio_items table...\n");

    // Add luma_embed_url column
    await db.run(sql`
      ALTER TABLE portfolio_items
      ADD COLUMN luma_embed_url TEXT
    `);
    console.log("✅ Added luma_embed_url column");

    // Add polycam_embed_url column
    await db.run(sql`
      ALTER TABLE portfolio_items
      ADD COLUMN polycam_embed_url TEXT
    `);
    console.log("✅ Added polycam_embed_url column");

    console.log("\n✅ Migration complete! Portfolio table now supports Luma AI and Polycam embeds.\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

addEmbedColumns();
