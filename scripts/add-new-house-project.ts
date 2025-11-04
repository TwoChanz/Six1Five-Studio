import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Add Rural House portfolio item
 */

const useSqlite = process.env.USE_SQLITE === 'true';

async function addRuralHouseProject() {
  try {
    const now = new Date().toISOString();
    const newItem = {
      title: "Rural Property Aerial Survey | Residential Mapping",
      description: "Comprehensive aerial photogrammetry capture of a rural residential property featuring a traditional farmhouse, mature landscaping, garden plots, and surrounding acreage. This high-resolution 3D scan showcases the entire property layout including the main house, outbuildings, garden beds, mature trees, and driveway access. Created using Luma AI NeRF technology for immersive property visualization ideal for real estate marketing, property planning, and documentation.",
      category: "photogrammetry",
      sketchfabModelId: null,
      lumaEmbedUrl: "https://lumalabs.ai/embed/5fa618d1-23c3-4171-a357-a0e9c817645d?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false",
      polycamEmbedUrl: null,
      modelFile: null,
      modelFormat: null,
      videoFile: null,
      videoFormat: null,
      tools: ["DJI Drone", "Luma AI", "NeRF Technology", "Photogrammetry"],
      services: ["Aerial Mapping", "3D Reconstruction", "Property Documentation", "Real Estate Marketing"],
      featuredImage: "/assets/5b54e829-fe69-47c6-910c-cacbfd506c38-thumbnail_1753546725097.webp",
      images: [],
      published: true,
      featured: false,
    };

    console.log("📍 Adding Rural House portfolio item...");

    let result;
    if (useSqlite) {
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
    } else {
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
          ${newItem.tools},
          ${newItem.services},
          ${newItem.featuredImage},
          ${newItem.images},
          ${newItem.published},
          ${newItem.featured},
          ${now}
        )
      `);
    }

    console.log("✅ Rural House project added successfully!");
    console.log("🏡 Property documentation with Luma AI NeRF");
    console.log("📍 Visit http://localhost:5000/gallery to see it");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding item:", error);
    process.exit(1);
  }
}

addRuralHouseProject();
