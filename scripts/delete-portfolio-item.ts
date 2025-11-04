import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Delete a portfolio item by ID
 *
 * Usage: npx tsx scripts/delete-portfolio-item.ts <id>
 */

const useSqlite = process.env.USE_SQLITE === 'true';
const itemId = process.argv[2];

async function deleteItem() {
  try {
    if (!itemId) {
      console.error("❌ Please provide an item ID to delete");
      console.log("Usage: npx tsx scripts/delete-portfolio-item.ts <id>");
      process.exit(1);
    }

    console.log(`🗑️  Deleting portfolio item with ID ${itemId}...`);

    const result = await db.run(sql`
      DELETE FROM portfolio_items WHERE id = ${itemId}
    `);

    console.log("✅ Portfolio item deleted successfully!");
    console.log("🔄 Refresh your browser to see the changes");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    process.exit(1);
  }
}

deleteItem();
