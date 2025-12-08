import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_kOU1iKlwVS5e@ep-bold-forest-aem4u633-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

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

