import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Add Floyd Stadium portfolio item with Luma cinematic video
 */

const useSqlite = process.env.USE_SQLITE === 'true';

async function addFloydStadium() {
  try {
    const now = new Date().toISOString();
    const newItem = {
      title: "Floyd Stadium – MTSU | Drone Photogrammetry Scan",
      description: "High-resolution aerial photogrammetry scan of Middle Tennessee State University's Floyd Stadium. This comprehensive 3D model captures the entire stadium complex, including seating areas, field, and surrounding facilities. Created using Luma AI NeRF technology for photorealistic rendering and smooth flythrough animations.",
      category: "photogrammetry",
      sketchfabModelId: null,
      lumaEmbedUrl: "https://lumalabs.ai/embed/8e55f9bc-5520-455c-8cc3-5139749ad2a2?mode=video&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=https%3A%2F%2Fcdn-luma.com%2Frenders%2Fb5cab897cae1f38e545f04229f2626fc5c59dad45538b06115c66f8b980f1b5f%2FMTSU_MurphyCenter_video.mp4&showMenu=true",
      polycamEmbedUrl: null,
      modelFile: null,
      modelFormat: null,
      videoFile: null,
      videoFormat: null,
      tools: ["DJI Drone", "Luma AI", "NeRF Technology", "Photogrammetry"],
      services: ["Aerial Mapping", "3D Reconstruction", "Stadium Documentation", "Cinematic Rendering"],
      featuredImage: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      images: [],
      published: true,
      featured: true,
    };

    console.log("📍 Adding Floyd Stadium – MTSU portfolio item...");

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

    console.log("✅ Floyd Stadium added successfully!");
    console.log("⭐ Featured item with Luma AI cinematic video");
    console.log("🎬 Video mode enabled with rendered walkthrough");
    console.log("📍 Visit http://localhost:5000/gallery to see it");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding item:", error);
    process.exit(1);
  }
}

addFloydStadium();
