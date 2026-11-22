import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * List all portfolio items
 *
 * Usage: npx tsx scripts/list-portfolio-items.ts
 */

const useSqlite = process.env.USE_SQLITE === 'true';

async function listItems() {
  try {
    console.log("📋 Fetching all portfolio items...\n");

    const result = useSqlite
      ? await db.all(sql`SELECT id, title, luma_embed_url, polycam_embed_url, sketchfab_model_id, featured_image, featured, published FROM portfolio_items ORDER BY id`)
      : await db.execute(sql`SELECT id, title, luma_embed_url, polycam_embed_url, sketchfab_model_id, featured_image, featured, published FROM portfolio_items ORDER BY id`);

    const items = useSqlite ? result : result.rows;

    if (items.length === 0) {
      console.log("No items found.");
      process.exit(0);
    }

    items.forEach((item: any) => {
      console.log(`ID: ${item.id}`);
      console.log(`  Title: ${item.title}`);
      console.log(`  Featured: ${item.featured ? '⭐ Yes' : 'No'}`);
      console.log(`  Published: ${item.published ? '✅' : '❌'}`);
      if (item.featured_image) console.log(`  Cover Photo: ${item.featured_image}`);
      if (item.luma_embed_url) console.log(`  Luma: ${item.luma_embed_url}`);
      if (item.polycam_embed_url) console.log(`  Polycam: ${item.polycam_embed_url}`);
      if (item.sketchfab_model_id) console.log(`  Sketchfab: ${item.sketchfab_model_id}`);
      console.log('');
    });

    console.log(`\nTotal items: ${items.length}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error listing items:", error);
    process.exit(1);
  }
}

listItems();
