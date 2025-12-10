import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const items = await sql`SELECT id, title, featured_image, images FROM portfolio_items WHERE title ILIKE '%Athletic Field%'`;
console.log("Athletic Field project:");
console.log(JSON.stringify(items[0], null, 2));
