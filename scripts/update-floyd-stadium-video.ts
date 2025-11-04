import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Update Floyd Stadium item with cinematic video embed URL
 *
 * Usage: npx tsx scripts/update-floyd-stadium-video.ts
 */

const useSqlite = process.env.USE_SQLITE === 'true';

async function updateFloydStadium() {
  try {
    console.log("🎬 Updating Floyd Stadium with cinematic video mode...");

    // Full Luma embed URL with cinematic video
    const cinematicEmbedUrl = "https://lumalabs.ai/embed/8e55f9bc-5520-455c-8cc3-5139749ad2a2?mode=video&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=https%3A%2F%2Fcdn-luma.com%2Frenders%2Fb5cab897cae1f38e545f04229f2626fc5c59dad45538b06115c66f8b980f1b5f%2FMTSU_MurphyCenter_video.mp4&showMenu=true";

    const result = await db.run(sql`
      UPDATE portfolio_items
      SET luma_embed_url = ${cinematicEmbedUrl}
      WHERE id = 9
    `);

    console.log("✅ Floyd Stadium updated successfully!");
    console.log("🎥 Now using cinematic video mode with rendered walkthrough");
    console.log("🔄 Refresh your browser to see the video embed");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating item:", error);
    process.exit(1);
  }
}

updateFloydStadium();
