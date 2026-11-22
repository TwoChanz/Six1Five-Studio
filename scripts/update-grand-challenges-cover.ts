import 'dotenv/config';
import { db } from "../server/db.js";
import { portfolioItems } from "../shared/schema.js";
import { eq } from "drizzle-orm";

/**
 * Update Grand Challenges portfolio item with new cover photo
 */

async function updateCoverPhoto() {
  try {
    console.log("📸 Updating Grand Challenges cover photo...");

    const itemId = 15; // Grand Challenges Research Facility
    const newCoverPhoto = "/images/grand_challenges.png";

    await db
      .update(portfolioItems)
      .set({ featuredImage: newCoverPhoto })
      .where(eq(portfolioItems.id, itemId));

    console.log("✅ Cover photo updated successfully!");
    console.log(`📍 Image path: ${newCoverPhoto}`);
    console.log("🔄 Refresh your browser to see the changes");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating cover photo:", error);
    process.exit(1);
  }
}

updateCoverPhoto();
