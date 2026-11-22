/**
 * Set hasCustomLayout flag for the Wolverines Track & Field project
 * 
 * Usage: npx tsx scripts/set-custom-layout-flag.ts
 */

import 'dotenv/config';
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  process.exit(1);
}

async function setCustomLayoutFlag() {
  try {
    const sql = neon(DATABASE_URL);
    
    // Find the Wolverines project by title
    const items = await sql`
      SELECT id, title, has_custom_layout
      FROM portfolio_items
      WHERE title ILIKE '%Wolverines%' OR title ILIKE '%Athletic Field%'
    `;
    
    if (items.length === 0) {
      console.log("❌ Wolverines/Athletic Field project not found!");
      process.exit(1);
    }
    
    const item = items[0];
    console.log(`Found project: ${item.title} (ID: ${item.id})`);
    console.log(`Current has_custom_layout: ${item.has_custom_layout || false}`);
    
    // Update the flag
    await sql`
      UPDATE portfolio_items
      SET has_custom_layout = true
      WHERE id = ${item.id}
    `;
    
    console.log("\n✅ Updated has_custom_layout flag to true");
    
    // Verify the update
    const updated = await sql`
      SELECT id, title, has_custom_layout
      FROM portfolio_items
      WHERE id = ${item.id}
    `;
    
    console.log("\nVerification:");
    console.log(JSON.stringify(updated[0], null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

setCustomLayoutFlag();

