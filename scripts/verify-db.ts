import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

async function verify() {
  try {
    console.log('🔍 Verifying database contents...\n');

    const result = await db.all(sql`SELECT id, title, category, published, featured FROM portfolio_items`);

    console.log(`Found ${result.length} portfolio items:\n`);
    result.forEach((item: any) => {
      console.log(`  ${item.id}. ${item.title}`);
      console.log(`     Category: ${item.category}`);
      console.log(`     Published: ${item.published ? 'Yes' : 'No'}`);
      console.log(`     Featured: ${item.featured ? 'Yes' : 'No'}\n`);
    });

    console.log('✅ Database verification complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verify();
