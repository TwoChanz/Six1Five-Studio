import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Update School Watchtower portfolio item cover photo
 * Usage: tsx scripts/update-watchtower-cover.ts
 */

const useSqlite = process.env.USE_SQLITE === 'true';
const coverPhotoPath = "/assets/lhs-field/lhs-watchtower-hero.webp";

async function updateWatchtowerCover() {
  try {
    console.log("📍 Updating School Watchtower cover photo...");

    if (useSqlite) {
      await db.run(sql`
        UPDATE portfolio_items
        SET featured_image = ${coverPhotoPath}
        WHERE title LIKE '%Watchtower%'
      `);

      const updated = await db.all(sql`
        SELECT id, title, featured_image
        FROM portfolio_items
        WHERE title LIKE '%Watchtower%'
      `);

      if (updated.length > 0) {
        console.log("✅ Updated!");
        console.log(`   Title: ${updated[0].title}`);
        console.log(`   Featured Image: ${updated[0].featured_image}`);
      } else {
        console.log("❌ No item found matching '%Watchtower%'");
      }
    } else {
      const result = await db.execute(sql`
        UPDATE portfolio_items
        SET featured_image = ${coverPhotoPath}
        WHERE title LIKE '%Watchtower%'
        RETURNING id, title, featured_image
      `);

      if (result.rows && result.rows.length > 0) {
        console.log("✅ Updated!");
        console.log(`   Title: ${result.rows[0].title}`);
        console.log(`   Featured Image: ${result.rows[0].featured_image}`);
      } else {
        console.log("❌ No item found matching '%Watchtower%'");
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

updateWatchtowerCover();
