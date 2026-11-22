import 'dotenv/config';
import { db } from "../server/db.js";
import { portfolioItems } from "../shared/schema.js";
import { eq } from "drizzle-orm";

async function updateChurchPortfolio() {
  try {
    console.log("🔧 Updating Historic Church portfolio item...");

    // Update ID 23 (the church project) to remove large file references
    const result = await db
      .update(portfolioItems)
      .set({
        modelFile: null,
        modelFormat: null,
        videoFile: null,
        videoFormat: null
      })
      .where(eq(portfolioItems.id, 23))
      .returning();

    console.log("✅ Portfolio item updated successfully!");
    console.log("Church portfolio now displays 8K cover image only.");
    console.log("3D model and video removed until hosted on CDN.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating portfolio item:", error);
    process.exit(1);
  }
}

updateChurchPortfolio();
