import { db } from "../server/db.js";
import { portfolioItems } from "../shared/schema.js";
import { eq } from "drizzle-orm";

/**
 * Simple script to add a portfolio item to the gallery
 *
 * Usage: tsx scripts/add-portfolio-item.ts
 */

async function addPortfolioItem() {
  try {
    const newItem = {
      title: "Sample 3D Model",
      description: "A sample portfolio item. Replace this with your actual project details.",
      category: "photogrammetry",
      sketchfabModelId: null, // Add your Sketchfab model ID here (e.g., "abc123def456")
      localModelPath: null,
      videoWalkthroughUrl: null,
      tools: ["DJI Mavic 3", "RealityCapture", "Metashape"],
      services: ["Aerial Mapping", "3D Modeling"],
      isPublished: true,
      isFeatured: false,
      tags: ["sample", "test"]
    };

    console.log("Adding portfolio item...");
    const result = await db.insert(portfolioItems).values(newItem).returning();

    console.log("✅ Portfolio item added successfully!");
    console.log(JSON.stringify(result[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding portfolio item:", error);
    process.exit(1);
  }
}

addPortfolioItem();
