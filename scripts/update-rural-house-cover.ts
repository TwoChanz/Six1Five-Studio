import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Update Rural House portfolio item cover photo
 * Supports both SQLite and PostgreSQL databases
 */

const useSqlite = process.env.USE_SQLITE === 'true';

async function updateRuralHouseCover() {
  try {
    // Update Rural House project (ID 2) with the user-provided screenshot
    // The screenshot shows the aerial view of the white farmhouse with surrounding property
    const coverPhotoPath = "/assets/rural-house-cover.jpg";
    
    console.log("📍 Updating Rural House cover photo...");

    let result;
    if (useSqlite) {
      result = await db.run(sql`
        UPDATE portfolio_items 
        SET featured_image = ${coverPhotoPath}
        WHERE id = 2
      `);
      
      // Fetch the updated item to display confirmation
      const updated = await db.all(sql`
        SELECT id, title, featured_image 
        FROM portfolio_items 
        WHERE id = 2
      `);
      
      if (updated.length > 0) {
        console.log("✅ Successfully updated Rural House cover photo!");
        console.log(`   Featured Image: ${updated[0].featured_image}`);
        console.log(`   Title: ${updated[0].title}`);
      } else {
        console.log("❌ No portfolio item found with ID 2");
      }
    } else {
      result = await db.execute(sql`
        UPDATE portfolio_items 
        SET featured_image = ${coverPhotoPath}
        WHERE id = 2
        RETURNING id, title, featured_image
      `);
      
      if (result.rows && result.rows.length > 0) {
        console.log("✅ Successfully updated Rural House cover photo!");
        console.log(`   Featured Image: ${result.rows[0].featured_image}`);
        console.log(`   Title: ${result.rows[0].title}`);
      } else {
        console.log("❌ No portfolio item found with ID 2");
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating cover photo:", error);
    process.exit(1);
  }
}

updateRuralHouseCover();

