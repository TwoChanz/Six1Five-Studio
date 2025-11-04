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
      title: "Middle TN Clubhouse - Polycam 3D Capture",
      description: "A detailed 3D capture of a Middle Tennessee clubhouse facility using Polycam technology. This model showcases the architectural features and site layout, demonstrating the versatility of mobile 3D scanning for real estate and construction documentation.",
      category: "construction",
      sketchfabModelId: null,
      lumaEmbedUrl: null,
      polycamEmbedUrl: "https://poly.cam/capture/f74d19f9-a7f2-4efa-aa04-129282900374",
      modelFile: null,
      modelFormat: null,
      videoFile: null,
      videoFormat: null,
      tools: ["Polycam", "Mobile Photogrammetry"],
      services: ["3D Site Documentation", "Real Estate Capture", "Construction Monitoring"],
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
          luma_embed_url, polycam_embed_url,
          model_file, model_format, video_file, video_format,
          tools, services, featured_image, images,
          published, featured, created_at
        ) VALUES (
          ${newItem.title},
          ${newItem.description},
          ${newItem.category},
          ${newItem.sketchfabModelId},
          ${newItem.lumaEmbedUrl},
          ${newItem.polycamEmbedUrl},
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
