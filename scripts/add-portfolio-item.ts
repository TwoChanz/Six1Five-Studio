import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Simple script to add a portfolio item to the gallery
 *
 * Usage: tsx scripts/add-portfolio-item.ts
 */

const useSqlite = process.env.USE_SQLITE === 'true';

async function addPortfolioItem() {
  try {
    const now = new Date().toISOString();
    const newItem = {
      title: "Sample 3D Model",
      description: "A sample portfolio item. Replace this with your actual project details.",
      category: "photogrammetry",
      sketchfabModelId: null, // Add your Sketchfab model ID here (e.g., "abc123def456")
      modelFile: null,
      modelFormat: null,
      videoFile: null,
      videoFormat: null,
      tools: ["DJI Mavic 3", "RealityCapture", "Metashape"],
      services: ["Aerial Mapping", "3D Modeling"],
      featuredImage: null,
      images: [],
      published: true,
      featured: false,
    };

    console.log("Adding portfolio item...");

    let result;
    if (useSqlite) {
      // For SQLite: manually insert with JSON-stringified arrays
      result = await db.run(sql`
        INSERT INTO portfolio_items (
          title, description, category, sketchfab_model_id,
          model_file, model_format, video_file, video_format,
          tools, services, featured_image, images,
          published, featured, created_at
        ) VALUES (
          ${newItem.title},
          ${newItem.description},
          ${newItem.category},
          ${newItem.sketchfabModelId},
          ${newItem.modelFile},
          ${newItem.modelFormat},
          ${newItem.videoFile},
          ${newItem.videoFormat},
          ${JSON.stringify(newItem.tools)},
          ${JSON.stringify(newItem.services)},
          ${newItem.featuredImage},
          ${JSON.stringify(newItem.images)},
          ${newItem.published ? 1 : 0},
          ${newItem.featured ? 1 : 0},
          ${now}
        )
      `);
      console.log("✅ Portfolio item added successfully!");
      console.log(`   ID: ${result.lastInsertRowid}`);
    } else {
      // For PostgreSQL: use Drizzle ORM with array support
      const { portfolioItems } = await import("../shared/schema.js");
      const inserted = await db.insert(portfolioItems).values({
        ...newItem,
        createdAt: new Date(now)
      }).returning();
      console.log("✅ Portfolio item added successfully!");
      console.log(JSON.stringify(inserted[0], null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding portfolio item:", error);
    process.exit(1);
  }
}

addPortfolioItem();
