import 'dotenv/config';
import { db } from "../server/db.js";
import { sql } from "drizzle-orm";

async function checkLumaUrl() {
  try {
    const result = await db.get(sql`
      SELECT id, title, luma_embed_url, polycam_embed_url
      FROM portfolio_items
      WHERE id = 9
    `) as any;

    console.log("Database value for Floyd Stadium (ID 9):");
    console.log(JSON.stringify(result, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkLumaUrl();
