import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  process.exit(1);
}

async function checkItems() {
  const sql = neon(DATABASE_URL);
  
  const items = await sql`
    SELECT id, title, category, published, "isConceptStudy", "coverImage"
    FROM portfolio_items
    ORDER BY id
  `;
  
  console.log("\nAll portfolio items in database:");
  console.log("=====================================");
  items.forEach((item: any) => {
    console.log(`ID ${item.id}: ${item.title}`);
    console.log(`  Category: ${item.category}`);
    console.log(`  Published: ${item.published}`);
    console.log(`  Concept Study: ${item.isConceptStudy}`);
    console.log(`  Cover Image: ${item.coverImage}`);
    console.log("");
  });
  console.log(`Total items: ${items.length}`);
}

checkItems().catch(console.error);

