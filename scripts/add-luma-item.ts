import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Add a Luma AI portfolio item
 *
 * Usage: tsx scripts/add-luma-item.ts
 */

const useSqlite = process.env.USE_SQLITE === 'true';

async function addLumaItem() {
  try {
    const now = new Date().toISOString();
    const newItem = {
      title: "Luma AI NeRF Capture",
      description: "A high-quality Neural Radiance Field (NeRF) capture created with Luma AI, showcasing photorealistic 3D reconstruction with advanced lighting and material representation. This technology enables immersive virtual tours and detailed spatial analysis.",
      category: "photogrammetry",
      sketchfabModelId: null,
      lumaEmbedUrl: "8e55f9bc-5520-455c-8cc3-5139749ad2a2", // Just the capture ID
      polycamEmbedUrl: null,
      modelFile: null,
      modelFormat: null,
      videoFile: null,
      videoFormat: null,
      tools: ["Luma AI", "NeRF Technology", "AI-Powered Reconstruction"],
      services: ["3D Reconstruction", "Virtual Tours", "Photorealistic Rendering"],
      featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      images: [],
      published: true,
      featured: true, // Make it featured to show the "View 3D" button
    };

    console.log("Adding Luma AI portfolio item...");

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
    } else {
      // For PostgreSQL: use array literals
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

    console.log("✅ Luma AI portfolio item added successfully!");
    console.log("📍 Visit http://localhost:5000/gallery to see it");
    console.log("⭐ This item is marked as 'featured' so it will have the 'View 3D' button");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding portfolio item:", error);
    process.exit(1);
  }
}

addLumaItem();
